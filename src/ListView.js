import React from 'react';
import { Table, Checkbox } from 'semantic-ui-react';
import ListItem from './ListItem';

const ListView = ({ contacts, removeContact, removeNumber, addNumber, textNumber, callNumber }) => {
	return (
		<Table celled>
			<Table.Header>
				<Table.Row>
					<Table.HeaderCell>
						<Checkbox />
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
				{contacts.map((contact) => (
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
		</Table>
	);
};

export default ListView;
