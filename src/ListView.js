import React from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, Table, Icon, Checkbox } from 'semantic-ui-react';

const TableBody = ({ numberData, removeNumber, textNumber, callNumber, handleSelected, selected }) => {
	const rows = numberData.map((contact) => {
		const { contactId, name, address, city, numbers } = contact;
		return (
			<Table.Row key={contactId}>
				<Table.Cell collapsing>
					<Checkbox checked={selected.includes(contactId)} onClick={() => handleSelected(contactId)} />
				</Table.Cell>
				<Table.Cell>
					<Link to={`/detail/${contactId}`}>{name}</Link>
				</Table.Cell>
				<Table.Cell>{address}</Table.Cell>
				<Table.Cell>{city}</Table.Cell>
				{numbers.map((number) => (
					<Table.Cell key={number} style={{ display: 'flex', justifyContent: 'space-around' }}>
						<span>{number}</span>
						<Icon onClick={() => removeNumber({ contact, number })} name="trash" style={{ cursor: 'pointer' }} />
						<Dropdown icon="comment alternate" className="icon">
							<Dropdown.Menu>
								<Dropdown.Item onClick={() => textNumber({ contact, number, dock: false })}>Modal</Dropdown.Item>
								<Dropdown.Item onClick={() => textNumber({ contact, number, dock: true })}>Dock</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
						<Icon onClick={() => callNumber({ contact, number })} name="phone" style={{ cursor: 'pointer' }} />
					</Table.Cell>
				))}
			</Table.Row>
		);
	});

	return <Table.Body>{rows}</Table.Body>;
};

const ListView = ({ numberData, removeNumber, textNumber, callNumber, handleSelected, selected }) => {
	return (
		<Table celled>
			<Table.Header>
				<Table.Row>
					<Table.HeaderCell>
						<Checkbox onClick={() => handleSelected('all')} />
					</Table.HeaderCell>
					<Table.HeaderCell>Name</Table.HeaderCell>
					<Table.HeaderCell>Address</Table.HeaderCell>
					<Table.HeaderCell>City</Table.HeaderCell>
					<Table.HeaderCell>Numbers</Table.HeaderCell>
				</Table.Row>
			</Table.Header>
			<TableBody
				numberData={numberData}
				removeNumber={removeNumber}
				textNumber={textNumber}
				callNumber={callNumber}
				handleSelected={handleSelected}
				selected={selected}
			/>
		</Table>
	);
};

export default ListView;
