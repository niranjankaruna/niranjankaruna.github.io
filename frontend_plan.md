# CashFlow Frontend: React Application

> A modern React SPA hosted on GitHub Pages, connecting to the Spring Boot API backend with Supabase authentication.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                   GitHub Pages                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │             React Application (SPA)               │  │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────────────┐   │  │
│  │  │  Views  │  │  State  │  │  API Services   │   │  │
│  │  │         │  │ (Redux) │  │                 │   │  │
│  │  └─────────┘  └─────────┘  └─────────────────┘   │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
         │                              │
         ▼                              ▼
┌─────────────────┐           ┌─────────────────┐
│  Supabase Auth  │           │  Spring Boot    │
│  (Login/Signup) │           │  API Server     │
└─────────────────┘           └─────────────────┘
```

---

## Tech Stack

| Layer              | Technology                        |
|--------------------|-----------------------------------|
| Framework          | React 18+                         |
| Build Tool         | Vite                              |
| Language           | TypeScript                        |
| State Management   | Redux Toolkit / Zustand           |
| Routing            | React Router v6                   |
| UI Library         | Material UI / Tailwind CSS        |
| Authentication     | Supabase JS Client                |
| HTTP Client        | Axios / Fetch                     |
| Charts             | Recharts / Chart.js               |
| Hosting            | GitHub Pages                      |

---

## SOLID Principles Implementation

### Single Responsibility Principle (SRP)
- Separate components: `TransactionList`, `TransactionForm`, `ForecastChart`
- Custom hooks for business logic: `useTransactions`, `useForecast`
- Dedicated API service modules

### Open/Closed Principle (OCP)
- Extensible component props with sensible defaults
- Plugin-based chart configurations
- Themeable UI components

### Liskov Substitution Principle (LSP)
- Consistent interfaces for transaction types
- Interchangeable chart components

### Interface Segregation Principle (ISP)
- Small, focused TypeScript interfaces
- Component props only receive what they need

### Dependency Inversion Principle (DIP)
- Components depend on abstract services, not implementations
- Dependency injection via React Context
- API clients injected, not hardcoded

---

## Project Structure

```
cashflow-frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── vite-env.d.ts
│   ├── assets/
│   │   └── logo.svg
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   ├── transactions/
│   │   │   ├── TransactionList.tsx
│   │   │   ├── TransactionForm.tsx
│   │   │   └── TransactionCard.tsx
│   │   ├── forecast/
│   │   │   ├── ForecastChart.tsx
│   │   │   ├── ForecastTable.tsx
│   │   │   └── DateRangePicker.tsx
│   │   ├── recurring/
│   │   │   ├── RecurringRuleList.tsx
│   │   │   └── RecurringRuleForm.tsx
│   │   └── auth/
│   │       ├── LoginForm.tsx
│   │       ├── SignupForm.tsx
│   │       └── ProtectedRoute.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Transactions.tsx
│   │   ├── Forecast.tsx
│   │   ├── RecurringRules.tsx
│   │   ├── Import.tsx
│   │   ├── Settings.tsx
│   │   ├── Login.tsx
│   │   └── Signup.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useTransactions.ts
│   │   ├── useForecast.ts
│   │   └── useRecurringRules.ts
│   ├── services/
│   │   ├── api/
│   │   │   ├── apiClient.ts
│   │   │   ├── transactionService.ts
│   │   │   ├── forecastService.ts
│   │   │   └── recurringRuleService.ts
│   │   └── supabase/
│   │       └── supabaseClient.ts
│   ├── store/
│   │   ├── index.ts
│   │   ├── authSlice.ts
│   │   ├── transactionSlice.ts
│   │   └── forecastSlice.ts
│   ├── types/
│   │   ├── transaction.ts
│   │   ├── forecast.ts
│   │   ├── recurringRule.ts
│   │   └── auth.ts
│   ├── utils/
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── dateUtils.ts
│   └── styles/
│       ├── global.css
│       └── variables.css
├── .github/
│   └── workflows/
│       └── deploy.yml
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Feature Specifications

