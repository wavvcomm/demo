/* eslint-disable */
import React, { useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';
import styled from '@emotion/styled';
import { init, auth } from '@wavv/core';
import { startCampaign, callPhone } from '@wavv/dialer';
import { openMessengerThread, openMessenger } from '@wavv/messenger';
import { Container, Button } from 'semantic-ui-react';
import { Route, Switch } from 'react-router-dom';
import { APP_ID, contacts, VENDER_USER_ID, VENDOR_ID } from './constants';
import ListView from './ListView';
import DetailView from './DetailView';

const App = () => {
	const [numbers, setNumbers] = useState(contacts);
	const [selected, setSelected] = useState([]);

	const authWavv = async () => {
		const issuer = VENDOR_ID;
		const signature = APP_ID;
		const userId = VENDER_USER_ID;
		const payload = { userId };
		const token = jwt.sign(payload, signature, { issuer, expiresIn: 3600 });

		try {
			await init({ server: 'stage1' });
			await auth({ token });
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		authWavv();
	}, []);

	const removeNumber = (index) => {
		const newNumbers = numbers.filter((number, i) => {
			return i !== index;
		});
		setNumbers(newNumbers);
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
		const filteredContacts = numbers.filter((number) => selected.includes(number.contactId));
		try {
			startCampaign({ contacts: filteredContacts });
		} catch (error) {
			console.error(error);
		}
	};

	const handleSelected = (param) => {
		let newSelected = [...selected];
		if (param === 'all') {
			if (newSelected.length === numbers.length) newSelected = [];
			else newSelected = numbers.map((number) => number.contactId);
		} else {
			if (newSelected.includes(param)) newSelected = newSelected.filter((selected) => selected !== param);
			else newSelected.push(param);
		}
		setSelected(newSelected);
	};
	const openWavvMessenger = () => {
		openMessenger();
	};

	return (
		<div>
			<Nav>
				WAVV Demo
				<NavItems>
					<Button content="Open Messenger" onClick={openWavvMessenger} />
					<Button primary disabled={!selected.length} onClick={handleStart} content="Start Campaign" />
				</NavItems>
			</Nav>
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
								numberData={numbers}
								removeNumber={removeNumber}
								textNumber={textNumber}
								callNumber={callNumber}
								handleSelected={handleSelected}
								selected={selected}
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
	justifyContent: 'space-between',
	width: '100%',
	height: 50,
	backgroundColor: '#EAEAEA',
	fontSize: 30,
	padding: 20,
});

const NavItems = styled.div({
	display: 'flex',
	alignItems: 'center',
});

export default App;
