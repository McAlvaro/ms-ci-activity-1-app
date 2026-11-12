import { useCallback, useEffect, useReducer } from "react";
import { contactsReducer } from "../lib/contacts-reducer";
import {
	createLocalStorageContactsStorage,
	type ContactsStorage,
} from "../lib/contacts-storage";
import type { ContactInput } from "../types/contact";

const defaultStorage = createLocalStorageContactsStorage();

export function useContacts(storage: ContactsStorage = defaultStorage) {
	const [contacts, dispatch] = useReducer(contactsReducer, storage, (s) =>
		s.load(),
	);

	useEffect(() => {
		storage.save(contacts);
	}, [storage, contacts]);

	const addContact = useCallback((input: ContactInput) => {
		dispatch({
			type: "added",
			contact: {
				...input,
				id: crypto.randomUUID(),
				createdAt: new Date().toISOString(),
			},
		});
	}, []);

	const updateContact = useCallback(
		(id: string, input: ContactInput) => {
			const existing = contacts.find((c) => c.id === id);
			if (!existing) return;
			dispatch({ type: "updated", contact: { ...existing, ...input } });
		},
		[contacts],
	);

	const deleteContact = useCallback(
		(id: string) => dispatch({ type: "deleted", id }),
		[],
	);

	return { contacts, addContact, updateContact, deleteContact };
}
