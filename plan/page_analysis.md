# Pungkang (พุงกาง) Project Structure & UI/UX Analysis

This document provides a detailed analysis of the existing HTML/Tailwind CSS project to facilitate migration to React.

## 1. Project Overview
- **Technology Stack:** HTML5, Tailwind CSS (via CDN), Vanilla JavaScript.
- **Primary Design Pattern:** Dashboard layout with a fixed sidebar and a header.
- **Target Platform:** Web (Responsive, includes mobile-specific adjustments).

## 2. Global UI/UX Elements

### 2.1 Color Palette
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

### 2.2 Shared Components
- **Sidebar (`#sidebar-menu`):**
  - Contains navigation links grouped by "Operations", "Inventory", "Business", and "Credentials".
  - Interactive: Highlighted active states, mobile toggle.
- **Header:**
  - Contains User Profile (popup), Notifications (popup with red dot badge), and Settings (popup with toggle switches).
- **Mobile Navigation:**
  - Overlay (`#mobile-overlay`) and hamburger menu button.
- **AI Assistant ("พุงกางMAN"):**
  - Persistent FAB (Floating Action Button) on the bottom right.
  - Chat window with message history and input area.
- **Logout Modal:**
  - Warning modal for logout action.

---

## 3. Page-by-Page Analysis

### 3.1 Dashboard (`index.html`)
- **Title:** พุงกาง – Dashboard
- **Size:** 49.7 KB
- **Usage:** Central hub for restaurant metrics and quick actions.
- **Key Content:**
  - **Metric Cards:** Revenue, Total Orders, Average Order Value (AOV), Occupied Tables. Includes percentage change indicators.
  - **Period Selectors:** Today, This Week, This Month buttons.
  - **Current Orders Section:** List of active orders with status badges (Cooking, Ready, New, Paid).
  - **Revenue Chart:** Simple bar chart visual representing daily revenue.
  - **Alert Widgets:** Stock alerts (Low/Expired), Latest Waste, Promotion Performance.

### 3.2 Table Management (`table.html`)
- **Title:** พุงกาง – Tables
- **Size:** 74.9 KB
- **Usage:** Visual representation and status management of restaurant tables.
- **Key Content:**
  - Table grid/floor plan.
  - Status indicators (Occupied, Available, Reserved).
  - Interactive table cards.
- **Note:** `test.html` is a duplicate of this file.

### 3.3 Order Management (`order.html`)
- **Title:** พุงกาง – Orders
- **Size:** 56.5 KB
- **Usage:** Detailed tracking and processing of customer orders.
- **Key Content:**
  - **Tabbed Interface:** Tabs for All, New, Processing, Ready, and Completed.
  - **Order List/Cards:** Detailed order information including items, total price, and timestamps.
  - Custom tab animation/styling in `<style>` tag.

### 3.4 Menu Management (`menu.html`)
- **Title:** พุงกาง – Menu Management
- **Size:** 58.5 KB
- **Usage:** Adding, editing, and organizing restaurant menu items.
- **Key Content:**
  - Category navigation.
  - Grid of menu items with images, prices, and stock status.
  - Search and filter functionality.

### 3.5 Stock Management (`stock.html`)
- **Title:** พุงกาง – Stock Management
- **Size:** 39.7 KB
- **Usage:** Inventory tracking and ingredient management.
- **Key Content:**
  - **Spreadsheet UI:** Table-based interface for recording lots and availability.
  - Custom cell focus styling.
  - Low stock and expiry warnings.

### 3.6 Waste Log (`waste.html`)
- **Title:** พุงกาง – Waste Log
- **Size:** 38.4 KB
- **Usage:** Recording and analyzing food waste/loss.
- **Key Content:**
  - Log entry form/table.
  - Categorization of waste (Expired, Mistake, etc.).
  - Cost impact calculations.

### 3.7 Promotion Management (`promotion.html`)
- **Title:** พุงกาง – Promotions
- **Size:** 40.0 KB
- **Usage:** Managing discount codes and marketing campaigns.
- **Key Content:**
  - List of active/inactive promotions.
  - Performance metrics per code (Usage count).
  - Expiry tracking.

### 3.8 Customer Management (`customer.html`)
- **Title:** พุงกาง – Customer Management
- **Size:** 47.9 KB
- **Usage:** CRM for managing customer profiles and loyalty.
- **Key Content:**
  - Customer list with contact info and visit history.
  - Search/Filter by name or membership.

### 3.9 Staff Management (`staff.html`)
- **Title:** พุงกาง – Staff Management
- **Size:** 46.8 KB
- **Usage:** Managing employee records and access levels.
- **Key Content:**
  - Staff directory.
  - Role assignments (Owner, Admin, Waiter, Kitchen).
  - Shift/Status tracking.

---

## 4. React Migration Strategy Recommendations

### 4.1 Component Breakdown
- **Layout:** `Layout` wrapper component containing `Sidebar`, `Header`, and `MainContent`.
- **Navigation:** Use `react-router-dom` for client-side routing between the 9 main pages.
- **State Management:** 
  - `Context API` or `Zustand` for global state (User profile, Notifications, Sidebar toggle).
  - Local state for page-specific filters and tabs.
- **UI Library:** Consider using `Headless UI` or `Radix UI` for the popups and modals while keeping the custom Tailwind styles to preserve the existing look and feel.

### 4.2 Data Fetching
- Replace static HTML mock data with `useEffect` or `TanStack Query` (React Query) to fetch data from a JSON API.

### 4.3 Chat Widget
- Implement the "พุงกางMAN" chat widget as a persistent component in the `Layout`.
