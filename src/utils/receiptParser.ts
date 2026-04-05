export interface ParsedReceipt {
  merchantName?: string;
  totalAmount?: number;
  date?: string;
  lineItems: string[];
}

const DATE_PATTERNS = [
  /\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\b/,
  /\b(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})\b/,
];

const MONEY_MATCH_REGEX = /(\d+[.,]\d{2})/g;
const MONEY_TEST_REGEX = /(\d+[.,]\d{2})/;

export function parseReceiptLines(lines: string[]): ParsedReceipt {
  const normalizedLines = lines
    .map((line) => line.trim())
    .filter(Boolean);

  if (normalizedLines.length === 0) {
    return { lineItems: [] };
  }

  const merchantName = normalizedLines[0];

  let detectedDate: string | undefined;
  for (const line of normalizedLines) {
    for (const pattern of DATE_PATTERNS) {
      const match = line.match(pattern);
      if (match?.[1]) {
        detectedDate = match[1];
        break;
      }
    }
    if (detectedDate) {
      break;
    }
  }

  const moneyValues: number[] = [];
  for (const line of normalizedLines) {
    const lineMatches = line.match(MONEY_MATCH_REGEX);
    if (!lineMatches) {
      continue;
    }

    lineMatches.forEach((value) => {
      const parsed = Number(value.replace(",", "."));
      if (!Number.isNaN(parsed)) {
        moneyValues.push(parsed);
      }
    });
  }

  const totalLine = normalizedLines.find((line) => /total|amount due|balance/i.test(line));
  let totalAmount: number | undefined;

  if (totalLine) {
    const totalMatch = totalLine.match(MONEY_MATCH_REGEX);
    if (totalMatch && totalMatch.length > 0) {
      totalAmount = Number(totalMatch[totalMatch.length - 1].replace(",", "."));
    }
  }

  if (totalAmount === undefined && moneyValues.length > 0) {
    totalAmount = Math.max(...moneyValues);
  }

  const lineItems = normalizedLines.filter((line) => {
    const hasMoney = MONEY_TEST_REGEX.test(line);
    const isTotalRow = /total|amount due|balance/i.test(line);
    return hasMoney && !isTotalRow;
  });

  return {
    merchantName,
    totalAmount,
    date: detectedDate,
    lineItems,
  };
}
