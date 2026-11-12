import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ContactForm } from './ContactForm'

describe('ContactForm', () => {
  it('shows validation errors and does not submit on empty submit', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<ContactForm onSubmit={onSubmit} onCancel={vi.fn()} submitLabel="Save" />)
    await user.click(screen.getByRole('button', { name: 'Save' }))
    expect(await screen.findByText('Name is required')).toBeInTheDocument()
    expect(screen.getByLabelText('Name')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText('Name')).toHaveAccessibleDescription('Name is required')
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits trimmed values', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<ContactForm onSubmit={onSubmit} onCancel={vi.fn()} submitLabel="Save" />)
    await user.type(screen.getByLabelText('Name'), '  Ada Lovelace  ')
    await user.type(screen.getByLabelText('Email'), 'ada@example.com')
    await user.type(screen.getByLabelText('Phone'), '+34 600 123 456')
    await user.click(screen.getByRole('button', { name: 'Save' }))
    await vi.waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        phone: '+34 600 123 456',
      }),
    )
  })

  it('prefills default values', () => {
    render(
      <ContactForm
        defaultValues={{ name: 'Bob', email: 'bob@x.com', phone: '123456' }}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
        submitLabel="Save"
      />,
    )
    expect(screen.getByLabelText('Name')).toHaveValue('Bob')
    expect(screen.getByLabelText('Email')).toHaveValue('bob@x.com')
    expect(screen.getByLabelText('Phone')).toHaveValue('123456')
  })

  it('calls onCancel', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    render(<ContactForm onSubmit={vi.fn()} onCancel={onCancel} submitLabel="Save" />)
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onCancel).toHaveBeenCalled()
  })
})
