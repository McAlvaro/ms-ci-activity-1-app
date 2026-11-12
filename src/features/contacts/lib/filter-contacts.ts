import type { Contact } from '../types/contact'

export function filterContacts(contacts: Contact[], query: string): Contact[] {
	const q = query.trim().toLowerCase()
	const matches = q
		? contacts.filter((c) =>
			[c.name, c.email, c.phone].some((field) => field.toLowerCase().includes(q)),
		)
		: contacts
	return [...matches].sort((x, y) => x.name.localeCompare(y.name))
}
