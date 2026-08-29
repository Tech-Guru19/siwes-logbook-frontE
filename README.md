# SIWES Logbook - Frontend

## Overview

A modern, multi-role SIWES Logbook and Performance Monitoring System frontend built with React 19 and Vite. The application provides a role-aware dashboard experience for students, school administrators, department heads, supervisors, organizations, and platform administrators, enabling digital recording and monitoring of industrial training (SIWES) activities.

## Key Features

- **Role-based authentication:** Dedicated dashboards for students, school admins, department heads, school supervisors, organization supervisors, and platform administrators
- **Daily logbook entries:** Structured forms for students to record daily SIWES training activities
- **Performance monitoring:** Interactive charts built with Recharts to visualize student progress and log activity
- **School and department management:** Two-step onboarding flow for creating schools, departments, and supervisors
- **Organization management:** Supervisor assignment and placement tracking for organizations
- **Data export:** Spreadsheet export of student data using the SheetJS (xlsx) library
- **Email verification:** OTP-based verification for signups and sensitive operations
- **Modern interface:** Tailwind CSS 4 with shadcn-style components and Framer Motion animations

## Technology Stack

| Layer | Technology |
|---|---|
| Framework | React 19, Vite |
| Styling | Tailwind CSS 4, tw-animate-css, CVA |
| Routing | React Router 7 |
| Charts | Recharts |
| HTTP Client | Axios |
| Icons | Lucide React |
| Animation | Framer Motion |
| Data Export | SheetJS (xlsx) |

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

```bash
git clone https://github.com/Tech-Guru19/siwes-logbook-frontE.git
cd siwes-logbook-frontE
npm install
npm run dev
```

The development server will start, typically at `http://localhost:5173`.

### Production Build

```bash
npm run build
```

The compiled output is generated in the `dist/` directory.

## Project Structure

```
src/
├── components/                 # Reusable UI components (Auth, Student, etc.)
├── context/                    # Global state management (credentials, lists)
├── pages/                      # Application routes
│   ├── Organization/           # Organization dashboards
│   ├── OrganizationSupervisor/ # Organization supervisor views
│   ├── School/                 # School, department and supervisor dashboards
│   └── ...                     # Student, Admin, Support, Docs pages
└── utils/                      # Utility functions
```

## Backend Integration

This frontend communicates with the [SIWES Logbook Backend](https://github.com/Tech-Guru19/siwes-logbook-backend-c), an Express and MySQL REST API.

## Author

[Obiasogu Esther Chizaram](https://github.com/Tech-Guru19)
