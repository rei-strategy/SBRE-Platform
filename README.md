# Field Service & Business Operations Platform ("SBRE Global")

## 🚀 Project Overview
This application is a comprehensive **Business Operating System (BOS)** designed for service-based businesses (e.g., HVAC, plumbing, landscaping, construction). It goes beyond simple job scheduling to handle the entire lifecycle of the business: from marketing and lead generation to field operations, invoicing, inventory, and payroll.

The goal is to provide **one single pane of glass** for business owners to run their entire company, replacing fragmented tools like spreadsheets, separate platforms, and distinct marketing tools.

---

## 🏗 Tech Stack & Architecture

### Frontend
- **Framework**: [React](https://react.dev/) (v18+) with [Vite](https://vitejs.dev/) for fast build tooling.
- **Language**: TypeScript (Strict typing enforced).
- **Styling**: Tailwind CSS (Utility-first styling for a premium, modern UI).
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) (Global store separated into slices: `createJobSlice`, `createFinanceSlice`, etc.).
- **Routing**: React Router DOM v6.
- **Charts**: Recharts (for analytics and dashboards).
- **Icons**: Lucide React.
- **Maps**: Leaflet / React-Leaflet.

### Backend / Infrastructure
- **Platform**: [Supabase](https://supabase.com/) (Backend-as-a-Service).
- **Database**: PostgreSQL.
- **Authentication**: Supabase Auth (dealing with Roles: ADMIN, OFFICE, TECHNICIAN).
- **Security**: Row Level Security (RLS) enabled on all tables (see `database/consolidated_schema.sql`).
- **Storage**: Supabase Storage (for job photos and assets).

---

## 🧩 Core Modules & Features

### 1. 🛠 Field Operations (The Core)
- **Smart Schedule**: Drag-and-drop calendar for assigning jobs to technicians.
- **Job Management**: Complete job cards tracking status (`DRAFT` -> `SCHEDULED` -> `IN_PROGRESS` -> `COMPLETED`).
- **Technician Dashboard**: A mobile-optimized view for field staff to:
    - View their daily agenda.
    - Clock In/Out (Geotagged).
    - Navigate to job sites.
    - Upload job photos and complete checklists.

### 2. 💰 Financial Suite
- **Invoicing**: Generate professional PDF invoices (using `jspdf`), track overdue payments.
- **Quoting Engine**: Create estimates that convert to jobs upon approval.
- **Payroll**: Automated weekly timesheets calculating gross pay based on Hourly vs. Commission models.
- **Revenue Analytics**: Real-time charts showing income trends.

### 3. 📢 Marketing & Growth Engine
- **Campaign Builder**: Drag-and-drop email marketing builder.
- **Marketing Automation**: Visual workflow builder (Triggers -> Actions) for drip campaigns (e.g., "Send review request 1 day after job completion").
- **Ads Intelligence**: Dashboard to track ROI from Google & Meta Ads (Demo data structure currently implemented).
- **Market Research**: AI-powered competitor analysis and trend research module (integrated with Perplexity/LLM APIs).

### 4. 📦 Inventory Management
- **Stock Tracking**: Real-time inventory levels across multiple warehouses/trucks.
- **Procurement**: Vendor management and Purchase Order (PO) generation.
- **Low Stock Alerts**: Automated warnings when SKU counts dip below thresholds.

---

## 📂 Project Structure

```
/
├── src/
│   ├── components/       # Reusable UI components (Buttons, Modals, Inputs)
│   ├── pages/            # Main route views
│   │   ├── dashboard/    # Analytics & Widgets
│   │   ├── marketing/    # Campaigns & Automation logic
│   │   ├── timesheets/   # Payroll & Time tracking
│   │   └── invoices/     # Financial tables & actions
│   ├── store/            # Zustand state slices (Data Logic)
│   │   ├── createJobSlice.ts
│   │   ├── createFinanceSlice.ts
│   │   └── ...
│   ├── types/            # TypeScript interfaces (Single source of truth)
│   └── database/         # SQL Schemas
├── public/               # Static assets
└── index.html            # Entry point
```

---

## ⚡️ Database Setup (Supabase)

The entire database schema is consolidated into a single master script.

1.  Navigate to `database/consolidated_schema.sql`.
2.  Open your Supabase Project > **SQL Editor**.
3.  Copy and paste the entire content of `consolidated_schema.sql`.
4.  Run the script.
    *   *Note: This script is idempotent (uses `IF NOT EXISTS`), so it is safe to run multiple times to apply updates.*
5.  This creates all tables (Jobs, Clients, Research History, Ads Demo) and applies necessary RLS policies.

---

## 🏁 Getting Started for Developers

1.  **Clone the repository**.
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Setup**:
    Create a `.env` file in the root directory with your Supabase credentials:
    ```env
    VITE_SUPABASE_URL=your_project_url
    VITE_SUPABASE_ANON_KEY=your_anon_key
    ```
4.  **Run Development Server**:
    ```bash
    npm run dev
    ```
5.  **Build for Production**:
    ```bash
    npm run build
    ```

---

## 🚧 Status & Handoff Notes

**Completed:**
-   ✅ Full UI/UX Implementation (Dashboards, Tables, Modals).
-   ✅ State Management foundation (Zustand stores fully typed).
-   ✅ Database Schema (Postgres tables defined and optimized).
-   ✅ Modular Refactoring (Dashboard, Timesheets, Invoices broken down into components).

**Pending / Next Steps for Dev Team:**
1.  **Backend Integration**: Connect the frontend `services` to the actual Supabase client. Currently, some parts may be using mock data or local state. Ensure `useEffect` hooks fetch real data from Supabase.
2.  **Edge Functions**: Implement backend logic for sensitive operations (e.g., sending actual emails via SendGrid/Resend, processing Stripe payments).
3.  **Authentication Flow**: Finalize the Login/Signup screens to fully protect routes based on `auth.users`.
4.  **Mobile Wrapper**: Consider wrapping this React app in Capacitor/Ionic if a native App Store presence is required.
