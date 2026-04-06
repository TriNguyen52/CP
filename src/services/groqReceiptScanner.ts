import { GROQ_API_KEY, GROQ_CHAT_COMPLETIONS_URL } from "../config/groq";

const GROQ_OCR_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";

export type GroqReceiptItem = {
  name: string;
  price: number;
};

export type GroqReceiptScanResult = {
  amount?: number;
  merchant?: string;
  date?: string;
  items: GroqReceiptItem[];
};

type GroqMessageContentPart = {
  type: "text" | "image_url";
  text?: string;
  image_url?: {
    url: string;
  };
};

const OCR_PROMPT =
  "Extract the following from this receipt: total amount, merchant name, date, and itemized list. Return JSON with keys: amount, merchant, date, items (array of {name, price})";

const supportsImageInput = (model: string): boolean => {
  const normalized = model.toLowerCase();

  return (
    normalized.includes("vision") ||
    normalized.includes("llama-4-scout") ||
    normalized.includes("llava")
  );
};

const isPlaceholderGroqKey = (value: string): boolean => {
  const trimmed = value.trim();

  if (!trimmed) {
    return true;
  }

  return (
    trimmed === "YOUR_GROQ_API_KEY" ||
    trimmed === "YOUR_GROQ_API_KEY_HERE" ||
    trimmed.toUpperCase().includes("YOUR_GROQ_API_KEY")
  );
};

const normalizeAmount = (value: unknown): number | undefined => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : undefined;
  }

  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^0-9.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
};

const normalizeItems = (items: unknown): GroqReceiptItem[] => {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => {
      const name = typeof item?.name === "string" ? item.name.trim() : "";
      const price = normalizeAmount(item?.price);

      if (!name || price === undefined) {
        return null;
      }

      return {
        name,
        price,
      };
    })
    .filter((item): item is GroqReceiptItem => item !== null);
};

const extractJsonText = (content: string): string => {
  const withoutFences = content
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const start = withoutFences.indexOf("{");
  const end = withoutFences.lastIndexOf("}");

  if (start >= 0 && end > start) {
    return withoutFences.slice(start, end + 1);
  }

  return withoutFences;
};

const parseGroqContent = (content: unknown): string => {
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") {
          return part;
        }

        if (typeof part?.text === "string") {
          return part.text;
        }

        return "";
      })
      .join("\n")
      .trim();
  }

  return "";
};

export async function scanReceiptWithGroq(
  imageBase64: string
): Promise<GroqReceiptScanResult> {
  if (!imageBase64.trim()) {
    throw new Error("Missing receipt image data.");
  }

  if (isPlaceholderGroqKey(GROQ_API_KEY)) {
    throw new Error(
      "Missing EXPO_PUBLIC_GROQ_API_KEY. Add it to .env and restart Expo (npx expo start -c)."
    );
  }

  if (!supportsImageInput(GROQ_OCR_MODEL)) {
    throw new Error(
      "The selected Groq model does not support image OCR. Use a vision model."
    );
  }

  const content: GroqMessageContentPart[] = [
    {
      type: "text",
      text: OCR_PROMPT,
    },
    {
      type: "image_url",
      image_url: {
        url: `data:image/jpeg;base64,${imageBase64}`,
      },
    },
  ];

  const response = await fetch(GROQ_CHAT_COMPLETIONS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_OCR_MODEL,
      temperature: 0.1,
      messages: [
        {
          role: "user",
          content,
        },
      ],
    }),
  });

  if (!response.ok) {
    const rawError = await response.text();
    let details = "";

    if (rawError.trim()) {
      try {
        const parsedError = JSON.parse(rawError);
        const apiMessage = parsedError?.error?.message;
        details = typeof apiMessage === "string" ? apiMessage : rawError;
      } catch {
        details = rawError;
      }
    }

    const suffix = details ? `: ${details}` : "";
    throw new Error(`Groq request failed with status ${response.status}${suffix}`);
  }

  const payload = await response.json();
  const rawContent = payload?.choices?.[0]?.message?.content;
  const parsedContent = parseGroqContent(rawContent);

  if (!parsedContent) {
    throw new Error("No OCR content returned from Groq.");
  }

  const jsonText = extractJsonText(parsedContent);
  const parsed = JSON.parse(jsonText);

  return {
    amount: normalizeAmount(parsed?.amount),
    merchant:
      typeof parsed?.merchant === "string" ? parsed.merchant.trim() : undefined,
    date: typeof parsed?.date === "string" ? parsed.date.trim() : undefined,
    items: normalizeItems(parsed?.items),
  };
}