### 1. Dashboard View

> **Designed for contractors** — At-a-glance view of your financial health with Safe Mode toggle.

**Components:**
- **Balance Summary Card**: Current balance, projected balance after X days
- **Safe Mode Toggle**: Switch between normal and safe (guaranteed income only) mode
- **Safe to Spend Card**: Amount available after all projected bills
- **Mini Forecast Chart**: X-day balance projection preview
- **Recent Transactions**: Last 5 transactions
- **Quick Actions**: Add transaction, view full forecast

**Dashboard Layout:**
```
┌─────────────────────────────────┐
│  💰 Current Balance          │
│  €5,000.00                    │
├─────────────────────────────────┤
│  Safe Mode  [○ Off]  [● On]  │
├─────────────────────────────────┤
│  📈 In 30 days               │
│  €3,200.00                    │
│  ⚠️ Low balance on Feb 15    │
├─────────────────────────────────┤
│  ✅ Safe to Spend/Invest      │
│  €1,700.00                    │
│  (after all bills paid)      │
├─────────────────────────────────┤
│  [    Mini Forecast Chart   ]│
├─────────────────────────────────┤
│  Recent Transactions         │
│  • Netflix     -€15.99       │
│  • Salary    +€4,500.00 ✓    │
└─────────────────────────────────┘
```

**Safe Mode Toggle Behavior:**
- **Off (Normal)**: Includes all income (GUARANTEED + LIKELY) in projections
- **On (Safe)**: Only includes GUARANTEED income — conservative estimate
- Toggle updates all calculations instantly

**Design:**
- Clean, modern UI with card-based layout
- Color-coded income (🟢 green) and expense (🔴 red)
- ✓ checkmark for GUARANTEED income, no mark for LIKELY
- ⚠️ warnings for low/negative balance predictions

---

### 2. Timeline & Forecast View

> View detailed day-by-day projections with Safe Mode toggle.

**Components:**
- **Safe Mode Toggle**: Same toggle, synced with dashboard
- **ForecastChart**: Interactive line chart showing balance over time
- **ForecastTable**: Tabular view with daily breakdown
- **Income/Expense Summary**: Totals by confidence level
- **Transaction Overlay**: Click on date to see transactions

**Features:**
- Zoom and pan on chart
- Toggle between chart and table view
- Safe Mode toggle to see conservative projections
- Export forecast as CSV/PDF
- Highlight low/negative balance warnings
- Show "Safe to Spend" amount prominently

---

### 3. Transaction Management

**Components:**
- **TransactionList**: Filterable, sortable table
- **TransactionForm**: Modal for add/edit with type-specific fields
- **TransactionCard**: Card view alternative

#### Add Transaction Flow

The Add (➕) button in the bottom tab opens a modal with a two-step flow:

```
┌─────────────────────────────────┐
│     Add Transaction             │
├─────────────────────────────────┤
│                                 │
│   ┌─────────┐   ┌─────────┐    │
│   │ 💰      │   │ 💸      │    │
│   │ Income  │   │ Expense │    │
│   └─────────┘   └─────────┘    │
│                                 │
└─────────────────────────────────┘
```

##### If INCOME selected:

| Field       | Input Type      | Options                    |
|-------------|-----------------|----------------------------|
| Amount      | Number input    | Currency formatted         |
| Currency    | Dropdown        | EUR (default), USD, GBP... |
| Description | Text input      | Optional                   |
| Date        | Date picker     | Defaults to today          |
| Confidence  | Segmented control | **Guaranteed** / **Likely** |

