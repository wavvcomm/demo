import React from 'react';
import { Table, Icon, Checkbox } from 'semantic-ui-react';

const TableBody = ({ numberData, removeNumber, textNumber, callNumber }) => {
	const rows = numberData.map((row, index) => {
		return (
			<Table.Row key={row.number}>
				<Table.Cell collapsing>
					<Checkbox />
				</Table.Cell>
				<Table.Cell>{row.number}</Table.Cell>
				<Table.Cell>{row.title}</Table.Cell>
				<Table.Cell style={{ display: 'flex', justifyContent: 'space-around' }}>
					<Icon onClick={() => removeNumber(index)} name="trash" style={{ cursor: 'pointer' }} />
					<Icon onClick={() => textNumber(index)} name="comment alternate" style={{ cursor: 'pointer' }} />
					<Icon onClick={() => callNumber(index)} name="phone" style={{ cursor: 'pointer' }} />
				</Table.Cell>
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
					<Table.HeaderCell>Number</Table.HeaderCell>
					<Table.HeaderCell>Name</Table.HeaderCell>
					<Table.HeaderCell>Actions</Table.HeaderCell>
				</Table.Row>
			</Table.Header>
			<TableBody numberData={numberData} removeNumber={removeNumber} textNumber={textNumber} callNumber={callNumber} />
		</Table>
	);
};

export default ListView;
