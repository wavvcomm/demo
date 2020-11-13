import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { Table, Checkbox, Modal, Input, Button, Dropdown, Label } from 'semantic-ui-react';
import { formatPhone } from './utils';

const MessageCount = ({ count }) => (
	<MessageButton>
		<Button size="mini" icon="comment alternate" />
		{count ? <Label color="red" size="tiny" circular floating content={count} /> : null}
	</MessageButton>
);

const ListItem = ({
	contact,
	unreadCounts,
	removeContact,
	removeNumber,
	addNumber,
	textNumber,
	callNumber,
	handleSelected,
	selected,
}) => {
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
				<Checkbox checked={selected.includes(contactId)} onClick={() => handleSelected(contactId)} />
			</Table.Cell>
			<Table.Cell collapsing textAlign="center">
				<Button onClick={() => removeContact({ contactId })} icon="trash" size="small" />
				<Button onClick={() => removeContact({ contactId, skip: true })} icon="close" size="small" />
			</Table.Cell>
			<Table.Cell>
				<Link className="detailsLink" to={`/detail/${contactId}`}>
					{name}
				</Link>
			</Table.Cell>
			<Table.Cell>{address}</Table.Cell>
			<Table.Cell>{city}</Table.Cell>
			<Table.Cell>
				{numbers.map((number) => (
					<Number key={number}>
						<span className="leadPhoneNumber">{formatPhone(number)}</span>
						<Button icon="close" size="mini" onClick={() => removeNumber({ contactId, number })} />
						<Dropdown trigger={<MessageCount count={unreadCounts[number]} />} icon={null}>
							<Dropdown.Menu>
								<Dropdown.Item onClick={() => textNumber({ contact, number, dock: false })}>Modal</Dropdown.Item>
								<Dropdown.Item onClick={() => textNumber({ contact, number, dock: true })}>Dock</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
						<Button icon="phone" size="mini" onClick={() => callNumber({ contactId, number })} />
					</Number>
				))}
			</Table.Cell>
			<Table.Cell collapsing textAlign="center">
				<Modal
					onClose={() => setOpen(false)}
					onOpen={() => setOpen(true)}
					open={open}
					trigger={<Button icon="plus square" />}
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
	alignItems: 'center',
	margin: '10px 0',
});

const MessageButton = styled.div({
	position: 'relative',
	zIndex: 0,
});

export default ListItem;
