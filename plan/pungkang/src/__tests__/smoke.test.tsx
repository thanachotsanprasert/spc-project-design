import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from '../components/layout/Layout'
import Dashboard from '../pages/Dashboard'
import { AuthProvider } from '../providers/AuthProvider'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

describe('Application Smoke Test', () => {
  it('renders the layout and dashboard without crashing', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <MemoryRouter initialEntries={['/']}>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
              </Route>
            </Routes>
          </MemoryRouter>
        </AuthProvider>
      </QueryClientProvider>
    )

    // Check if sidebar logo text is present
    expect(screen.getByText(/พุงกาง/i)).toBeInTheDocument()
    // Check if dashboard text is present
    expect(screen.getByText(/Dashboard Page/i)).toBeInTheDocument()
  })
})
