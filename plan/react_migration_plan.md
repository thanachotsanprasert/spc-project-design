# React Migration Plan: พุงกาง Restaurant Platform

This document outlines a detailed, step-by-step strategy to migrate the current HTML/JavaScript dashboard into a modern, scalable React framework. This plan is based on a thorough analysis of the existing project structure, UI/UX design, and core business logic.

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
- **AI Assistant ("พุงกางMAN"):** Persistent FAB (Floating Action Button) with a chat interface and context-aware help.
- **Data Rendering:** Uses `insertAdjacentHTML` and `innerHTML` with mapping functions in the original version.

---

## 2. Project Initialization & Architecture

### Recommended Tech Stack
- **Framework:** React 18+ (TypeScript)
- **Build Tool:** Vite
- **Routing:** React Router DOM v6 (Client-side routing)
- **Styling:** Tailwind CSS (Porting existing CDN-based classes to a local PostCSS setup)
- **Icons:** Lucide React (Clean SVG icons matching the current aesthetic)
- **State Management:** 
  - **Zustand:** For global UI state (Sidebar toggle, User Profile, Notifications).
  - **React Context:** For localized multi-step forms (e.g., Spreadsheet Entry).
- **Charts:** Recharts (For the Dashboard Revenue Chart)

### Folder Structure
```text
src/
├── assets/          # Images, Global CSS
├── components/      # Reusable UI parts
│   ├── layout/      # Sidebar, Header, Layout Wrapper, AIWidget
│   ├── common/      # Button, Modal, Input, Badge, Table (Reusable)
│   ├── dashboard/   # StatCard, RecentOrders, RevenueChart
│   ├── inventory/   # StatusBadge, StockTable
│   └── shared/      # Popups (Profile, Notifications, Settings)
├── hooks/           # useTables, useOrders, useChat (Custom hooks)
├── pages/           # Page components (Dashboard, Orders, Tables, etc.)
├── store/           # Global state (User, Notifications)
├── utils/           # Formatting (Currency ฿), Constants, MockData
└── main.tsx         # Entry point
```

---

## 3. Step-by-Step Conversion Guide

### Step 1: Environment Setup
1. Initialize Vite with TypeScript.
2. Configure `tailwind.config.js` with the specific hex codes from the analysis.
3. Port the font-sans and global reset styles.

### Step 2: Global Layout & Popups
1. Create a `Layout` component that wraps the `Sidebar` and `Header`.
2. Implement the `Header` popups (Profile, Notifications, Settings) as individual React components using `useState` or a global UI store.
3. Build the `AIWidget` (พุงกางMAN) as a persistent global component.

### Step 3: Logic Migration (The "React Way")
- **Manual State to Hooks:** Replace `classList.toggle('hidden')` with conditional rendering (`{isOpen && <Modal />}`).
- **Rendering Loops:** Replace `insertAdjacentHTML` loops with `.map()` within JSX.
- **Filtering:** Use `useMemo` to filter tables, orders, and menu items efficiently based on user input.

---

## 4. Page-Specific Migration Notes

| Page | Analysis Details | Migration Strategy |
| :--- | :--- | :--- |
| **Dashboard** | Metrics, Top Products, Revenue Chart | Use Recharts. Componentize the Top Products list for reusability. |
| **Tables** | Status Filtering (Available, Occupied) | Implement a `renderTables` function using `.filter()` and `.map()`. |
| **Orders** | Status Tabs (Ongoing, Finished) | Use a state-controlled tab system. implement a central `useOrders` hook. |
| **Menu** | Category Tabs, "In Stock" Toggle | Build a `MenuCard` component with an internal toggle state. |
| **Stock** | Quantity vs. Reorder Point Logic | Implement a utility function to calculate badge colors based on levels. |
| **Waste Log** | **Spreadsheet Entry (Advanced)** | Use `contenteditable` or a grid of inputs with a complex state object. |
| **Customer** | Loyalty Points, Spent History | Simple CRUD-style table with search filtering. |
| **Staff** | Permissions, Access Level Badges | Implement a role-based access control (RBAC) component logic. |

---

## 5. Key Advantages & Learning Path
1. **Consistency:** Centralized theme configuration in Tailwind.
2. **Maintenance:** Updating the Sidebar once reflects across all 9 pages.
3. **Advanced UI:** React's controlled components make the "Spreadsheet Entry" in the Waste Log much more reliable than manual DOM manipulation.

**Recommended Migration Order:**
1. **Layout & Sidebar** (Foundation)
2. **Customer CRM** (Easiest - simple table/search)
3. **Menu Management** (Medium - tabs/toggles)
4. **Waste Log** (Advanced - spreadsheet grid)