```
┌─────────────────────────────────┐
│     Add Income                  │
├─────────────────────────────────┤
│  Amount                         │
│  ┌───────────────┬─────────┐    │
│  │  5,000.00     │ EUR ▼  │    │
│  └───────────────┴─────────┘    │
│  = €5,000.00                    │
│                                 │
│  Description (optional)         │
│  ┌─────────────────────────┐    │
│  │  Monthly Salary         │    │
│  └─────────────────────────┘    │
│                                 │
│  Date                           │
│  ┌─────────────────────────┐    │
│  │  📅 Jan 25, 2026        │    │
│  └─────────────────────────┘    │
│                                 │
│  How confident is this income?  │
│  ┌────────────┬────────────┐    │
│  │ ✓ Guaranteed│   Likely  │    │
│  └────────────┴────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │       Save Income       │    │
│  └─────────────────────────┘    │
└─────────────────────────────────┘
```

##### If EXPENSE selected:

| Field        | Input Type        | Options                                                    |
|--------------|-------------------|------------------------------------------------------------|
| Amount       | Number input      | Currency formatted                                         |
| Currency     | Dropdown          | EUR (default), USD, GBP...                                 |
| Description  | Text input        | Optional                                                   |
| Date         | Date picker       | Defaults to today                                          |
| Bank Account | Dropdown          | User's bank accounts (optional)                            |
| Tags         | Multi-select chips| Ireland, USA, India, Subscription, etc.                    |
| Recurring?   | Toggle switch     | Yes / No                                                   |
| Frequency    | Segmented control | Daily / Weekly / Monthly / Quarterly / Half-Yearly / Yearly |
| Reminder     | Number input      | Days before due date (e.g., 3 days)                        |

```
┌─────────────────────────────────┐
│     Add Expense                 │
├─────────────────────────────────┤
│  Amount                         │
│  ┌───────────────┬─────────┐    │
│  │  15.99        │ USD ▼  │    │
│  └───────────────┴─────────┘    │
│  = €17.27 (1 USD = 1.08 EUR)    │
│                                 │
│  Description (optional)         │
│  ┌─────────────────────────┐    │
│  │  Netflix Subscription   │    │
│  └─────────────────────────┘    │
│                                 │
│  Pay from bank                  │
│  ┌─────────────────────────┐    │
│  │  🏦 AIB Ireland      ▼  │    │
│  └─────────────────────────┘    │
│                                 │
│  Tags                           │
│  [🇮🇪 Ireland] [Subscription]  +│
│                                 │
│  Date                           │
│  ┌─────────────────────────┐    │
│  │  📅 Jan 25, 2026        │    │
│  └─────────────────────────┘    │
│                                 │
│  Recurring expense?             │
│  ┌──────────────────────[●]┐    │
│                                 │
│  Repeat every:                  │
│  ┌─────┬──────┬───────┬───────┐ │
│  │Daily│Weekly│✓Month│Quarter│ │
│  └─────┴──────┴───────┴───────┘ │
│                                 │
│  Remind me before               │
│  ┌─────────────────────────┐    │
│  │  3 days before       ▼ │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │       Save Expense      │    │
│  └─────────────────────────┘    │
└─────────────────────────────────┘
```

**Features:**
- Search by description
- Filter by date range, type, amount, confidence, recurring, **tags**, **bank account**
- Sort by date, amount, description
- Visual indicators for confidence level and recurring status
- Inline editing support
- Bulk delete with confirmation

---

### 3b. Transaction History & Edit

> **View and edit all transactions** — One-time and recurring instances in a unified list.

**Accessing Transaction History:**
- From **Dashboard**: Tap "View All" on Recent Transactions
- From **Forecast**: Tap on any date to see transactions for that day
- Direct access via swipe gesture or menu option

#### Transaction History List

