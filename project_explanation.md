# Project Explanation: พุงกาง (Pungkang) Restaurant Management Platform

This document provides a comprehensive overview of the "พุงกาง" project, a web-based restaurant management system. This guide is designed to help you understand the project structure and the code logic, making it easier to choose a page to migrate to React.

---

## 🏗 Project Overview

The project is a multi-page application (MPA) built with **HTML**, **Tailwind CSS** (via CDN), and **Vanilla JavaScript**. It consists of several management modules for a restaurant, such as tables, orders, stock, and staff.

### Common Features (Across All Pages)
- **Sidebar Navigation:** A consistent sidebar for navigating between different modules.
- **Header:** Contains user profile, notifications, and quick settings (Online Status, Language).
- **AI Chatbot (พุงกางMAN):** A floating chat widget available on every page to assist the user.
- **Mock Data:** Most tables and lists are populated dynamically using JavaScript loops and mock data objects.

---

## 📄 Page Explanations

### 1. Dashboard (`index.html`)
- **Purpose:** Provides a high-level summary of the restaurant's performance.
- **Key Features:**
    - Statistical cards (Total Revenue, Total Orders, Average Check).
    - Top Selling Products list.
    - Recent Transactions table.
- **Code Logic:** Uses `insertAdjacentHTML` to render the transaction rows and top product list from a JavaScript array.

### 2. Table Management (`table.html`)
- **Purpose:** Visualizes and manages the physical layout of the restaurant tables.
- **Key Features:**
    - Filter tables by status (All, Available, Occupied, Reserved).
    - Table cards showing capacity and current status.
    - Ability to "Quick Actions" for each table.
- **Code Logic:** Uses a `renderTables(filter)` function that clears the container and re-populates it based on the selected filter.

### 3. Order Management (`order.html`)
- **Purpose:** Tracks and manages customer orders.
- **Key Features:**
    - Status tabs (Ongoing, To Accept, Finished, Cancelled).
    - Search bar and date filters.
    - Detailed table showing order ID, table number, items, and total price.
- **Code Logic:** Implements tab switching logic that updates the UI state and filters the displayed order list.

### 4. Menu Management (`menu.html`)
- **Purpose:** Manages the restaurant's food and drink offerings.
- **Key Features:**
    - Category tabs (Main Course, Appetizers, Drinks).
    - Menu item cards with price, category, and "In Stock" toggle.
    - Modal for adding new menu items.
- **Code Logic:** Uses JavaScript objects to store menu data and a rendering loop to display items. Includes a toggle switch implementation for "In Stock" status.

### 5. Inventory/Stock (`stock.html`)
- **Purpose:** Monitors raw materials and ingredient levels.
- **Key Features:**
    - Statistics for "Low Stock" and "Out of Stock" items.
    - Table of items with quantity, unit, and reorder points.
    - Color-coded status badges (In Stock, Low Stock, Out of Stock).
- **Code Logic:** Calculates the status badge color based on the `quantity` vs. `reorderPoint` values in the data.

### 6. Waste Log (`waste.html`)
- **Purpose:** Records food waste due to expiration, accidents, or mistakes.
- **Key Features:**
    - Summary of loss value.
    - Recent waste log table.
    - **Spreadsheet Entry Modal:** A unique feature allowing users to paste data into a grid-like interface (simulating Excel).
- **Code Logic:** The spreadsheet entry uses `contenteditable="true"` on table cells to allow direct typing/pasting.

### 7. Promotion Management (`promotion.html`)
- **Purpose:** Creates and tracks marketing discounts and offers.
- **Key Features:**
    - Active vs. Expired promotion tabs.
    - Promotion cards with discount percentage and validity period.
- **Code Logic:** Similar to Menu Management, it uses data-driven rendering to show different types of offers.

### 8. Customer CRM (`customer.html`)
- **Purpose:** Manages customer loyalty and contact information.
- **Key Features:**
    - Customer list with loyalty points, total spent, and last visit date.
    - Quick search for customer names or phone numbers.
- **Code Logic:** Focuses on table rendering and simple string searching for the filter functionality.

### 9. Staff Management (`staff.html`)
- **Purpose:** Manages employee accounts and permissions.
- **Key Features:**
    - Staff directory with roles (Owner, Manager, Cashier, etc.).
    - Access level badges (Full Access, POS Module, etc.).
    - Status toggle (Active/Locked).
- **Code Logic:** Demonstrates complex table structures with nested badges and multi-action buttons (Edit, Delete, Manage Access).

---

## 💻 Code Patterns Used

### 1. Tailwind CSS
The project uses Tailwind classes for all styling.
Example: `class="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm"`

### 2. State Management (Manual)
Since this is Vanilla JS, "state" is managed by:
- Modifying the DOM directly (e.g., `element.classList.toggle('hidden')`).
- Re-rendering HTML strings (e.g., `tbody.innerHTML = rows.map(...)`).

### 3. Popups & Modals
Uses absolute/fixed positioning and `hidden` utility class.
Logic: `document.getElementById('modal-id').classList.remove('hidden')`.

### 4. Mock Data Generation
Data is often generated using loops to fill the UI for testing.
```javascript
for (let i = 1; i <= 20; i++) {
  const row = `<tr>...</tr>`;
  tbody.insertAdjacentHTML('beforeend', row);
}
```

---

## 🎯 Which page should a "Newbie" choose for React?

If you are new to React, here are my recommendations based on difficulty:

1.  **Easiest: Customer Management (`customer.html`)**
    - **Why:** Simple table rendering, basic search filter. Great for learning `useState` and mapping over arrays.
2.  **Medium: Menu Management (`menu.html`)**
    - **Why:** Involves tabs (conditional rendering), toggles, and more complex cards. Good for learning component composition.
3.  **Harder: Table Management (`table.html`)**
    - **Why:** Requires managing a grid layout and filtering logic based on multiple states.
4.  **Advanced: Waste Log (`waste.html`)**
    - **Why:** The "Spreadsheet Entry" modal is quite complex and would be a great challenge for learning controlled inputs in React.

---
*Created for the React Migration Learning Path.*
