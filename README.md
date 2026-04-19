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


