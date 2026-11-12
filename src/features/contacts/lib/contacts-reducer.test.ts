import { describe, expect, it } from 'vitest'
import { contactsReducer } from './contacts-reducer'
import type { Contact } from '../types/contact'

const a: Contact = {
	id: '1',
	name: 'Ada',
	email: 'ada@x.com',
	phone: '',
	createdAt: '2024-01-01T00:00:00.000Z',
}
const b: Contact = {
	id: '2',
	name: 'Bob',
	email: 'bob@x.com',
	phone: '123456',
	createdAt: '2024-01-02T00:00:00.000Z',
}

describe('contactsReducer', () => {
	it('adds a contact without mutating state', () => {
		const state = [a]
		const next = contactsReducer(state, { type: 'added', contact: b })
		expect(next).toEqual([a, b])
		expect(state).toEqual([a])
		expect(next).not.toBe(state)
	})

	it('updates an existing contact', () => {
		const state = [a, b]
		const next = contactsReducer(state, {
			type: 'updated',
			contact: { ...a, name: 'Ada L' },
		})
		expect(next[0].name).toBe('Ada L')
		expect(next[1]).toBe(b)
		expect(state[0].name).toBe('Ada')
	})

	it('deletes a contact', () => {
		expect(contactsReducer([a, b], { type: 'deleted', id: '1' })).toEqual([b])
	})

	it('returns the same reference for an unknown id', () => {
		const state = [a, b]
		expect(contactsReducer(state, { type: 'deleted', id: 'zzz' })).toBe(state)
		expect(contactsReducer(state, { type: 'updated', contact: { ...a, id: 'zzz' } })).toBe(state)
	})
})
