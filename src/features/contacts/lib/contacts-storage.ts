import { z } from 'zod'
import { contactSchema, type Contact } from '../types/contact'

export interface ContactsStorage {
  load(): Contact[]
  save(contacts: Contact[]): void
}

const contactsArraySchema = z.array(contactSchema)

export function createLocalStorageContactsStorage(key = 'contacts.v1'): ContactsStorage {
  return {
    load() {
      try {
        const raw = localStorage.getItem(key)
        if (raw === null) return []
        const result = contactsArraySchema.safeParse(JSON.parse(raw))
        return result.success ? result.data : []
      } catch {
        return []
      }
    },
    save(contacts) {
      try {
        localStorage.setItem(key, JSON.stringify(contacts))
      } catch (error) {
        console.error('Failed to save contacts', error)
      }
    },
  }
}