```
┌─────────────────────────────────┐
│     Transaction History         │
├─────────────────────────────────┤
│  🔍 Search   [🇮🇪] [🏦AIB] 📅  │
├─────────────────────────────────┤
│                                 │
│  Today                          │
│  ┌─────────────────────────┐    │
│  │ 🟢 Contract Payment    │ >  │
│  │ +€2,500 ✓ Guaranteed   │    │
│  └─────────────────────────┘    │
│                                 │
│  Jan 20                         │
│  ┌─────────────────────────┐    │
│  │ 🔴 Netflix       🔁   │ >  │
│  │ -€15.99  AIB 🇮🇪       │    │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │ 🔴 Rent         🔁   │ >  │
│  │ -€1,200  AIB 🇮🇪      │    │
│  └─────────────────────────┘    │
│                                 │
└─────────────────────────────────┘
```

**Legend:**
- 🟢 = Income, 🔴 = Expense
- ✓ = Guaranteed, no mark = Likely
- 🔁 = Recurring transaction
- > = Tap to edit

---

#### Edit Transaction Flow

When user taps on a transaction to edit:

**Edit Form Fields:**
| Field       | Behavior                                               |
|-------------|--------------------------------------------------------|
| Amount      | Editable — amounts may change                          |
| Date        | **Defaults to today** for completed transactions       |
|             | User can select past date if already paid              |
| Description | Editable                                               |
| All fields  | Same as Add form (bank, tags, etc.)                    |

**Date Logic:**
- When marking as "Paid" → Default date = **Today**
- User can override with past date (e.g., paid yesterday)
- Future dates also allowed for scheduling

---

#### Editing Recurring Transactions — Instance vs Series

When editing a **recurring transaction**, on Save, prompt the user:

```
┌─────────────────────────────────┐
│     Edit Recurring              │
├─────────────────────────────────┤
│                                 │
│  Apply changes to:              │
│                                 │
│  ┌─────────────────────────┐    │
│  │  🔘 This instance only   │    │
│  │     (Jan 25, 2026)       │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │  🔘 All future instances │    │
│  │     (entire series)      │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌───────────┐ ┌─────────┐    │
│  │  Cancel  │ │  Apply  │    │
│  └───────────┘ └─────────┘    │
│                                 │
└─────────────────────────────────┘
```

**Behavior:**
| Choice | Result |
|--------|--------|
| **This instance only** | Creates an exception for this specific date (one-time override) |
| **All future instances** | Updates the recurring rule itself (affects all future occurrences) |

**Use Cases:**
- 💰 Income arrived early → Edit this instance, change date to today
- 💸 Bill paid early → Edit this instance, change date to actual payment date
- 💸 Subscription price changed → Edit all future instances with new amount

---

#### Quick Actions (Swipe or Long-Press)

> **Perform common operations without opening the full edit form.**

##### Income Quick Actions

```
┌─────────────────────────────────┐
│ 🟢 Contract Payment  +€2,500   │
│ Likely • Due Jan 30            │
├─────────────────────────────────┤
│ [✓ Received] [⭐ Guaranteed] [✏️ Edit] [🗓️ Reschedule]
└─────────────────────────────────┘
```

| Action | Effect |
|--------|--------|
| **✓ Received** | Mark as received, set date to today |
| **⭐ Guaranteed** | Change confidence from Likely → Guaranteed |
| **✏️ Edit** | Open full edit form |
| **🗓️ Reschedule** | Quick date picker to change expected date |
| **✕ Cancel** | Mark as CANCELLED (removes from forecast) |

##### Expense Quick Actions

```
┌─────────────────────────────────┐
│ 🔴 Netflix           -€15.99   │
│ Recurring • Due Jan 25 • AIB   │
├─────────────────────────────────┤
│ [✓ Mark Paid] [⏭️ Skip] [✏️ Edit] [🗓️ Reschedule]
└─────────────────────────────────┘
```

| Action | Effect |
|--------|--------|
| **✓ Mark Paid** | Mark as paid, set date to today |
| **⏭️ Skip** | Skip this instance (SKIPPED status) |
| **✏️ Edit** | Open full edit form |
| **🗓️ Reschedule** | Quick date picker to change due date |

