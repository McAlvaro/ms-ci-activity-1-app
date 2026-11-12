import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { Contact, ContactInput } from '../types/contact'
import { ContactForm } from './ContactForm'

interface ContactFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contact?: Contact
  onSubmit: (input: ContactInput) => void
}

export function ContactFormDialog({ open, onOpenChange, contact, onSubmit }: ContactFormDialogProps) {
  const title = contact ? 'Edit contact' : 'Add contact'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {contact ? 'Update the contact details.' : 'Enter the details of the new contact.'}
          </DialogDescription>
        </DialogHeader>
        <ContactForm
          key={contact?.id ?? 'new'}
          defaultValues={contact && { name: contact.name, email: contact.email, phone: contact.phone }}
          submitLabel={contact ? 'Save changes' : 'Add contact'}
          onCancel={() => onOpenChange(false)}
          onSubmit={(input) => {
            onSubmit(input)
            onOpenChange(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
