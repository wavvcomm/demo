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
	checkDncNumbers,
	removeContact,
	startCampaign,
	addCallEndedListener,
	addLinesChangedListener,
	addCallStartedListener,
	addCampaignEndedListener,
	addDialerIdleListener,
	addDncChangedListener,
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
	SET_AUTHED,
	SET_UNREAD_COUNTS,
	SET_UNREAD_MESSAGES,
	TOGGLE_CREDENTIALS,
	ADD_UPDATE_CREDENTIALS,
	SET_DNC_LIST,
	UPDATE_DNC,
} from './types';

const useQuery = () => {
	return new URLSearchParams(useLocation().search);
};

const App = () => {
	const { contactList, selected, showDrawer, showCreds, dispatch, credentials } = useContext(store);
	const [messageReceivedToast, setMessageReceivedToast] = useState({});
	const history = useHistory();
	const query = useQuery();

	const getContactByPhone = (number) =>
		contactList.find((contact) => {
			const rawNumbers = contact.numbers.map((num) => rawPhone(num));
			return rawNumbers.includes(rawPhone(number));
		});

	const getContactByNumbers = (numbers) => {
		let contact;
		if (numbers?.length) {
			numbers.some((number) => {
				const contactFound = getContactByPhone(number);
				if (contactFound) {
					contact = contactFound;
					return true;
				}
			});
		}
		return contact;
	};

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
		try {
			await initWavv({ token, server });
			setMessageReceivedToast({
				message: 'WAVV authenticated',
			});
			dispatch({ type: SET_AUTHED, payload: true });
			debugLogger({ name: 'init', dispatch });
		} catch (err) {
			debugLogger({ name: 'auth failed', dispatch });
			setMessageReceivedToast({
				message: 'Error authenticating WAVV',
				error: true,
			});
		}
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
			let name = contact.name;
			if (!name) {
				const { firstName, lastName } = contact;
				if (firstName || lastName) name = `${firstName || ''} ${lastName || ''}`;
				name = name.trim();
			}
			name = name?.toLowerCase();
			return name?.includes(formattedSearch) || numbersString?.includes(formattedSearch);
		});

		return results;
	};

	const checkNumbersOnDnc = () => {
		const numbers = contactList.map((contact) => contact.numbers).flat();
		checkDncNumbers({ numbers })
			.then((dncNumbers) => {
				debugLogger({ name: 'checkDncNumbers', dispatch });
				dispatch({ type: SET_DNC_LIST, payload: dncNumbers });
			})
			.catch((err) => {
				debugLogger({ name: 'checkDncNumbers failed', dispatch });
				setMessageReceivedToast({
					message: err,
					error: true,
				});
			});
	};

	useEffect(() => {

		const params = {
			fields: [
				{ id: 'email', label: 'Email' },
			],
		};

		setMergeFields(params);
		debugLogger({ name: 'setMergeFields', dispatch });



		const unreadCountListener = addUnreadCountListener(({ unreadCount, numberCounts }) => {
			debugLogger({ name: 'onUnreadCount', dispatch });
			dispatch({ type: SET_UNREAD_MESSAGES, payload: unreadCount });
			dispatch({ type: SET_UNREAD_COUNTS, payload: numberCounts });
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

		const callEndedListener = addCallEndedListener((outcome) => {
			debugLogger({ name: 'onCallEnded', dispatch });
			const { contactId } = outcome;
			dispatch({ type: ADD_OUTCOME, payload: { contactId, outcome } });
		});
		const dncChangedListener = addDncChangedListener((dnc) => {
			debugLogger({ name: 'onDncChanged', dispatch });
			dispatch({ type: UPDATE_DNC, payload: dnc });
		});

		return () => {
			unreadCountListener.remove();
			linesChangedListener.remove();
			callStartedListener.remove();
			campaignEndedListener.remove();
			dialerIdleListener.remove();
			callEndedListener.remove();
			dncChangedListener.remove();
		};
	}, []);

	useEffect(() => {
		checkNumbersOnDnc();

		const contactLinkListener = addContactLinkListener(({ contact, callback }) => {
			debugLogger({ name: 'onContactLink', dispatch });
			const { contactId, numbers } = contact;
			const id = contactId || getContactByNumbers(numbers).contactId;
			const found = getContactById(id);
			if (id && found) {
				callback({ closeModal: true });
				history.push(`/detail/${id}`);
			} else {
				callback({ displayError: true });
				const errorMessage = 'No matching contact';
				setMessageReceivedToast({
					message: errorMessage,
					error: true,
				});
			}
		});

		const contactSearchListener = addContactSearchListener(({ search, contacts: returnedContacts, callback }) => {
			debugLogger({ name: 'onContactSearch', dispatch });
			if (search) {
				const results = getContactsBySearchTerms(search);
				callback(results);
			} else {
				const results = returnedContacts.map((contact) => {
					const { id, numbers } = contact;
					return id ? getContactById(id) : getContactByNumbers(numbers);
				});
				callback(results);
			}
		});

		const messageReceivedListener = addMessageReceivedListener(({ number, body }) => {
			debugLogger({ name: 'onMessageReceived', dispatch });
			const contact = getContactByPhone(number);
			const header = `New Message from ${contact?.name || number}`;
			const toast = { header, message: body };
			setMessageReceivedToast(toast);
		});

		return () => {
			contactLinkListener.remove();
			contactSearchListener.remove();
			messageReceivedListener.remove();
		};
	}, [contactList]);

	const removeNumber = ({ contactId, number }) => {
		dispatch({ type: REMOVE_NUMBER, payload: { contactId, number } });
		removePhone({ contactId, number })
			.then(() => debugLogger({ name: 'removePhone', dispatch }))
			.catch(() => debugLogger({ name: 'removePhone failed', dispatch }));
	};

	const addNumber = ({ contactId, number }) => {
		dispatch({ type: ADD_NUMBER, payload: { contactId, number } });
		addPhone({ contactId, number })
			.then(() => debugLogger({ name: 'addPhone', dispatch }))
			.catch(() => debugLogger({ name: 'addPhone failed', dispatch }));
	};

	const deleteContact = ({ contactId, skip = false }) => {
		dispatch({ type: REMOVE_CONTACT, payload: { contactId, skip } });
		removeContact({ contactId, hangup: skip, resume: skip })
			.then(() => debugLogger({ name: 'removeContact', dispatch }))
			.catch(() => debugLogger({ name: 'removeContact failed', dispatch }));
	};

	const textNumber = (params) => {
		openMessengerThread(params);
		debugLogger({ name: 'openMessengerThread', dispatch });
	};

	const callNumber = ({ contact, number }) => {
		const { contactId, name, address, city } = contact;
		const ops = { contactId, name, address, city, number };
		callPhone(ops)
			.then(() => debugLogger({ name: 'callPhone', dispatch }))
			.catch(() => debugLogger({ name: 'callPhone failed', dispatch }));
	};

	const handleStart = async () => {
		const filteredContacts = contactList.filter((contact) => selected.includes(contact.contactId));
		startCampaign({ contacts: filteredContacts })
			.then(() => debugLogger({ name: 'startCampaign', dispatch }))
			.catch(() => debugLogger({ name: 'startCampaign failed', dispatch }));
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
	alignItems: 'start',
	maxWidth: 1500,
}));

export default App;
