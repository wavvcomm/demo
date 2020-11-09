import React, { useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';
import styled from '@emotion/styled';
import { Container } from 'semantic-ui-react';
import { init, auth } from '@wavv/core';
import { openMessenger } from '@wavv/messenger';
import { APP_ID, contacts, VENDER_USER_ID, VENDOR_ID } from './constants';
import ListView from './ListView';

const App = () => {
	const [numbers, setNumbers] = useState(contacts);

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

	const removeNumber = (index) => {
		const newNumbers = numbers.filter((number, i) => {
			return i !== index;
		});
		setNumbers(newNumbers);
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
	const callNumber = (index) => {
		// add Wavv calling functionality
		console.log(index);
	};

	return (
		<div>
			<Nav>WAVV Demo</Nav>
			<Container>
				<ListView numberData={numbers} removeNumber={removeNumber} textNumber={textNumber} callNumber={callNumber} />
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

export default App;
