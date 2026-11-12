import type { Contact } from '../types/contact'
import { ContactListItem } from './ContactListItem'
import { EmptyState } from './EmptyState'

interface ContactListProps {
  contacts: Contact[]
  hasQuery?: boolean
  onEdit: (contact: Contact) => void
  onDelete: (contact: Contact) => void
}

export function ContactList({ contacts, hasQuery = false, onEdit, onDelete }: ContactListProps) {
  if (contacts.length === 0) return <EmptyState hasQuery={hasQuery} />
  return (
    <ul className="flex flex-col gap-3">
      {contacts.map((contact) => (
        <ContactListItem key={contact.id} contact={contact} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </ul>
  )
}
