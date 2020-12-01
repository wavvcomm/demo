import React, { useContext, useState } from 'react';
import { Table, Checkbox, Button, Input } from 'semantic-ui-react';
import { v4 as uuid } from 'uuid';
import ListItem from './ListItem';
import Toast from './Toast';
import { store } from './store';
import { SET_SELECTED } from './types';

const ListView = ({ removeContact, removeNumber, addNumber, textNumber, callNumber, addContact }) => {
	const { contactList, dispatch } = useContext(store);
	const [contactToAdd, setContact] = useState({});
	const [messageReceivedToast, setMessageReceivedToast] = useState({});

	const handler = (event) => {
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
							<Checkbox onClick={() => dispatch({ type: SET_SELECTED, payload: 'all' })} />
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
					{contactList.map((contact) => (
						<ListItem
							key={contact.contactId}
							contact={contact}
							removeContact={removeContact}
							removeNumber={removeNumber}
							addNumber={addNumber}
							textNumber={textNumber}
							callNumber={callNumber}
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
							<Input placeholder="Address" value={contactToAdd?.address || ''} onChange={handler} name="address" />
						</Table.HeaderCell>
						<Table.HeaderCell>
							<Input placeholder="City" value={contactToAdd?.city || ''} onChange={handler} name="city" />
						</Table.HeaderCell>
						<Table.HeaderCell>
							<Input placeholder="Number" value={contactToAdd?.number || ''} onChange={handler} name="number" />
						</Table.HeaderCell>
						<Table.HeaderCell>
							<Button
								primary
								size="small"
								onClick={() => {
									const { name, address, city, number } = contactToAdd;
									if (name && number) {
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
											message: 'Must include a Name and Number to add a contact',
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
			<Toast {...messageReceivedToast} onHide={() => setMessageReceivedToast({})} delay={3000} />
		</>
	);
};

export default ListView;
