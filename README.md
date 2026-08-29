# 📋 SIWES Logbook — Frontend

A modern, multi-role **SIWES Logbook & Performance Monitoring System** frontend built with React 19 and Vite. It powers students, schools, organizations, and supervisors through a single, role-aware dashboard experience.

## ✨ Features

- 🔐 **Role-based authentication** — Students, School Admins, Department Heads, School Supervisors, Organization Supervisors, and Platform Admins each get a dedicated dashboard
- 📝 **Daily logbook entries** — Students record daily SIWES activities with rich, structured forms
- 📊 **Performance monitoring** — Interactive charts (Recharts) visualise student progress and log activity
- 🏫 **School & department management** — Create schools, departments, and supervisors with a two-step onboarding flow
- 🏢 **Organization management** — Assign supervisors to students and track placements
- 📄 **Spreadsheet export** — Export student data to Excel via the XLSX library
- ✅ **OTP verification** — Email OTP flows secure signups and sensitive actions
- 🎨 **Modern UI** — Tailwind CSS 4 + shadcn-style components with Framer Motion animations

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite |
| Styling | Tailwind CSS 4, tw-animate-css, CVA |
| Routing | React Router 7 |
| Charts | Recharts |
| HTTP | Axios |
| Icons | Lucide React |
| Animations | Framer Motion |
| Export | SheetJS (xlsx) |

## 🚀 Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/Tech-Guru19/siwes-logbook-frontE.git
cd siwes-logbook-frontE

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

## 🔗 Backend

This frontend talks to the [SIWES Logbook Backend](https://github.com/Tech-Guru19/siwes-logbook-backend-c) (Express + MySQL).

## 🗂️ Project Structure

```
src/
├── components/        # Reusable UI components (Auth, Student, etc.)
├── context/           # Global state (credentials, lists)
├── pages/             # All route pages
│   ├── Organization/       # Organization dashboards
│   ├── OrganizationSupervisor/
│   ├── School/             # School, department & supervisor dashboards
│   └── ...                 # Student, Admin, Support, Docs, etc.
└── utils/
```

## 📦 Build

```bash
npm run build   # outputs to dist/
```

## 👩‍💻 Author

**[Obiasogu Esther Chizaram](https://github.com/Tech-Guru19)**
