import { useMemo, useState } from 'react'
import { PlusIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useContacts } from '../hooks/use-contacts'
import { filterContacts } from '../lib/filter-contacts'
import type { Contact, ContactInput } from '../types/contact'
import { ContactFormDialog } from './ContactFormDialog'
import { ContactList } from './ContactList'
import { ContactSearch } from './ContactSearch'
import { DeleteContactDialog } from './DeleteContactDialog'

export function ContactsPage() {
	const { contacts, addContact, updateContact, deleteContact } = useContacts()
	const [query, setQuery] = useState('')
	const [formOpen, setFormOpen] = useState(false)
	const [editing, setEditing] = useState<Contact | undefined>()
	const [deleting, setDeleting] = useState<Contact | null>(null)

	const visible = useMemo(() => filterContacts(contacts, query), [contacts, query])

	const openAdd = () => {
		setEditing(undefined)
		setFormOpen(true)
	}

	const openEdit = (contact: Contact) => {
		setEditing(contact)
		setFormOpen(true)
	}

	const handleSubmit = (input: ContactInput) => {
		if (editing) {
			updateContact(editing.id, input)
			toast.success('Contact updated')
		} else {
			addContact(input)
			toast.success('Contact added')
		}
	}

	const handleConfirmDelete = (id: string) => {
		deleteContact(id)
		setDeleting(null)
		toast.success('Contact deleted')
	}

	return (
		<div className="mx-auto min-h-screen max-w-2xl px-4">
			<header className="flex items-center justify-between py-6">
				<h1 className="text-2xl font-semibold">Contacts</h1>
				<Button onClick={openAdd}>
					<PlusIcon aria-hidden="true" />
					Add contact
				</Button>
			</header>
			<main className="flex flex-col gap-4 pb-8">
				<ContactSearch value={query} onChange={setQuery} />
				<ContactList
					contacts={visible}
					hasQuery={query.trim() !== ''}
					onEdit={openEdit}
					onDelete={setDeleting}
				/>
			</main>
			<ContactFormDialog
				open={formOpen}
				onOpenChange={setFormOpen}
				contact={editing}
				onSubmit={handleSubmit}
			/>
			<DeleteContactDialog
				contact={deleting}
				onConfirm={handleConfirmDelete}
				onCancel={() => setDeleting(null)}
			/>
		</div>
	)
}
