import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import "./index.css"

import { AuthProvider } from "./providers/AuthProvider"
import Layout from "./components/layout/Layout"
import Dashboard from "./pages/Dashboard"
import Tables from "./pages/Tables"
import Orders from "./pages/Orders"
import Menu from "./pages/Menu"
import Stock from "./pages/Stock"
import WasteLog from "./pages/WasteLog"
import Promotions from "./pages/Promotions"
import Customers from "./pages/Customers"
import Staff from "./pages/Staff"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthProvider><Layout /></AuthProvider>,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "tables", element: <Tables /> },
      { path: "orders", element: <Orders /> },
      { path: "menu", element: <Menu /> },
      { path: "stock", element: <Stock /> },
      { path: "waste", element: <WasteLog /> },
      { path: "promotions", element: <Promotions /> },
      { path: "customers", element: <Customers /> },
      { path: "staff", element: <Staff /> },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> }
])

async function prepareApp() {
  if (import.meta.env.MODE === 'development') {
    const { worker } = await import('./mocks/browser')
    return worker.start({ 
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: '/mockServiceWorker.js'
      }
    })
  }
  return Promise.resolve()
}

prepareApp().then(() => {
  const rootElement = document.getElementById('root')
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </React.StrictMode>
    )
  }
})
