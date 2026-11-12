import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { contactInputSchema, type ContactInput } from '../types/contact'

interface ContactFormProps {
	defaultValues?: ContactInput
	onSubmit: (input: ContactInput) => void
	onCancel: () => void
	submitLabel: string
}

const emptyValues: ContactInput = { name: '', email: '', phone: '' }

export function ContactForm({ defaultValues, onSubmit, onCancel, submitLabel }: ContactFormProps) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ContactInput>({
		resolver: zodResolver(contactInputSchema),
		defaultValues: defaultValues ?? emptyValues,
	})

	return (
		<form onSubmit={handleSubmit((values) => onSubmit(values))} noValidate className="flex flex-col gap-4">
			<div className="flex flex-col gap-2">
				<Label htmlFor="contact-name">Name</Label>
				<Input
					id="contact-name"
					autoComplete="off"
					aria-invalid={errors.name ? true : undefined}
					aria-describedby={errors.name ? 'contact-name-error' : undefined}
					{...register('name')}
				/>
				{errors.name && (
					<p id="contact-name-error" className="text-sm text-destructive">
						{errors.name.message}
					</p>
				)}
			</div>
			<div className="flex flex-col gap-2">
				<Label htmlFor="contact-email">Email</Label>
				<Input
					id="contact-email"
					type="email"
					autoComplete="off"
					aria-invalid={errors.email ? true : undefined}
					aria-describedby={errors.email ? 'contact-email-error' : undefined}
					{...register('email')}
				/>
				{errors.email && (
					<p id="contact-email-error" className="text-sm text-destructive">
						{errors.email.message}
					</p>
				)}
			</div>
			<div className="flex flex-col gap-2">
				<Label htmlFor="contact-phone">Phone</Label>
				<Input
					id="contact-phone"
					type="tel"
					autoComplete="off"
					aria-invalid={errors.phone ? true : undefined}
					aria-describedby={errors.phone ? 'contact-phone-error' : undefined}
					{...register('phone')}
				/>
				{errors.phone && (
					<p id="contact-phone-error" className="text-sm text-destructive">
						{errors.phone.message}
					</p>
				)}
			</div>
			<div className="flex justify-end gap-2">
				<Button type="button" variant="outline" onClick={onCancel}>
					Cancel
				</Button>
				<Button type="submit">{submitLabel}</Button>
			</div>
		</form>
	)
}
