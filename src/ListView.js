import React from 'react';
import { Link } from 'react-router-dom';
import { Table, Icon, Checkbox } from 'semantic-ui-react';

const TableBody = ({ numberData, removeNumber, textNumber, callNumber }) => {
	const rows = numberData.map((contact) => {
		return (
			<Table.Row key={contact.contactId}>
				<Table.Cell collapsing>
					<Checkbox />
				</Table.Cell>
				<Table.Cell>
					<Link to={`/detail/${contact.contactId}`}>{contact.name}</Link>
				</Table.Cell>
				<Table.Cell>{contact.address}</Table.Cell>
				<Table.Cell>{contact.city}</Table.Cell>
				{contact.numbers.map((number) => (
					<Table.Cell key={number} style={{ display: 'flex', justifyContent: 'space-around' }}>
						<span>{number}</span>
						<Icon onClick={() => removeNumber({ contact, number })} name="trash" style={{ cursor: 'pointer' }} />
						<Icon
							onClick={() => textNumber({ contact, number })}
							name="comment alternate"
							style={{ cursor: 'pointer' }}
						/>
						<Icon onClick={() => callNumber({ contact, number })} name="phone" style={{ cursor: 'pointer' }} />
					</Table.Cell>
				))}
			</Table.Row>
		);
	});

	return <Table.Body>{rows}</Table.Body>;
};

const ListView = ({ numberData, removeNumber, textNumber, callNumber }) => {
	return (
		<Table celled>
			<Table.Header>
				<Table.Row>
					<Table.HeaderCell>
						<Checkbox />
					</Table.HeaderCell>
					<Table.HeaderCell>Name</Table.HeaderCell>
					<Table.HeaderCell>Address</Table.HeaderCell>
					<Table.HeaderCell>City</Table.HeaderCell>
					<Table.HeaderCell>Numbers</Table.HeaderCell>
				</Table.Row>
			</Table.Header>
			<TableBody numberData={numberData} removeNumber={removeNumber} textNumber={textNumber} callNumber={callNumber} />
		</Table>
	);
};

export default ListView;
