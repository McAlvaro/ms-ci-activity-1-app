interface EmptyStateProps {
	hasQuery: boolean
}

export function EmptyState({ hasQuery }: EmptyStateProps) {
	return (
		<div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
			<p className="font-medium text-foreground">
				{hasQuery ? 'No contacts match your search' : 'No contacts yet'}
			</p>
			<p className="text-sm">
				{hasQuery ? 'Try a different name, email or phone.' : 'Add your first contact to get started.'}
			</p>
		</div>
	)
}
