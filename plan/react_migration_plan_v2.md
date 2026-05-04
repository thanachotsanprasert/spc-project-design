# React Migration Plan v2: พุงกาง Restaurant Platform

This document outlines a refined, production-grade strategy to migrate the current HTML/JavaScript dashboard into a modern, scalable React framework. This version incorporates advanced data-fetching, testing, and authentication strategies to ensure long-term maintainability.

---

## 1. Existing Project Analysis

### 1.1 Project Overview
- **Technology Stack:** HTML5, Tailwind CSS (via CDN), Vanilla JavaScript.
- **Primary Design Pattern:** Dashboard layout with a fixed sidebar and a header.
- **Target Platform:** Web (Responsive, includes mobile-specific adjustments).
- **Architecture:** Multi-page application (MPA) transitioning to a Single Page Application (SPA).

### 1.2 Global UI/UX Elements & Color Palette
| Element | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Main Background** | `#E4E7EC` | Page background |
| **Sidebar Background** | `#E8EBF0` | Navigation menu background |
| **Primary Text** | `#1A2333` | Headings, active menu text, main content |
| **Secondary Text** | `#6B7A8D` | Subheadings, icons, inactive menu text |
| **Border Color** | `#C8CDD6` | Cards, sidebar, and header borders |
| **Active/Hover State** | `#D6DBE4` | Selected menu items, button hovers |
| **Success/Positive** | `#1D9E75` | Revenue increase, active status |
| **Danger/Alert** | `#E24B4A` | Revenue decrease, notifications, waste |
| **Warning/Pending** | `#FEF3E2` | Cooking status, expiring soon |

### 1.3 Shared Components & Logic
- **Sidebar (`#sidebar-menu`):** Contains navigation links grouped by "Operations", "Inventory", "Business", and "Credentials".
- **Header:** Contains User Profile (popup), Notifications (popup with red dot badge), and Settings (Online Status, Language toggle).
- **Mobile Navigation:** Overlay (`#mobile-overlay`) and hamburger menu button.
- **AI Assistant ("พุงกางMAN"):** Persistent FAB with a chat interface and context-aware help.
- **Data Rendering:** Currently uses manual DOM manipulation (`insertAdjacentHTML`).

---

## 2. Recommended Tech Stack (Production-Grade)

- **Framework:** React 18+ (TypeScript)
- **Build Tool:** Vite
- **Routing:** React Router DOM v6
- **Data Fetching:** **TanStack Query (React Query)** — *Crucial for caching, loading states, and API synchronization.*
- **State Management:** 
  - **Zustand:** For global UI state (Sidebar, Notifications, User session).
  - **React Context:** For localized, complex form state (e.g., Waste Log spreadsheet).
- **Styling:** Tailwind CSS (Local PostCSS setup).
- **Icons:** Lucide React.
- **Charts:** Recharts.
- **Testing:** **Vitest + React Testing Library** — *For unit and integration testing.*

### Folder Structure
```text
src/
├── api/             # API services and TanStack Query hooks
├── assets/          # Images, Global CSS
├── components/      # Reusable UI parts
│   ├── layout/      # Sidebar, Header, Layout Wrapper, AIWidget
│   ├── common/      # Button, Modal, Input, Badge, Table
│   └── ...          # Feature-specific components
├── hooks/           # Custom UI hooks (useSidebar, useLocalStorage)
├── pages/           # Page components
├── store/           # Zustand stores (global state)
├── providers/       # Context Providers (Auth, AI Context)
├── utils/           # Formatting, Constants
├── __tests__/       # Test files
└── main.tsx         # Entry point
```

---

## 3. Step-by-Step Conversion Guide

### Step 1: Environment & Foundation
1. Initialize Vite + TypeScript + Tailwind.
2. Setup **TanStack Query** provider in `main.tsx`.
3. Configure `tailwind.config.js` with the specific restaurant palette.

### Step 2: Global Layout & Core UI
1. Create a `Layout` component.
2. Implement **Zustand** for UI state (e.g., `useUIStore` to manage sidebar and popups).
3. Build the `AIWidget`: Use a **Zustand store** or **Context** to track "Current Page Context" so the AI knows if the user is looking at "Stock" or "Orders".

### Step 3: Logic Migration (Replacing Anti-Patterns)
- **Declarative UI:** Replace `classList.toggle('hidden')` with conditional React rendering.
- **Data over DOM:** Replace `insertAdjacentHTML` with `.map()` and TanStack Query's `useQuery`.
- **Filtering:** Move manual array filtering into `useMemo` hooks for performance.

---

## 4. Advanced Production Features (Phase 2)

### 4.1 Data Layer Strategy
- **API Services:** Define axios/fetch wrappers in `src/api/`.
- **Query Hooks:** Create custom hooks (e.g., `useOrders()`, `useStock()`) that wrap TanStack Query for centralized data logic.
- **Mocking:** Use MSW (Mock Service Worker) during development to simulate API responses before the backend is ready.

### 4.2 Auth & Route Guarding
- **Protected Routes:** Implement a `<ProtectedRoute>` component using React Router and the Zustand Auth store.
- **RBAC:** Integrate Role-Based Access Control logic at the route and component levels (e.g., hide "Staff" page for non-admins).

### 4.3 Resilience & UX
- **Error Boundaries:** Use `react-error-boundary` to prevent the whole app from crashing on local component failures.
- **Loading States:** Implement skeleton screens or global progress bars tied to `isFetching` from TanStack Query.

### 4.4 Testing Strategy
- **Unit Tests:** Test utility functions (currency formatting) and hooks.
- **Component Tests:** Verify that the Sidebar toggles and Modals open/close correctly using React Testing Library.

---

## 5. Page-Specific Migration Notes

| Page | Migration Strategy |
| :--- | :--- |
| **Dashboard** | Recharts for data. TanStack Query for real-time metric updates. |
| **Orders** | Tabbed interface using React state. `useOrders` hook for fetching. |
| **Waste Log** | **Spreadsheet Grid:** Use a matrix of controlled inputs with React Context to manage bulk edits. |
| **Staff** | RBAC integration. Badge components for permissions. |

---

## 6. Key Advantages
1. **Consistency:** Centralized theme and state.
2. **Predictability:** TanStack Query handles the "hard parts" of server state (caching, retries).
3. **Quality:** Integrated testing prevents regressions in complex logic like the Waste Log spreadsheet.

**Recommended Migration Order:**
1. **Layout & Sidebar** (Foundation)
2. **Data Layer Setup** (TanStack Query + API Mocking)
3. **Customer CRM** (Simple CRUD to test the data layer)
4. **Menu & Stock** (Medium complexity)
5. **Waste Log** (Advanced spreadsheet logic)
6. **Auth & RBAC** (Securing the platform)
