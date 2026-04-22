# React Migration Plan: พุงกาง Restaurant Platform

This document outlines a detailed, step-by-step strategy to migrate the current HTML/JavaScript dashboard into a modern, scalable React framework. As a Senior Full Stack Developer specializing in React, I recommend using **Vite** for the build tool and **Tailwind CSS** for styling (leveraging your existing Tailwind implementation).

---

## 1. Project Initialization & Architecture

### Recommended Tech Stack
- **Framework:** React 18+
- **Build Tool:** Vite (Faster development cycles than Create React App)
- **Routing:** React Router DOM v6
- **Styling:** Tailwind CSS (Already in use, easy to port)
- **Icons:** Lucide React (Modern, consistent SVG icons)
- **State Management:** Zustand (Lightweight) or React Context API
- **Charts:** Recharts or Chart.js

### Folder Structure
```text
src/
├── assets/          # Images, Global CSS
├── components/      # Reusable UI parts
│   ├── layout/      # Sidebar, Header, Layout Wrapper
│   ├── common/      # Button, Modal, Input, Badge
│   ├── dashboard/   # StatCard, RecentOrders, RevenueChart
│   ├── menu/        # MenuCard, CategoryTabs
│   └── orders/      # OrderTable, OrderModal
├── hooks/           # Custom React hooks (e.g., useLocalStorage)
├── pages/           # Page components (Dashboard, Orders, Menu, etc.)
├── store/           # Global state (User, Cart, Notifications)
├── utils/           # Formatting, Constants, Validators
├── App.tsx          # Main routing & provider setup
└── main.tsx         # Entry point
```

---

## 2. Step-by-Step Conversion Guide

### Step 1: Environment Setup
1. Initialize Vite: `npm create vite@latest pungkang-react -- --template react-ts`
2. Install dependencies:
   ```bash
   npm install react-router-dom lucide-react zustand clsx tailwind-merge
   npm install -D tailwindcss autoprefixer postcss
   npx tailwindcss init -p
   ```
3. Port your `tailwind.config.js` colors and fonts.

### Step 2: Create the Global Layout
Extract the Sidebar and TopBar from your HTML files into React components. Use `React Router`'s `<Outlet />` for the main content area.

- **Sidebar Component:** Convert all `<a>` tags to `<NavLink>` to handle "active" states automatically.
- **Header Component:** Move the profile, notification, and settings popups into their own small components using React's `useState`.

### Step 3: Atomic Component Extraction
Identify repeated UI elements and turn them into props-driven components:
- **Badge:** `<StatusBadge status="Cooking" />`
- **StatCard:** `<StatCard title="Total Revenue" value="฿48,320" trend="+12.4%" />`
- **Table:** Create a reusable `<Table />` component that accepts `columns` and `data` arrays.

### Step 4: Logic Migration
Convert your script tags into React logic:
- **Tab Switching:** Replace `switchTab(tab)` with a local `[activeTab, setActiveTab] = useState('active')`.
- **Modals:** Create a global Modal portal or simple state-controlled components.
- **Dashboard Filter:** Use a state to track `period` (today/week/month) and use it to filter data.

### Step 5: Data Management (The "React Way")
Currently, your data is hardcoded in `dashboardData`. In React:
1. Create a `constants/data.ts` to hold initial mock data.
2. Use `useEffect` to simulate fetching data from an API.
3. Use `Zustand` to manage global states like the "Orders Count" shown in the sidebar badge.

---

## 3. Page-Specific Migration Notes

### Dashboard (`index.html`)
- **Revenue Chart:** Instead of manual `div` bars with fixed heights, use **Recharts**. It provides tooltips, animations, and responsive scaling out of the box.

### Menu Management (`menu.html`)
- **Filtering:** Use `array.filter()` on your menu items list based on the active category state.
- **Add Item:** Turn the "Add New Item" modal into a controlled form using `useState` for each input.

### Orders (`order.html`)
- **Tabs:** Use a single `Orders` page with a tab state that toggles between an "ActiveOrdersTable" and "HistoricalOrdersTable".
- **Calculations:** Move tax and subtotal calculations into a utility function `calculateOrderTotal(items)`.

---

## 4. Key Advantages of this Migration
1. **No Code Duplication:** You won't have to copy the Sidebar/Header into 10 different files. Change it once, it updates everywhere.
2. **Speed:** React only updates the parts of the DOM that changed (e.g., just the badge count), making the dashboard feel much snappier.
3. **Type Safety:** Using TypeScript (standard in modern React) will prevent bugs like passing a string where a number (price) is expected.
4. **Maintenance:** It's much easier to add a "Dark Mode" or "Multi-language support" using React Context than with plain JS.

---

## 5. Getting Started Today
I recommend starting with the **Layout**. Once you have a working Sidebar and Header in React, port the **Menu Management** page first, as it has the most interactive "CRUD" logic (Create, Read, Update, Delete) which React handles beautifully.

**Full Stack Pro Tip:** When you're ready to connect to a real database, look into **Supabase** or **Firebase** for a quick backend, or **Node.js/Express** if you want full control.
