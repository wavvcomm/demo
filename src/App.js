import React, { useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';
import styled from '@emotion/styled';
import { Container } from 'semantic-ui-react';
import { init, auth } from '@wavv/core';
import { openMessenger } from '@wavv/messenger';
import { callPhone, addPhone, removePhone, removeContact } from '@wavv/dialer';
import { Route, Switch } from 'react-router-dom';
import { APP_ID, contacts, VENDER_USER_ID, VENDOR_ID } from './constants';
import ListView from './ListView';
import DetailView from './DetailView';

const App = () => {
	const [contactList, setContacts] = useState(contacts);

	const authWavv = async () => {
		const issuer = VENDOR_ID;
		const signature = APP_ID;
		const userId = VENDER_USER_ID;
		const payload = { userId };
		const token = jwt.sign(payload, signature, { issuer, expiresIn: 3600 });

		try {
			init({ server: 'stage1' });
			auth({ token });
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

	const deleteContact = ({ contactId }) => {
		const updatedContacts = contactList.filter((contact) => contact.contactId !== contactId);
		setContacts(updatedContacts);
		removeContact({ contactId, hangup: true, resume: true });
	};

	const textNumber = (index) => {
		// add Wavv messaging functionality
		const params = {
			contactView: true,
			contact: {
				contactId: '123',
				numbers: ['8444545111', '5555554321'],
				name: 'George Costanza',
				address: '2880 Broadway',
				city: 'New York',
				avatarUrl: 'https://www.example.com/image.jpg',
				subheading: 'Vandelay Industries',
			},
		};

		openMessenger(params);
		console.log(index);
	};
	const callNumber = (ops) => {
		// add Wavv calling functionality
		callPhone(ops);
		console.log(ops);
	};

	return (
		<div>
			<Nav>WAVV Demo</Nav>
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
							/>
						)}
					/>
					<Route exact path="/detail/:id" component={DetailView} />
				</Switch>
			</Container>
		</div>
	);
};

const Nav = styled.div({
	display: 'flex',
	alignItems: 'center',
	width: '100%',
	height: 50,
	backgroundColor: '#EAEAEA',
	fontSize: 30,
	padding: 20,
});

export default App;
