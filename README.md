# CP — Collaborative Payments

CP is a mobile-first expense sharing app built with Expo + React Native.  
It helps groups track shared spending, split bills fairly, and settle debts with fewer transfers.

## What problem this project solves

Managing shared expenses in friend groups, roommates, or small teams is often messy:
- People lose receipts
- Splits are unclear (equal vs custom)
- Debt chains become hard to settle
- Spending patterns are not visible

CP addresses this by combining expense tracking, receipt-assisted input, balance calculation, and transaction minimization in one app flow.

## Target users

CP targets:
- Roommates sharing monthly costs
- Friends splitting trips, meals, and events
- Small groups coordinating recurring shared expenses

The app is designed for users who need clarity, speed, and fair settlement without spreadsheet-heavy workflows.

## Why this can be impactful

- **Reduces social friction:** clear balances and suggested settlements avoid awkward money conversations.
- **Saves time:** receipt scanning can prefill merchant, amount, and date.
- **Improves fairness:** supports multiple split types (equal, unequal, percentage, shares).
- **Drives better decisions:** dashboard visualizations make spending behavior easier to understand.

## Tech stack

- **Framework:** Expo, React Native, TypeScript
- **Navigation:** React Navigation (Bottom Tabs + Stack Navigators)
- **State management:** React Context (`AppDataContext`)
- **Charts/visualization:** `react-native-chart-kit`, `react-native-svg`
- **OCR + AI parsing:** Groq Chat Completions API (vision-capable model)
- **Testing:** Jest (`jest-expo`)

## Design approach

The project uses a feature-oriented structure under `src/`:
- `screens/` for user flows
- `components/` for reusable UI
- `navigation/` for route composition
- `state/` for centralized app data and business logic
- `services/` for external API integration (Groq)
- `utils/` for pure logic (receipt parsing, transaction minimization)

### Core design ideas

1. **Flow-first UX**
   - Home focuses on active groups
   - Add Expense supports both manual and scan-first entry
   - Dashboard surfaces spending analytics

2. **Single source of truth for group data**
   - Group creation, expenses, balances, and settlements are managed in `AppDataContext`.

3. **Progressive fallback strategy for scanning**
   - Native image picker first, Expo fallback when needed.

4. **Algorithmic settlement**
   - `minimizeTransactions` reduces the number of transfers required to settle balances.

## Getting started

### Prerequisites

- Node.js 18+ (recommended)
- npm
- Expo-compatible mobile environment (Expo Go or emulator/simulator)

### 1) Install dependencies

```bash
npm ci
```

### 2) Configure environment variables

Create a `.env` file in the project root:

```env
EXPO_PUBLIC_GROQ_API_KEY=your_groq_api_key
```

> Receipt OCR/AI parsing features require a valid Groq API key.

### 3) Run the app

```bash
npm start
```

Then choose a target:
- `a` for Android
- `i` for iOS
- `w` for Web

Or run directly:

```bash
npm run android
npm run ios
npm run web
```

### 4) Run tests

```bash
npm test -- --runInBand
```

## Current status

- The app currently uses mock seed data and in-memory state in `AppDataContext`.
- It already demonstrates complete product flows for group creation, expense entry, split validation, analytics, and settlement suggestions.
- This makes it a strong foundation for production hardening (backend, auth, persistence, and sync).
