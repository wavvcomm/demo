/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import styled from '@emotion/styled';
import { Route, Switch, useHistory, useLocation } from 'react-router-dom';
import { init as initWavv } from '@wavv/core';
import {
	addPhone,
	removePhone,
	callPhone,
	removeContact,
	startCampaign,
	addCallEndedListener,
	addLinesChangedListener,
	addCallStartedListener,
	addCampaignEndedListener,
	addDialerIdleListener,
} from '@wavv/dialer';
import {
	setMergeFields,
	openMessengerThread,
	addContactLinkListener,
	addContactSearchListener,
	addMessageReceivedListener,
	addUnreadCountListener,
} from '@wavv/messenger';
import ListView from './ListView';
import DetailView from './DetailView';
import Nav from './Nav';
import Toast from './Toast';
import { debugLogger, rawPhone } from './utils';
import DebugDrawer from './DebugDrawer';
import CredentialModal from './CredentialModal';
import { store } from './store';
import {
	ADD_NUMBER,
	ADD_OUTCOME,
	ADD_CONTACT,
	REMOVE_CONTACT,
	REMOVE_NUMBER,
	SET_ENABLE_CLICK_TO_CALL,
	SET_NUMBER_DIALING,
	SET_STORM_LOADED,
	SET_UNREAD_COUNTS,
	SET_UNREAD_MESSAGES,
	TOGGLE_CREDENTIALS,
	ADD_UPDATE_CREDENTIALS,
} from './types';

const useQuery = () => {
	return new URLSearchParams(useLocation().search);
};

