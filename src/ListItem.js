import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { Table, Icon, Checkbox, Modal, Input, Button } from 'semantic-ui-react';

const ListItem = ({ contact, removeContact, removeNumber, addNumber, textNumber, callNumber }) => {
	const [newNumber, setNewNumber] = useState('');
	const [open, setOpen] = useState(false);
	const reset = () => {
		setOpen(false);
		setNewNumber('');
	};
	const { contactId, name, address, city, numbers } = contact;
	return (
		<Table.Row key={contactId}>
			<Table.Cell collapsing>
				<Checkbox />
			</Table.Cell>
			<Table.Cell collapsing>
				<Icon onClick={() => removeContact({ contactId })} name="trash" style={{ cursor: 'pointer' }} />
				<Icon name="close" style={{ cursor: 'pointer' }} />
			</Table.Cell>
			<Table.Cell>
				<Link to={`/detail/${contactId}`}>{name}</Link>
			</Table.Cell>
			<Table.Cell>{address}</Table.Cell>
			<Table.Cell>{city}</Table.Cell>
			<Table.Cell>
				{numbers.map((number) => (
					<Number key={number}>
						<span>{number}</span>
						<Icon onClick={() => removeNumber({ contactId, number })} name="close" style={{ cursor: 'pointer' }} />
						<Icon
							onClick={() => textNumber({ contactId, number })}
							name="comment alternate"
							style={{ cursor: 'pointer' }}
						/>
						<Icon onClick={() => callNumber({ contactId, number })} name="phone" style={{ cursor: 'pointer' }} />
					</Number>
				))}
			</Table.Cell>
			<Table.Cell collapsing>
				<Modal
					onClose={() => setOpen(false)}
					onOpen={() => setOpen(true)}
					open={open}
					trigger={<Icon name="plus square" style={{ cursor: 'pointer' }} />}
					size="mini"
				>
					<Modal.Header>Add Number</Modal.Header>
					<Modal.Content>
						<Input value={newNumber} onChange={({ target }) => setNewNumber(target.value)} placeholder="Number" />
					</Modal.Content>
					<Modal.Actions>
						<Button onClick={reset}>Cancel</Button>
						<Button
							onClick={() => {
								addNumber({ contactId, number: newNumber });
								reset();
							}}
							positive
						>
							Add
						</Button>
					</Modal.Actions>
				</Modal>
			</Table.Cell>
		</Table.Row>
	);
};

const Number = styled.div({
	display: 'flex',
	justifyContent: 'space-around',
	margin: '5px 0',
});

export default ListItem;
