import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ContactFormDialog } from './ContactFormDialog'

describe('ContactFormDialog', () => {
	it('renders add mode', () => {
		render(<ContactFormDialog open onOpenChange={vi.fn()} onSubmit={vi.fn()} />)
		expect(screen.getByRole('dialog', { name: 'Add contact' })).toBeInTheDocument()
		expect(screen.getByLabelText('Name')).toHaveValue('')
	})

	it('renders edit mode prefilled', () => {
		render(
			<ContactFormDialog
				open
				onOpenChange={vi.fn()}
				contact={{ id: '1', name: 'Bob', email: 'bob@x.com', phone: '', createdAt: 'x' }}
				onSubmit={vi.fn()}
			/>,
		)
		expect(screen.getByRole('dialog', { name: 'Edit contact' })).toBeInTheDocument()
		expect(screen.getByLabelText('Name')).toHaveValue('Bob')
	})

	it('submits and closes', async () => {
		const user = userEvent.setup()
		const onSubmit = vi.fn()
		const onOpenChange = vi.fn()
		render(<ContactFormDialog open onOpenChange={onOpenChange} onSubmit={onSubmit} />)
		await user.type(screen.getByLabelText('Name'), 'Ada')
		await user.type(screen.getByLabelText('Email'), 'ada@x.com')
		await user.click(screen.getByRole('button', { name: 'Add contact' }))
		await vi.waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ name: 'Ada', email: 'ada@x.com', phone: '' }))
		expect(onOpenChange).toHaveBeenCalledWith(false)
	})
})
