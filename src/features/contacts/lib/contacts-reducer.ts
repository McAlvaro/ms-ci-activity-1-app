import type { Contact } from '../types/contact'

export type ContactsAction =
  | { type: 'added'; contact: Contact }
  | { type: 'updated'; contact: Contact }
  | { type: 'deleted'; id: string }

export function contactsReducer(state: Contact[], action: ContactsAction): Contact[] {
  switch (action.type) {
    case 'added':
      return [...state, action.contact]
    case 'updated': {
      if (!state.some((c) => c.id === action.contact.id)) return state
      return state.map((c) => (c.id === action.contact.id ? action.contact : c))
    }
    case 'deleted': {
      if (!state.some((c) => c.id === action.id)) return state
      return state.filter((c) => c.id !== action.id)
    }
  }
}
