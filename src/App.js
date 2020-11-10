import React, { useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';
import styled from '@emotion/styled';
import { Container, Button } from 'semantic-ui-react';
import { init, auth } from '@wavv/core';
import { openMessengerThread, openMessenger } from '@wavv/messenger';
import { Route, Switch } from 'react-router-dom';
import { APP_ID, contacts, VENDER_USER_ID, VENDOR_ID } from './constants';
import ListView from './ListView';
import DetailView from './DetailView';

const App = () => {
	const [numbers, setNumbers] = useState(contacts);

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
	const callNumber = (index) => {
		// add Wavv calling functionality
		console.log(index);
	};
	const openWavvMessenger = () => {
		openMessenger();
	};

	return (
		<div>
			<Nav>
				<div>WAVV Demo</div>
				<NavItem>
					<Button primary size="mini" content="Open Messenger" onClick={openWavvMessenger} />
				</NavItem>
			</Nav>
			<Container>
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
	marginBottom: 20,
});

const NavItem = styled.div({
	display: 'flex',
	alignItems: 'center',
	height: 50,
	fontSize: 20,
	paddingLeft: 22,
});

export default App;
