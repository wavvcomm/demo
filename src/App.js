import React, { useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';
import { Container, Button, Modal, Input } from 'semantic-ui-react';
import { Route, Switch } from 'react-router-dom';
import { APP_ID, contacts, VENDER_USER_ID, VENDOR_ID } from './constants';
import ListView from './ListView';
import DetailView from './DetailView';
import Nav from './Nav';

const App = () => {
	const [contactList, setContacts] = useState(contacts);
	const [selected, setSelected] = useState([]);
	const [dncAction, setDncAction] = useState('');
	const [dncNumber, setDncNumber] = useState('');
	const {
		auth,
		removePhone,
		addPhone,
		callPhone,
		removeContact,
		openMessengerThread,
		startCampaign,
		addDncNumber,
		removeDncNumber,
	} = window.Storm;

	const authWavv = async () => {
		const issuer = VENDOR_ID;
		const signature = APP_ID;
		const userId = VENDER_USER_ID;
		const payload = { userId };
		const token = jwt.sign(payload, signature, { issuer, expiresIn: 3600 });
		try {
			await auth({ token });
			// registerCallbacks();
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		authWavv();
	}, []);

	const removeNumber = ({ contactId, number }) => {
		const updatedContacts = contactList.map((contact) => {
			if (contact.contactId === contactId) {
				const filteredNumbers = contact.numbers.filter((num) => num !== number);
				return { ...contact, numbers: filteredNumbers };
			}
			return contact;
		});
		setContacts(updatedContacts);
		removePhone({ contactId, number });
	};

	const addNumber = ({ contactId, number }) => {
		const updatedContacts = contactList.map((contact) => {
			if (contact.contactId === contactId) {
				const newNumbers = [...contact.numbers, number];
				return { ...contact, numbers: newNumbers };
			}
			return contact;
		});
		setContacts(updatedContacts);
		addPhone({ contactId, number });
	};

	const deleteContact = ({ contactId, skip = false }) => {
		if (!skip) {
			const updatedContacts = contactList.filter((contact) => contact.contactId !== contactId);
			setContacts(updatedContacts);
		}
		removeContact({ contactId, hangup: skip, resume: skip });
	};

	const textNumber = (params) => {
		console.log(params);
		openMessengerThread(params);
	};

	const callNumber = (ops) => {
		// add Wavv calling functionality
		callPhone(ops);
		console.log(ops);
	};

	const handleStart = async () => {
		const filteredContacts = contactList.filter((contact) => selected.includes(contact.contactId));
		try {
			startCampaign({ contacts: filteredContacts });
		} catch (error) {
			console.error(error);
		}
	};

	const handleSelected = (param) => {
		let newSelected = [...selected];
		if (param === 'all') {
			if (newSelected.length === contactList.length) newSelected = [];
			else newSelected = contactList.map((contact) => contact.contactId);
		} else if (newSelected.includes(param)) {
			newSelected = newSelected.filter((item) => item !== param);
		} else {
			newSelected.push(param);
		}

		setSelected(newSelected);
	};

	const reset = () => {
		setDncAction('');
		setDncNumber('');
	};

	return (
		<div>
			<Nav disableStart={!selected.length} startCampaign={handleStart} setDncAction={setDncAction} />
			<div id="storm-dialer-bar" />
			<div id="storm-dialer-mini" />
			<Container style={{ marginTop: 20 }}>
				<Switch>
					<Route
						exact
						path="/"
						render={(props) => (
							<ListView
								{...props}
								contacts={contactList}
								removeContact={deleteContact}
								removeNumber={removeNumber}
								addNumber={addNumber}
								textNumber={textNumber}
								callNumber={callNumber}
								handleSelected={handleSelected}
								selected={selected}
							/>
						)}
					/>
					<Route exact path="/detail/:id" component={DetailView} />
				</Switch>
				<Modal onClose={() => setDncAction('')} open={!!dncAction} size="mini">
					<Modal.Header>{`DNC List: ${dncAction} Number`}</Modal.Header>
					<Modal.Content>
						<Input value={dncNumber} onChange={({ target }) => setDncNumber(target.value)} placeholder="Number" />
					</Modal.Content>
					<Modal.Actions>
						<Button
							onClick={() => {
								setDncAction('');
							}}
						>
							Cancel
						</Button>
						<Button
							onClick={() => {
								if (dncAction === 'Remove') {
									removeDncNumber({ number: dncNumber });
								} else addDncNumber({ number: dncNumber });
								reset();
							}}
							positive
						>
							{dncAction}
						</Button>
					</Modal.Actions>
				</Modal>
			</Container>
		</div>
	);
};

export default App;
