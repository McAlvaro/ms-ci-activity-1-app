import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { Contact } from '../types/contact'

interface DeleteContactDialogProps {
	contact: Contact | null
	onConfirm: (id: string) => void
	onCancel: () => void
}

export function DeleteContactDialog({ contact, onConfirm, onCancel }: DeleteContactDialogProps) {
	return (
		<AlertDialog open={contact !== null} onOpenChange={(open) => !open && onCancel()}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete contact?</AlertDialogTitle>
					<AlertDialogDescription>
						{contact
							? `${contact.name} will be permanently removed. This action cannot be undone.`
							: ''}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={() => contact && onConfirm(contact.id)}>
						Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
