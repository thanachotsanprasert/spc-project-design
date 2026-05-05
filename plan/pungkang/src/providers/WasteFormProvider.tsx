import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import { WasteReason, WasteEntry } from '../types'

interface WasteFormRow {
  id: string;
  itemName: string;
  reason: WasteReason;
  quantity: number | '';
  unit: string;
  estimatedCost: number | '';
}

interface WasteFormState {
  rows: WasteFormRow[];
}

type WasteFormAction = 
  | { type: 'ADD_ROW' }
  | { type: 'REMOVE_ROW', id: string }
  | { type: 'UPDATE_ROW', id: string, updates: Partial<WasteFormRow> }
  | { type: 'CLEAR_FORM' };

const initialRow = (): WasteFormRow => ({
  id: Math.random().toString(36).substr(2, 9),
  itemName: '',
  reason: 'Expired',
  quantity: '',
  unit: 'kg',
  estimatedCost: '',
});

const WasteFormContext = createContext<{
  state: WasteFormState;
  dispatch: React.Dispatch<WasteFormAction>;
} | null>(null);

function wasteFormReducer(state: WasteFormState, action: WasteFormAction): WasteFormState {
  switch (action.type) {
    case 'ADD_ROW':
      return { rows: [...state.rows, initialRow()] };
    case 'REMOVE_ROW':
      return { rows: state.rows.filter(r => r.id !== action.id) };
    case 'UPDATE_ROW':
      return {
        rows: state.rows.map(r => r.id === action.id ? { ...r, ...action.updates } : r)
      };
    case 'CLEAR_FORM':
      return { rows: [initialRow()] };
    default:
      return state;
  }
}

export function WasteFormProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wasteFormReducer, { rows: [initialRow()] });

  return (
    <WasteFormContext.Provider value={{ state, dispatch }}>
      {children}
    </WasteFormContext.Provider>
  )
}

export const useWasteForm = () => {
  const context = useContext(WasteFormContext);
  if (!context) throw new Error('useWasteForm must be used within a WasteFormProvider');
  return context;
};
