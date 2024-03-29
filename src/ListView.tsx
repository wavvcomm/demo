import React, { useContext, useState } from 'react';
import { Table, Checkbox, Button, Input } from 'semantic-ui-react';
import { v4 as uuid } from 'uuid';
import ListItem from './ListItem';
import { store } from './store';
import { SET_SELECTED } from './actionTypes';
import { validPhone } from './utils';
import {
	Contact,
	RemoveContact,
	AddRemoveNumber,
	TextNumber,
	CallNumber,
	AddContact,
	StartRingless,
} from './paramTypes';

type CONTACT_TO_ADD = {
	[key: string]: string;
};

const ListView = ({
	removeContact,
	removeNumber,
	addNumber,
	textNumber,
	callNumber,
	startRingless,
	addContact,
	setMessageReceivedToast,
}: {
	removeContact: RemoveContact;
	removeNumber: AddRemoveNumber;
	addNumber: AddRemoveNumber;
	textNumber: TextNumber;
	callNumber: CallNumber;
	startRingless: StartRingless;
	addContact: AddContact;
	setMessageReceivedToast: (arg0: { message: string; error: boolean }) => void;
}) => {
	const { contactList, dispatch, selected } = useContext(store);
	const [contactToAdd, setContact] = useState<CONTACT_TO_ADD>({});

	const handler = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newContact = { ...contactToAdd };
		newContact[event.target.name] = event.target.value;
		setContact(newContact);
	};

	return (
		<>
			<Table celled>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell>
							<Checkbox
								checked={selected.length === contactList.length}
								onClick={() => dispatch({ type: SET_SELECTED, payload: 'all' })}
							/>
						</Table.HeaderCell>
						<Table.HeaderCell>Remove/Skip</Table.HeaderCell>
						<Table.HeaderCell>Name</Table.HeaderCell>
						<Table.HeaderCell>Address</Table.HeaderCell>
						<Table.HeaderCell>City</Table.HeaderCell>
						<Table.HeaderCell>Numbers</Table.HeaderCell>
						<Table.HeaderCell>Add Number</Table.HeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{contactList.map((contact: Contact) => (
						<ListItem
							key={contact.contactId}
							contact={contact}
							removeContact={removeContact}
							removeNumber={removeNumber}
							addNumber={addNumber}
							textNumber={textNumber}
							callNumber={callNumber}
							startRingless={startRingless}
						/>
					))}
				</Table.Body>
				<Table.Footer fullWidth>
					<Table.Row>
						<Table.HeaderCell />
						<Table.HeaderCell />
						<Table.HeaderCell>
							<Input placeholder="Name" value={contactToAdd?.name || ''} onChange={handler} name="name" />
						</Table.HeaderCell>
						<Table.HeaderCell>
							<Input
								placeholder="Address"
								value={contactToAdd?.address || ''}
								onChange={handler}
								name="address"
							/>
						</Table.HeaderCell>
						<Table.HeaderCell>
							<Input placeholder="City" value={contactToAdd?.city || ''} onChange={handler} name="city" />
						</Table.HeaderCell>
						<Table.HeaderCell>
							<Input
								placeholder="Number"
								value={contactToAdd?.number || ''}
								onChange={handler}
								name="number"
							/>
						</Table.HeaderCell>
						<Table.HeaderCell>
							<Button
								disabled={!contactToAdd?.name || !contactToAdd?.number}
								primary
								size="small"
								onClick={() => {
									const { name, address, city, number } = contactToAdd;
									if (validPhone(number)) {
										setContact({});
										addContact({
											contactId: uuid(),
											name,
											address,
											city,
											numbers: [number],
										});
									} else {
										setMessageReceivedToast({
											message: 'Must provide a valid phone number',
											error: true,
										});
									}
								}}
							>
								Add
							</Button>
						</Table.HeaderCell>
					</Table.Row>
				</Table.Footer>
			</Table>
		</>
	);
};

export default ListView;