##### Status Indicators in Lists

| Icon | Meaning |
|------|---------|
| 🟢 | Income |
| 🔴 | Expense |
| ✓ | Guaranteed income |
| 🔁 | Recurring transaction |
| ✅ | Received/Paid (completed) |
| ⏭️ | Skipped |
| ⚠️ | Overdue or low balance warning |

---

### 4. Recurring Rules Management

**Components:**
- **RecurringRuleList**: List of active rules
- **RecurringRuleForm**: Create/edit recurring items

**Features:**
- Visual frequency indicator
- Start/end date display
- Quick toggle to enable/disable
- Preview next 3 occurrences

---

### 5. CSV Import

**Components:**
- **FileUploader**: Drag-and-drop CSV upload
- **ColumnMapper**: Map CSV columns to fields
- **ImportPreview**: Review before importing
- **ImportSummary**: Results after import

---

### 6. Settings & Currency Management

> **Base Currency: EUR (Euro)** — All calculations and forecasts are performed in Euro.

**Settings Sections:**
- **Profile**: User info, logout
- **Forecast**: Configure forecast days, default Safe Mode
- **Currencies**: Manage additional currencies and exchange rates
- **Display**: Theme, date format preferences
- **Data**: Export, clear data

#### Forecast Settings

```
┌─────────────────────────────────┐
│  📊 Forecast Settings          │
│  ─────────────────────────────  │
│                                 │
│  Forecast Period               │
│  ┌─────────────────────────┐    │
│  │        30 days     ▼   │    │
│  └─────────────────────────┘    │
│  Options: 7, 14, 30, 60, 90    │
│                                 │
│  Default Safe Mode              │
│  ┌──────────────────────[○]┐    │
│  Start in safe mode by default  │
│                                 │
│  Low Balance Warning            │
│  ┌─────────────────────────┐    │
│  │  € 500                  │    │
│  └─────────────────────────┘    │
│  Warn when balance drops below  │
│                                 │
│  ┌─────────────────────────┐    │
│  │       Save Changes      │    │
│  └─────────────────────────┘    │
│  ✓ Changes apply immediately   │
│                                 │
└─────────────────────────────────┘
```

**Forecast Settings Behavior:**
- **Forecast Period**: Number of days to project (default: 30)
- **Default Safe Mode**: When enabled, Safe Mode is ON by default on Dashboard
- **Low Balance Warning**: Threshold for balance warnings
- **Immediate Effect**: All changes apply instantly when saved — Dashboard and Forecast views update automatically

#### Bank Accounts Management

> **For contractors with multiple bank accounts** — Assign expenses to specific accounts for direct debit tracking.

```
┌─────────────────────────────────┐
│  🏦 Bank Accounts              │
│  ─────────────────────────────  │
│                                 │
│  ┌─────────────────────────┐    │
│  │ 🔵 AIB Ireland    ✓    │ ✏️ │
│  │    ****1234  EUR        │ 🗑️ │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │ 🔴 Chase USA           │ ✏️ │
│  │    ****5678  USD        │ 🗑️ │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │ 🟢 HDFC India          │ ✏️ │
│  │    ****9012  INR        │ 🗑️ │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │     ➕ Add Bank Account │    │
│  └─────────────────────────┘    │
│                                 │
└─────────────────────────────────┘
```

**Add Bank Account Modal:**
```
┌─────────────────────────────────┐
│     Add Bank Account            │
├─────────────────────────────────┤
│  Account Name                   │
│  ┌─────────────────────────┐    │
│  │  AIB Ireland            │    │
│  └─────────────────────────┘    │
│                                 │
│  Bank Name                      │
│  ┌─────────────────────────┐    │
│  │  Allied Irish Banks     │    │
│  └─────────────────────────┘    │
│                                 │
│  Last 4 digits (optional)       │
│  ┌─────────────────────────┐    │
│  │  1234                   │    │
│  └─────────────────────────┘    │
│                                 │
│  Currency                       │
│  ┌─────────────────────────┐    │
│  │  EUR                 ▼  │    │
│  └─────────────────────────┘    │
│                                 │
│  Color Label                    │
│  🔵 🔴 🟢 🟡 🟣 🟠           │
│                                 │
│  Set as default account  [○]    │
│                                 │
│  ┌─────────────────────────┐    │
│  │       Save Account      │    │
│  └─────────────────────────┘    │
└─────────────────────────────────┘
```

