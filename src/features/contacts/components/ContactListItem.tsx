import { PencilIcon, Trash2Icon } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Contact } from '../types/contact'

interface ContactListItemProps {
	contact: Contact
	onEdit: (contact: Contact) => void
	onDelete: (contact: Contact) => void
}

function getInitials(name: string): string {
	const parts = name.trim().split(/\s+/).filter(Boolean)
	const letters = parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : (parts[0] ?? '?').slice(0, 2)
	return letters.toUpperCase()
}

export function ContactListItem({ contact, onEdit, onDelete }: ContactListItemProps) {
	return (
		<li>
			<Card>
				<CardContent className="flex items-center gap-4">
					<Avatar>
						<AvatarFallback aria-hidden="true">{getInitials(contact.name)}</AvatarFallback>
					</Avatar>
					<div className="min-w-0 flex-1">
						<p className="truncate font-medium">{contact.name}</p>
						<p className="truncate text-sm text-muted-foreground">{contact.email}</p>
						{contact.phone && <p className="truncate text-sm text-muted-foreground">{contact.phone}</p>}
					</div>
					<div className="flex gap-1">
						<Button variant="ghost" size="icon" aria-label={`Edit ${contact.name}`} onClick={() => onEdit(contact)}>
							<PencilIcon aria-hidden="true" />
						</Button>
						<Button variant="ghost" size="icon" aria-label={`Delete ${contact.name}`} onClick={() => onDelete(contact)}>
							<Trash2Icon aria-hidden="true" />
						</Button>
					</div>
				</CardContent>
			</Card>
		</li>
	)
}
