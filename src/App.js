/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import styled from '@emotion/styled';
import { Route, Switch, useHistory } from 'react-router-dom';
import { API_KEY, VENDOR_USER_ID, VENDOR_ID, SERVER_URL } from './constants';
import ListView from './ListView';
import DetailView from './DetailView';
import Nav from './Nav';
import Toast from './Toast';
import { rawPhone } from './utils';
import DebugDrawer from './DebugDrawer';
import { store } from './store';
import {
	ADD_NUMBER,
	ADD_OUTCOME,
	ADD_RECORDING,
	REMOVE_CONTACT,
	REMOVE_NUMBER,
	SET_ENABLE_CLICK_TO_CALL,
	SET_NUMBER_DIALING,
	SET_STORM_LOADED,
	SET_UNREAD_COUNTS,
	SET_UNREAD_MESSAGES,
	SET_DNC_LIST,
} from './types';

const App = () => {
	const { stormLoaded, contactList, selected, showDrawer, recordings, outcomes, dispatch } = useContext(store);
	const [messageReceivedToast, setMessageReceivedToast] = useState({});
	const history = useHistory();

	const loadSnippet = () =>
		new Promise((resolve, reject) => {
			const script = document.createElement('script');
			script.src = `${SERVER_URL}/storm.js`;
			script.onload = () => resolve();
			script.onerror = (err) => reject(err);
			document.body.appendChild(script);
		});

	const authWavv = async () => {
		const issuer = VENDOR_ID;
		const signature = API_KEY;
		const userId = VENDOR_USER_ID;
		const payload = { userId };
		const token = jwt.sign(payload, signature, { issuer, expiresIn: 3600 });
		await loadSnippet();
		dispatch({ type: SET_STORM_LOADED, payload: true });
		window.Storm.auth({ token });
	};

	const getDncList = () => {
		axios
			.get(`${SERVER_URL}/api/customers/${VENDOR_USER_ID}/dnc`, {
				auth: {
					username: VENDOR_ID,
					password: API_KEY,
				},
			})
			.then(({ data }) => {
				const numbers = data.map((obj) => rawPhone(obj.number));
				dispatch({ type: SET_DNC_LIST, payload: numbers });
			});
	};

	useEffect(() => {
		authWavv();
		getDncList();
	}, []);

	const getContactById = (id) => contactList.find((contact) => contact.contactId === id);

	const getContactByPhone = (number) =>
		contactList.find((contact) => {
			const rawNumbers = contact.numbers.map((num) => rawPhone(num));
			return rawNumbers.includes(rawPhone(number));
		});

	const getContactsBySearchTerms = (search) => {
		const formattedSearch = search.toLowerCase();

		const results = contactList.filter((contact) => {
			const numbersString = contact.numbers.join(' ');
			return contact.name.includes(formattedSearch) || numbersString.includes(formattedSearch);
		});

		return results;
	};

	useEffect(() => {
		if (stormLoaded) {
			const params = {
				fields: [
					{ id: 'first_name', label: 'First Name' },
					{ id: 'last_name', label: 'Last Name' },
					{ id: 'email', label: 'Email' },
				],
			};

			window.Storm.setMergeFields(params);

			window.Storm.onContactLink((contact) => {
				const { contactId, name } = contact;
				const id = contactId || getContactByPhone(name).contactId;
				if (id) history.push(`/detail/${id}`);
			});

			window.Storm.onContactSearch(({ search, contacts: returnedContacts, callback }) => {
				if (search) {
					const results = getContactsBySearchTerms(search);
					callback(results);
				} else {
					const results = returnedContacts.map((contact) => {
						const { id, number } = contact;
						return id ? getContactById(id) : getContactByPhone(number);
					});
					callback(results);
				}
			});

			window.Storm.onUnreadCount(({ unreadCount, numberCounts }) => {
				dispatch({ type: SET_UNREAD_MESSAGES, payload: unreadCount });
				dispatch({ type: SET_UNREAD_COUNTS, payload: numberCounts });
			});

			window.Storm.onMessageReceived(({ number, body }) => {
				const contact = getContactByPhone(number);
				const header = `New Message from ${contact.name || number}`;
				const toast = { header, message: body };
				setMessageReceivedToast(toast);
			});

			window.Storm.onLinesChanged(({ lines }) => {
				lines.forEach((call) => {
					if (call.focused) {
						if (call.contactId) history.push(`/detail/${call.contactId}`);
					}
				});
			});

			window.Storm.onCallStarted(({ number }) => {
				dispatch({ type: SET_NUMBER_DIALING, payload: number });
			});

			window.Storm.onCampaignEnded(() => {
				dispatch({ type: SET_NUMBER_DIALING, payload: null });
			});

			window.Storm.onDialerIdle(({ idle }) => {
				dispatch({ type: SET_ENABLE_CLICK_TO_CALL, payload: idle });
			});
		}
	}, [stormLoaded]);

	useEffect(() => {
		if (stormLoaded) {
			window.Storm.onCallEnded((outcome) => {
				const { contactId } = outcome;
				dispatch({ type: ADD_OUTCOME, payload: { contactId, outcome } });
			});
		}
	}, [stormLoaded, outcomes]);

	useEffect(() => {
		if (stormLoaded) {
			window.Storm.onCallRecorded(({ recordingId: id, contactId, number }) => {
				// TODO: make dynamic url for PROD
				axios
					.get(`${SERVER_URL}/api/customers/${VENDOR_USER_ID}/recordings/${id}`, {
						auth: {
							username: VENDOR_ID,
							password: API_KEY,
						},
					})
					.then(({ data: recording }) => {
						if (!contactId) contactId = getContactByPhone(number).id;
						dispatch({ type: ADD_RECORDING, payload: { contactId, recording } });
					});
			});
		}
	}, [stormLoaded, recordings]);

	const removeNumber = ({ contactId, number }) => {
		dispatch({ type: REMOVE_NUMBER, payload: { contactId, number } });
		window.Storm.removePhone({ contactId, number });
	};

	const addNumber = ({ contactId, number }) => {
		dispatch({ type: ADD_NUMBER, payload: { contactId, number } });
		window.Storm.addPhone({ contactId, number });
	};

	const deleteContact = ({ contactId, skip = false }) => {
		dispatch({ type: REMOVE_CONTACT, payload: { contactId, skip } });
		window.Storm.removeContact({ contactId, hangup: skip, resume: skip });
	};

	const textNumber = (params) => {
		window.Storm.openMessengerThread(params);
	};

	const callNumber = (ops) => {
		window.Storm.callPhone(ops);
	};

	const handleStart = async () => {
		const filteredContacts = contactList.filter((contact) => selected.includes(contact.contactId));
		window.Storm.startCampaign({ contacts: filteredContacts });
	};

	return (
		<div>
			<Nav startCampaign={handleStart} />
			<div id="storm-dialer-bar" />
			<div id="storm-dialer-mini" />
			<Container showingDrawer={showDrawer}>
				<Switch>
					<Route
						exact
						path="/"
						render={(props) => (
							<ListView
								{...props}
								removeContact={deleteContact}
								removeNumber={removeNumber}
								addNumber={addNumber}
								textNumber={textNumber}
								callNumber={callNumber}
							/>
						)}
					/>
					<Route
						exact
						path="/detail/:id"
						component={(props) => <DetailView {...props} getContactById={getContactById} />}
					/>
				</Switch>
				<DebugDrawer showDrawer={showDrawer} />
			</Container>
			<Toast {...messageReceivedToast} onHide={() => setMessageReceivedToast({})} delay={5000} />
		</div>
	);
};

const Container = styled.div(({ showingDrawer }) => ({
	display: 'grid',
	padding: '0 20px',
	margin: '20px auto 0',
	gridTemplateColumns: '1fr auto',
	columnGap: showingDrawer ? 20 : null,
	maxWidth: 1500,
}));

export default App;