#### Expense Tags Management

```
┌─────────────────────────────────┐
│  🏷️ Expense Tags               │
│  ─────────────────────────────  │
│                                 │
│  Location Tags                  │
│  [🇮🇪 Ireland ✕] [🇺🇸 USA ✕]   │
│  [🇮🇳 India ✕] [🇬🇧 UK ✕]       │
│                                 │
│  Category Tags                  │
│  [Subscription ✕] [Utilities ✕]│
│  [Rent ✕] [Insurance ✕]        │
│                                 │
│  ┌─────────────────────────┐    │
│  │     ➕ Add New Tag      │    │
│  └─────────────────────────┘    │
│                                 │
└─────────────────────────────────┘
```

#### Currency Management UI

```
┌─────────────────────────────────┐
│     ⚙️ Settings                 │
├─────────────────────────────────┤
│                                 │
│  💱 Currencies                  │
│  ─────────────────────────────  │
│                                 │
│  Base Currency                  │
│  ┌─────────────────────────┐    │
│  │ 🔒 EUR  €  Euro         │    │
│  │    Rate: 1.00 (fixed)   │    │
│  └─────────────────────────┘    │
│                                 │
│  Additional Currencies          │
│  ┌─────────────────────────┐    │
│  │ 🇺🇸 USD  $  US Dollar   │ ✏️ │
│  │    1 USD = 1.08 EUR     │ 🗑️ │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │ 🇬🇧 GBP  £  British Pound│ ✏️ │
│  │    1 GBP = 1.17 EUR     │ 🗑️ │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │     ➕ Add Currency     │    │
│  └─────────────────────────┘    │
│                                 │
└─────────────────────────────────┘
```

#### Add/Edit Currency Modal

```
┌─────────────────────────────────┐
│     Add Currency                │
├─────────────────────────────────┤
│                                 │
│  Currency Code                  │
│  ┌─────────────────────────┐    │
│  │  USD                    │    │
│  └─────────────────────────┘    │
│                                 │
│  Name                           │
│  ┌─────────────────────────┐    │
│  │  US Dollar              │    │
│  └─────────────────────────┘    │
│                                 │
│  Symbol                         │
│  ┌─────────────────────────┐    │
│  │  $                      │    │
│  └─────────────────────────┘    │
│                                 │
│  Exchange Rate to EUR           │
│  ┌─────────────────────────┐    │
│  │  1.08                   │    │
│  └─────────────────────────┘    │
│  ℹ️ 1 USD = 1.08 EUR            │
│                                 │
│  ┌─────────────────────────┐    │
│  │       Save Currency     │    │
│  └─────────────────────────┘    │
└─────────────────────────────────┘
```

#### Transaction Form with Currency

When adding a transaction, users can select the currency:

```
┌─────────────────────────────────┐
│  Amount                         │
│  ┌───────────────┬─────────┐    │
│  │  100.00       │ USD ▼  │    │
│  └───────────────┴─────────┘    │
│  = €108.00 (base currency)      │
└─────────────────────────────────┘
```

**Features:**
- Base currency (EUR) is locked and cannot be deleted
- Exchange rates are user-editable
- Real-time conversion preview when adding transactions
- All forecast calculations use base currency amounts

---

## Supabase Authentication

### Setup

