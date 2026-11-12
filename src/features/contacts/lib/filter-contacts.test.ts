import { describe, expect, it } from 'vitest'
import { filterContacts } from './filter-contacts'
import type { Contact } from '../types/contact'

const make = (id: string, name: string, email: string, phone: string): Contact => ({
	id,
	name,
	email,
	phone,
	createdAt: '2024-01-01T00:00:00.000Z',
})
const contacts = [
	make('1', 'Zoe Zed', 'zoe@mail.com', '+1 555 0100'),
	make('2', 'adam Ant', 'adam@corp.io', ''),
	make('3', 'Maria Lopez', 'ml@site.org', '(600) 123-456'),
]

describe('filterContacts', () => {
	it('returns all contacts sorted by name for an empty query', () => {
		expect(filterContacts(contacts, '').map((c) => c.id)).toEqual(['2', '3', '1'])
		expect(filterContacts(contacts, '   ').map((c) => c.id)).toEqual(['2', '3', '1'])
	})
	it('matches name case-insensitively', () => {
		expect(filterContacts(contacts, 'ZOE').map((c) => c.id)).toEqual(['1'])
	})
	it('matches email', () => {
		expect(filterContacts(contacts, 'CORP.io').map((c) => c.id)).toEqual(['2'])
	})
	it('matches phone', () => {
		expect(filterContacts(contacts, '555').map((c) => c.id)).toEqual(['1'])
	})
	it('trims the query', () => {
		expect(filterContacts(contacts, '  maria ').map((c) => c.id)).toEqual(['3'])
	})
	it('returns empty when nothing matches and does not mutate input', () => {
		const copy = [...contacts]
		expect(filterContacts(contacts, 'nope')).toEqual([])
		expect(contacts).toEqual(copy)
	})
})