const App = () => {
	const { contactList, selected, showDrawer, showCreds, outcomes, dispatch, credentials } = useContext(store);
	const [messageReceivedToast, setMessageReceivedToast] = useState({});
	const history = useHistory();
	const query = useQuery();

	const getContactByPhone = (number) =>
		contactList.find((contact) => {
			const rawNumbers = contact.numbers.map((num) => rawPhone(num));
			return rawNumbers.includes(rawPhone(number));
		});

	const authWavv = async (creds) => {
		const { vendorId, apiKey, userId, server, token: tok } = creds;
		let token;
		if (tok) token = tok;
		else {
			const issuer = vendorId;
			const signature = apiKey;
			const payload = { userId };
			token = jwt.sign(payload, signature, { issuer, expiresIn: 3600 });
		}
		dispatch({ type: SET_STORM_LOADED, payload: true });
		await initWavv({ token, server });
		debugLogger({ name: 'init', dispatch });
	};

	useEffect(() => {
		const token = query.get('token');
		const server = query.get('server');
		if (token && server) {
			authWavv({ token, server });
			const id = uuid();
			dispatch({ type: ADD_UPDATE_CREDENTIALS, payload: { id, token, server, active: true } });
		} else {
			const creds = credentials.find((cred) => cred.active);
			if (creds) {
				authWavv(creds);
			} else if (!showCreds) {
				dispatch({ type: TOGGLE_CREDENTIALS });
			}
		}
	}, []);

	const getContactById = (id) => contactList.find((contact) => contact.contactId === id);

	const getContactsBySearchTerms = (search) => {
		const formattedSearch = search.toLowerCase();

		const results = contactList.filter((contact) => {
			const numbersString = contact.numbers.join(' ');
			return contact.name.includes(formattedSearch) || numbersString.includes(formattedSearch);
		});

		return results;
	};

	useEffect(() => {
		const params = {
			fields: [
				{ id: 'first_name', label: 'First Name' },
				{ id: 'last_name', label: 'Last Name' },
				{ id: 'email', label: 'Email' },
			],
		};

		setMergeFields(params);
		debugLogger({ name: 'setMergeFields', dispatch });

		const contactLinkListener = addContactLinkListener((contact) => {
			debugLogger({ name: 'onContactLink', dispatch });
			const { contactId, name } = contact;
			const id = contactId || getContactByPhone(name).contactId;
			if (id) history.push(`/detail/${id}`);
		});

		const contactSearchListener = addContactSearchListener(({ search, contacts: returnedContacts, callback }) => {
			debugLogger({ name: 'onContactSearch', dispatch });
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

		const unreadCountListener = addUnreadCountListener(({ unreadCount, numberCounts }) => {
			debugLogger({ name: 'onUnreadCount', dispatch });
			dispatch({ type: SET_UNREAD_MESSAGES, payload: unreadCount });
			dispatch({ type: SET_UNREAD_COUNTS, payload: numberCounts });
		});

		const messageReceivedListener = addMessageReceivedListener(({ number, body }) => {
			debugLogger({ name: 'onMessageReceived', dispatch });
			const contact = getContactByPhone(number);
			const header = `New Message from ${contact.name || number}`;
			const toast = { header, message: body };
			setMessageReceivedToast(toast);
		});

		const linesChangedListener = addLinesChangedListener(({ lines }) => {
			debugLogger({ name: 'onLinesChanged', dispatch });
			lines.forEach((call) => {
				if (call.focused) {
					if (call.contactId) history.push(`/detail/${call.contactId}`);
				}
			});
		});

		const callStartedListener = addCallStartedListener(({ number }) => {
			debugLogger({ name: 'onCallStarted', dispatch });
			dispatch({ type: SET_NUMBER_DIALING, payload: number });
		});

		const campaignEndedListener = addCampaignEndedListener(() => {
			debugLogger({ name: 'onCampaignEnded', dispatch });
			dispatch({ type: SET_NUMBER_DIALING, payload: null });
		});

		const dialerIdleListener = addDialerIdleListener(({ idle }) => {
			debugLogger({ name: 'onDialerIdle', dispatch });
			dispatch({ type: SET_ENABLE_CLICK_TO_CALL, payload: idle });
		});

		return () => {
			contactLinkListener.remove();
			contactSearchListener.remove();
			unreadCountListener.remove();
			messageReceivedListener.remove();
			linesChangedListener.remove();
			callStartedListener.remove();
			campaignEndedListener.remove();
			dialerIdleListener.remove();
		};
	}, []);

	useEffect(() => {
		const callEndedListener = addCallEndedListener((outcome) => {
			debugLogger({ name: 'onCallEnded', dispatch });
			const { contactId } = outcome;
			dispatch({ type: ADD_OUTCOME, payload: { contactId, outcome } });
		});
		return () => {
			callEndedListener.remove();
		};
	}, [outcomes]);

	const removeNumber = ({ contactId, number }) => {
		dispatch({ type: REMOVE_NUMBER, payload: { contactId, number } });
		removePhone({ contactId, number });
		debugLogger({ name: 'removePhone', dispatch });
	};

	const addNumber = ({ contactId, number }) => {
		dispatch({ type: ADD_NUMBER, payload: { contactId, number } });
		addPhone({ contactId, number });
		debugLogger({ name: 'addPhone', dispatch });
	};

	const deleteContact = ({ contactId, skip = false }) => {
		dispatch({ type: REMOVE_CONTACT, payload: { contactId, skip } });
		removeContact({ contactId, hangup: skip, resume: skip });
		debugLogger({ name: 'removeContact', dispatch });
	};

	const textNumber = (params) => {
		openMessengerThread(params);
		debugLogger({ name: 'openMessengerThread', dispatch });
	};

	const callNumber = ({ contact, number }) => {
		const { contactId, name, address, city } = contact;
		const ops = { contactId, name, address, city, number };
		callPhone(ops);
		debugLogger({ name: 'callPhone', dispatch });
	};

	const handleStart = async () => {
		const filteredContacts = contactList.filter((contact) => selected.includes(contact.contactId));
		startCampaign({ contacts: filteredContacts });
		debugLogger({ name: 'startCampaign', dispatch });
	};

	const addContact = (contact) => {
		dispatch({ type: ADD_CONTACT, payload: contact });
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
								addContact={addContact}
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
				<CredentialModal auth={authWavv} />
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