```typescript
// src/services/supabase/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Auth Hook

```typescript
// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase/supabaseClient';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password });

  const signUp = (email: string, password: string) =>
    supabase.auth.signUp({ email, password });

  const signOut = () => supabase.auth.signOut();

  return { user, loading, signIn, signUp, signOut };
};
```

### Protected Routes

```typescript
// src/components/auth/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;

  return children;
};
```

---

## API Integration

### API Client Configuration

```typescript
// src/services/api/apiClient.ts
import axios from 'axios';
import { supabase } from '../supabase/supabaseClient';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

apiClient.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

export default apiClient;
```

### TypeScript Types

```typescript
// src/types/transaction.ts

export type TransactionType = 'INCOME' | 'EXPENSE';
export type IncomeConfidence = 'GUARANTEED' | 'LIKELY';
export type RecurrenceFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

interface BaseTransaction {
  id: string;
  amount: number;
  description?: string;
  date: string; // ISO format
  createdAt: string;
  updatedAt: string;
}

export interface IncomeTransaction extends BaseTransaction {
  type: 'INCOME';
  confidence: IncomeConfidence;
}

export interface ExpenseTransaction extends BaseTransaction {
  type: 'EXPENSE';
  isRecurring: boolean;
  frequency?: RecurrenceFrequency; // Required if isRecurring = true
}

export type Transaction = IncomeTransaction | ExpenseTransaction;

// Request types for creating/updating
export interface CreateIncomeRequest {
  type: 'INCOME';
  amount: number;
  description?: string;
  date: string;
  confidence: IncomeConfidence;
}

export interface CreateExpenseRequest {
  type: 'EXPENSE';
  amount: number;
  description?: string;
  date: string;
  isRecurring: boolean;
  frequency?: RecurrenceFrequency;
}

export type CreateTransactionRequest = CreateIncomeRequest | CreateExpenseRequest;
```

### Transaction Service

```typescript
// src/services/api/transactionService.ts
import apiClient from './apiClient';
import { Transaction, CreateTransactionRequest } from '../../types/transaction';

export const transactionService = {
  getAll: () => apiClient.get<Transaction[]>('/api/v1/transactions'),
  getById: (id: string) => apiClient.get<Transaction>(`/api/v1/transactions/${id}`),
  create: (data: CreateTransactionRequest) => apiClient.post<Transaction>('/api/v1/transactions', data),
  update: (id: string, data: CreateTransactionRequest) => apiClient.put<Transaction>(`/api/v1/transactions/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/v1/transactions/${id}`),
};
```

---

## GitHub Pages Deployment

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install Dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Vite Configuration for GitHub Pages

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/cashflow-frontend/', // Replace with your repo name
  build: {
    outDir: 'dist',
  },
});
```

---

## Environment Variables

```bash
# .env.local (development)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:8080

# GitHub Secrets (production)
# VITE_SUPABASE_URL
# VITE_SUPABASE_ANON_KEY
# VITE_API_URL=https://your-api-domain.com
```

---

## UI/UX Guidelines

### Target Devices: Mobile & Tablet Only

> ⚠️ **Desktop users will see a blocking screen** asking them to open the app on a mobile device or tablet.

#### Desktop Blocking Component

```typescript
// src/components/common/DesktopBlocker.tsx
export const DesktopBlocker = () => {
  const isMobileOrTablet = window.innerWidth <= 1024;
  
  if (isMobileOrTablet) return null;
  
  return (
    <div className="desktop-blocker">
      <div className="blocker-content">
        <img src="/mobile-icon.svg" alt="Mobile" />
        <h1>CashFlow is designed for mobile</h1>
        <p>Please open this app on your mobile phone or tablet for the best experience.</p>
        <div className="device-icons">
          <span>📱 Phone</span>
          <span>📲 Tablet</span>
        </div>
      </div>
    </div>
  );
};
```

---

### Native App-Like Layout

The app mimics native mobile applications with:

- **Fixed Header**: App title and action buttons
- **Scrollable Content Area**: Main content with pull-to-refresh
- **Fixed Bottom Tab Bar**: Primary navigation with icons

