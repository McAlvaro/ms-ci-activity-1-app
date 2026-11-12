import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useContacts } from './use-contacts'
import type { ContactsStorage } from '../lib/contacts-storage'
import type { Contact } from '../types/contact'

const seed: Contact = { id: 's1', name: 'Seed', email: 's@x.com', phone: '', createdAt: '2024-01-01T00:00:00.000Z' }

function fakeStorage(initial: Contact[] = []) {
  return { load: vi.fn(() => initial), save: vi.fn<(contacts: Contact[]) => void>() } satisfies ContactsStorage
}

describe('useContacts', () => {
  it('loads initial contacts from storage', () => {
    const { result } = renderHook(() => useContacts(fakeStorage([seed])))
    expect(result.current.contacts).toEqual([seed])
  })

  it('adds a contact with generated id and createdAt', () => {
    const { result } = renderHook(() => useContacts(fakeStorage()))
    act(() => result.current.addContact({ name: 'Ada', email: 'a@x.com', phone: '' }))
    const [added] = result.current.contacts
    expect(added.name).toBe('Ada')
    expect(added.id).toBeTruthy()
    expect(Number.isNaN(Date.parse(added.createdAt))).toBe(false)
  })

  it('updates a contact keeping id and createdAt', () => {
    const { result } = renderHook(() => useContacts(fakeStorage([seed])))
    act(() => result.current.updateContact('s1', { name: 'New', email: 'n@x.com', phone: '' }))
    expect(result.current.contacts[0]).toEqual({ ...seed, name: 'New', email: 'n@x.com' })
  })

  it('deletes a contact', () => {
    const { result } = renderHook(() => useContacts(fakeStorage([seed])))
    act(() => result.current.deleteContact('s1'))
    expect(result.current.contacts).toEqual([])
  })

  it('saves the new state on change', () => {
    const storage = fakeStorage([seed])
    const { result } = renderHook(() => useContacts(storage))
    act(() => result.current.deleteContact('s1'))
    expect(storage.save).toHaveBeenLastCalledWith([])
  })
})
