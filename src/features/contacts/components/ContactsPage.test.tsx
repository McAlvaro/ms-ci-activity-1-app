import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ContactsPage } from './ContactsPage'

async function addContact(
	user: ReturnType<typeof userEvent.setup>,
	name: string,
	email: string,
	phone = '',
) {
	await user.click(screen.getByRole('button', { name: 'Add contact' }))
	const dialog = await screen.findByRole('dialog', { name: 'Add contact' })
	await user.type(within(dialog).getByLabelText('Name'), name)
	await user.type(within(dialog).getByLabelText('Email'), email)
	if (phone) await user.type(within(dialog).getByLabelText('Phone'), phone)
	await user.click(within(dialog).getByRole('button', { name: 'Add contact' }))
	await vi.waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
}

describe('ContactsPage', () => {
	it('shows the empty state initially', () => {
		render(<ContactsPage />)
		expect(screen.getByText('No contacts yet')).toBeInTheDocument()
	})

	it('adds a contact', async () => {
		const user = userEvent.setup()
		render(<ContactsPage />)
		await addContact(user, 'Ada Lovelace', 'ada@x.com', '123456')
		const list = screen.getByRole('list')
		expect(within(list).getByText('Ada Lovelace')).toBeInTheDocument()
		expect(within(list).getByText('ada@x.com')).toBeInTheDocument()
		expect(screen.queryByText('No contacts yet')).not.toBeInTheDocument()
	})

	it('filters by search and shows the no-match state', async () => {
		const user = userEvent.setup()
		render(<ContactsPage />)
		await addContact(user, 'Ada', 'ada@x.com')
		await addContact(user, 'Bob', 'bob@x.com')
		const search = screen.getByLabelText('Search contacts')
		await user.type(search, 'BOB')
		expect(screen.queryByText('Ada')).not.toBeInTheDocument()
		expect(screen.getByText('Bob')).toBeInTheDocument()
		await user.clear(search)
		await user.type(search, 'zzz')
		expect(screen.getByText('No contacts match your search')).toBeInTheDocument()
	})

	it('edits a contact', async () => {
		const user = userEvent.setup()
		render(<ContactsPage />)
		await addContact(user, 'Ada', 'ada@x.com')
		await user.click(screen.getByRole('button', { name: 'Edit Ada' }))
		const dialog = await screen.findByRole('dialog', { name: 'Edit contact' })
		const name = within(dialog).getByLabelText('Name')
		expect(name).toHaveValue('Ada')
		await user.clear(name)
		await user.type(name, 'Ada L')
		await user.click(within(dialog).getByRole('button', { name: 'Save changes' }))
		expect(await screen.findByText('Ada L')).toBeInTheDocument()
		expect(screen.queryByText('Ada')).not.toBeInTheDocument()
	})

	it('deletes after confirmation and keeps on cancel', async () => {
		const user = userEvent.setup()
		render(<ContactsPage />)
		await addContact(user, 'Ada', 'ada@x.com')

		await user.click(screen.getByRole('button', { name: 'Delete Ada' }))
		let alert = await screen.findByRole('alertdialog')
		await user.click(within(alert).getByRole('button', { name: 'Cancel' }))
		await vi.waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument())
		expect(screen.getByText('Ada')).toBeInTheDocument()

		await user.click(screen.getByRole('button', { name: 'Delete Ada' }))
		alert = await screen.findByRole('alertdialog')
		await user.click(within(alert).getByRole('button', { name: 'Delete' }))
		await vi.waitFor(() => expect(screen.queryByText('Ada')).not.toBeInTheDocument())
		expect(screen.getByText('No contacts yet')).toBeInTheDocument()
	})

	it('persists contacts across remounts', async () => {
		const user = userEvent.setup()
		const { unmount } = render(<ContactsPage />)
		await addContact(user, 'Ada', 'ada@x.com')
		unmount()
		render(<ContactsPage />)
		expect(screen.getByText('Ada')).toBeInTheDocument()
	})
})
