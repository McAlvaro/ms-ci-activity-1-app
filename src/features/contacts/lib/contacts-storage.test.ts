import { afterEach, describe, expect, it, vi } from 'vitest'
import { createLocalStorageContactsStorage } from './contacts-storage'
import type { Contact } from '../types/contact'

const sample: Contact[] = [
	{
		id: '1',
		name: 'Ada',
		email: 'ada@x.com',
		phone: '',
		createdAt: '2024-01-01T00:00:00.000Z',
	},
]

afterEach(() => vi.restoreAllMocks())

describe('createLocalStorageContactsStorage', () => {
	it('round-trips contacts', () => {
		const storage = createLocalStorageContactsStorage()
		storage.save(sample)
		expect(storage.load()).toEqual(sample)
	})
	it('uses the default key contacts.v1', () => {
		createLocalStorageContactsStorage().save(sample)
		expect(localStorage.getItem('contacts.v1')).not.toBeNull()
	})
	it('returns [] for a missing key', () => {
		expect(createLocalStorageContactsStorage().load()).toEqual([])
	})
	it('returns [] for corrupt JSON', () => {
		localStorage.setItem('contacts.v1', '{not json')
		expect(createLocalStorageContactsStorage().load()).toEqual([])
	})
	it('returns [] for schema-invalid data', () => {
		localStorage.setItem('contacts.v1', JSON.stringify([{ id: 1 }]))
		expect(createLocalStorageContactsStorage().load()).toEqual([])
	})
	it('does not throw when setItem throws', () => {
		vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
			throw new DOMException('full', 'QuotaExceededError')
		})
		vi.spyOn(console, 'error').mockImplementation(() => {})
		expect(() => createLocalStorageContactsStorage().save(sample)).not.toThrow()
		expect(console.error).toHaveBeenCalled()
	})
})
