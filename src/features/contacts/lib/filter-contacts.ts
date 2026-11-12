import type { Contact } from '../types/contact'

export function filterContacts(contacts: Contact[], query: string): Contact[] {
	const q = query.trim().toLowerCase()
	const matchesQuery = (c: Contact) =>
		[c.name, c.email, c.phone].some((field) => field.toLowerCase().includes(q))
	const matches = q ? contacts.filter(matchesQuery) : contacts
	return [...matches].sort((x, y) => x.name.localeCompare(y.name))
}