```
┌─────────────────────────────┐
│         Header Bar          │  ← Fixed top
├─────────────────────────────┤
│                             │
│                             │
│      Scrollable Content     │  ← Flex grow
│                             │
│                             │
├─────────────────────────────┤
│  🏠   📊   ➕   🔄   ⚙️   │  ← Fixed bottom tabs
└─────────────────────────────┘
```

---

### Bottom Tab Navigation

| Tab      | Icon | Route            | Description           |
|----------|------|------------------|-----------------------|
| Home     | 🏠   | `/`              | Dashboard overview    |
| Forecast | 📊   | `/forecast`      | Timeline & charts     |
| Add      | ➕   | Modal            | Quick add transaction |
| Rules    | 🔄   | `/recurring`     | Recurring rules       |
| Settings | ⚙️   | `/settings`      | User preferences      |

#### Implementation

```typescript
// src/components/layout/BottomTabBar.tsx
import { NavLink } from 'react-router-dom';
import { 
  HomeIcon, 
  ChartBarIcon, 
  PlusCircleIcon, 
  ArrowPathIcon, 
  Cog6ToothIcon 
} from '@heroicons/react/24/outline';

const tabs = [
  { to: '/', icon: HomeIcon, label: 'Home' },
  { to: '/forecast', icon: ChartBarIcon, label: 'Forecast' },
  { to: null, icon: PlusCircleIcon, label: 'Add', isAction: true },
  { to: '/recurring', icon: ArrowPathIcon, label: 'Rules' },
  { to: '/settings', icon: Cog6ToothIcon, label: 'Settings' },
];

export const BottomTabBar = ({ onAddClick }) => (
  <nav className="bottom-tab-bar">
    {tabs.map((tab) => 
      tab.isAction ? (
        <button key={tab.label} onClick={onAddClick} className="tab-item add-button">
          <tab.icon className="tab-icon" />
          <span>{tab.label}</span>
        </button>
      ) : (
        <NavLink key={tab.label} to={tab.to} className="tab-item">
          <tab.icon className="tab-icon" />
          <span>{tab.label}</span>
        </NavLink>
      )
    )}
  </nav>
);
```

#### Styles

```css
/* Bottom Tab Bar Styles */
.bottom-tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: white;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-bottom: env(safe-area-inset-bottom); /* iOS safe area */
  z-index: 100;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: #6b7280;
  text-decoration: none;
  font-size: 12px;
}

.tab-item.active {
  color: #2563eb;
}

.tab-icon {
  width: 24px;
  height: 24px;
}

.add-button {
  background: #2563eb;
  color: white;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  margin-top: -20px;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
}
```

---

### Design System

- **Colors**: 
  - Primary: `#2563EB` (Blue)
  - Success/Income: `#10B981` (Green)
  - Danger/Expense: `#EF4444` (Red)
  - Warning: `#F59E0B` (Amber)
  - Background: `#F9FAFB` (Light Gray)
  
- **Typography**: Inter or Roboto font family
  
- **Spacing**: 8px base unit system

- **Shadows**: Subtle elevation for cards

- **Border Radius**: 12px for cards, 8px for buttons

---

### Supported Breakpoints

| Breakpoint | Width Range    | Layout               |
|------------|----------------|----------------------|
| Mobile     | 0 - 767px      | Single column        |
| Tablet     | 768px - 1024px | 2 columns (optional) |
| Desktop    | > 1024px       | ❌ **BLOCKED**       |

---

## Next Steps

1. Create new GitHub repository for frontend
2. Initialize Vite + React + TypeScript project
3. Set up Supabase client and authentication
4. Implement core layout components
5. Build dashboard view
6. Implement transaction management
7. Create forecast visualization
8. Add CSV import functionality
9. Configure GitHub Actions deployment
10. Test and iterate on UI/UX
