import { z } from 'zod'

export const contactInputSchema = z.object({
	name: z.string().trim().min(1, 'Name is required').max(80, 'Name must be at most 80 characters'),
	email: z.email('Enter a valid email address'),
	phone: z.union([z.literal(''), z.string().regex(/^[+\d\s()-]{6,20}$/, 'Enter a valid phone number')]),
})

export const contactSchema = contactInputSchema.extend({
	id: z.string().min(1),
	createdAt: z.string().min(1),
})

export type Contact = z.infer<typeof contactSchema>
export type ContactInput = Omit<Contact, 'id' | 'createdAt'>
