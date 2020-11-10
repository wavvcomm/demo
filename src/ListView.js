import React from 'react';
import { Link } from 'react-router-dom';
import { Table, Icon, Checkbox } from 'semantic-ui-react';

const TableBody = ({ numberData, removeNumber, textNumber, callNumber, handleSelected, selected }) => {
	const rows = numberData.map(({ contactId, name, address, city, numbers }) => {
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
						<Icon onClick={() => removeNumber({ contactId, number })} name="trash" style={{ cursor: 'pointer' }} />
						<Icon
							onClick={() => textNumber({ contactId, number })}
							name="comment alternate"
							style={{ cursor: 'pointer' }}
						/>
						<Icon onClick={() => callNumber({ contactId, number })} name="phone" style={{ cursor: 'pointer' }} />
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
