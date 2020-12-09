import React, { useContext, useState } from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { Table, Checkbox, Modal, Input, Button, Dropdown, Label, Popup } from 'semantic-ui-react';
import { formatPhone, validPhone } from './utils';
import { store } from './store';
import { SET_SELECTED } from './types';

const MessageCount = ({ count, disabled }) => (
	<Popup
		content="Message Number"
		position="top center"
		trigger={
			<MessageButton>
				<Button size="mini" icon="comment alternate" disabled={disabled} />
				{count ? <Label color="red" size="tiny" circular floating content={count} /> : null}
			</MessageButton>
		}
	/>
);

const ListItem = ({ contact, removeContact, removeNumber, addNumber, textNumber, callNumber }) => {
	const { unreadCounts, skipped, selected, dispatch, stormLoaded } = useContext(store);
	const [newNumber, setNewNumber] = useState('');
	const [newNumberError, setNewNumberError] = useState(false);
	const [open, setOpen] = useState(false);
	const reset = () => {
		setOpen(false);
		setNewNumber('');
	};
	const { contactId, name, address, city, numbers } = contact;
	const isSkipped = skipped.includes(contactId);

	return (
		<Table.Row negative={isSkipped}>
			<Table.Cell collapsing>
				<Checkbox
					checked={selected.includes(contactId)}
					onClick={() => dispatch({ type: SET_SELECTED, payload: contactId })}
				/>
			</Table.Cell>
			<Table.Cell collapsing textAlign="center">
				<Popup
					content="Remove Lead"
					position="bottom center"
					trigger={
						<Button disabled={!stormLoaded} onClick={() => removeContact({ contactId })} icon="trash" size="small" />
					}
				/>
				<Popup
					content="Skip Lead"
					position="bottom center"
					trigger={
						<Button
							disabled={!stormLoaded}
							onClick={() => removeContact({ contactId, skip: true })}
							icon="ban"
							size="small"
						/>
					}
				/>
			</Table.Cell>
			<Table.Cell>
				<Link className="detailsLink" to={`/detail/${contactId}`}>
					{name}
				</Link>
			</Table.Cell>
			<Table.Cell>{address || ''}</Table.Cell>
			<Table.Cell>{city || ''}</Table.Cell>
			<Table.Cell>
				{numbers.map((number) => {
					return (
						<Number key={number}>
							{formatPhone(number)}

							<Popup
								content="Remove Number"
								position="bottom center"
								trigger={
									<Button
										disabled={!stormLoaded}
										icon="close"
										size="mini"
										onClick={() => removeNumber({ contactId, number })}
									/>
								}
							/>
							<Dropdown trigger={<MessageCount disabled={!stormLoaded} count={unreadCounts[number]} />} icon={null}>
								<Dropdown.Menu>
									<Dropdown.Item onClick={() => textNumber({ contact, number, dock: false })}>Modal</Dropdown.Item>
									<Dropdown.Item onClick={() => textNumber({ contact, number, dock: true })}>Dock</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
							<Popup
								content="Call Number"
								position="bottom center"
								trigger={
									<Button
										icon="phone"
										size="mini"
										disabled={!stormLoaded}
										onClick={() => callNumber({ contact, number })}
									/>
								}
							/>
						</Number>
					);
				})}
			</Table.Cell>
			<Table.Cell collapsing textAlign="center">
				<Modal
					onClose={() => setOpen(false)}
					onOpen={() => setOpen(true)}
					open={open}
					trigger={
						<Popup
							content="Add Number"
							position="bottom center"
							trigger={<Button disabled={!stormLoaded} onClick={() => setOpen(true)} icon="plus square" />}
						/>
					}
					size="mini"
				>
					<Modal.Header>Add Number</Modal.Header>
					<Modal.Content>
						<InputContainer>
							<Input
								value={newNumber}
								error={newNumberError}
								onChange={({ target }) => {
									setNewNumber(target.value);
									if (validPhone(target.value)) setNewNumberError(false);
								}}
								placeholder="Number"
							/>
							{newNumberError && (
								<Label basic color="red" pointing>
									Invalid phone number
								</Label>
							)}
						</InputContainer>
					</Modal.Content>
					<Modal.Actions>
						<Button onClick={reset}>Cancel</Button>
						<Button
							onClick={() => {
								if (validPhone(newNumber)) {
									addNumber({ contactId, number: newNumber });
									reset();
								} else {
									setNewNumberError(true);
								}
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

const InputContainer = styled.div({
	display: 'flex',
	flexDirection: 'column',
	width: '60%',
});

export default ListItem;
