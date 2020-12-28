/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import styled from '@emotion/styled';
import { Route, Switch, useHistory, useLocation } from 'react-router-dom';
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
	SET_SCRIPT_LOADED,
	SET_DNC_LIST,
	UPDATE_DNC,
} from './types';

const useQuery = () => {
	return new URLSearchParams(useLocation().search);
};

const App = () => {
	const { authed, contactList, selected, showDrawer, showCreds, dispatch, credentials } = useContext(store);
	const [messageReceivedToast, setMessageReceivedToast] = useState({});
	const history = useHistory();
	const query = useQuery();

	const loadSnippet = (server) =>
		new Promise((resolve, reject) => {
			const script = document.createElement('script');
			script.src = `https://${server}.stormapp.com/storm.js`;
			script.onload = () => resolve();
			script.onerror = (err) => reject(err);
			document.body.appendChild(script);
		});

	const getContactByPhone = (number) =>
		contactList.find((contact) => {
			const rawNumbers = contact.numbers.map((num) => rawPhone(num));
			return rawNumbers.includes(rawPhone(number));
		});

	const authWavv = (creds) => {
		const { vendorId, apiKey, userId, server, token: tok } = creds;
		let token;
		if (tok) token = tok;
		else {
			const issuer = vendorId;
			const signature = apiKey;
			const payload = { userId };
			token = jwt.sign(payload, signature, { issuer, expiresIn: 3600 });
		}
		loadSnippet(server)
			.then(() => {
				dispatch({ type: SET_SCRIPT_LOADED, payload: true });
				debugLogger({ name: 'script loaded', dispatch });
				window.Storm.auth({ token })
					.then(() => {
						setMessageReceivedToast({
							message: 'WAVV authenticated',
						});
						dispatch({ type: SET_AUTHED, payload: true });
						debugLogger({ name: 'auth', dispatch });
					})
					.catch(() => {
						debugLogger({ name: 'auth failed', dispatch });
						setMessageReceivedToast({
							message: 'Error authenticating WAVV',
							error: true,
						});
					});
			})
			.catch(() => {
				debugLogger({ name: 'script failed', dispatch });
				setMessageReceivedToast({
					message: 'Error loading WAVV',
					error: true,
				});
			});
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

	const checkDncNumbers = () => {
		const numbers = contactList.map((contact) => contact.numbers).flat();
		window.Storm.checkDncNumbers({ numbers })
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
		if (authed) {
			checkDncNumbers();

			const params = {
				fields: [
					{ id: 'first_name', label: 'First Name' },
					{ id: 'last_name', label: 'Last Name' },
					{ id: 'email', label: 'Email' },
				],
			};

			window.Storm.setMergeFields(params);
			debugLogger({ name: 'setMergeFields', dispatch });

			window.Storm.onContactLink((contact) => {
				if (contact) {
					debugLogger({ name: 'onContactLink', dispatch });
					const { contactId, name } = contact;
					const id = contactId || getContactByPhone(name)?.contactId;
					if (id) history.push(`/detail/${id}`);
					else
						setMessageReceivedToast({
							message: 'No matching contact id',
							error: true,
						});
				} else {
					debugLogger({ name: 'onContactLink failed', dispatch });
					setMessageReceivedToast({
						message: 'No matching contact',
						error: true,
					});
				}
			});

			window.Storm.onContactSearch(({ search, contacts: returnedContacts, callback }) => {
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

			window.Storm.onUnreadCount(({ unreadCount, numberCounts }) => {
				debugLogger({ name: 'onUnreadCount', dispatch });
				dispatch({ type: SET_UNREAD_MESSAGES, payload: unreadCount });
				dispatch({ type: SET_UNREAD_COUNTS, payload: numberCounts });
			});

			window.Storm.onMessageReceived(({ number, body }) => {
				debugLogger({ name: 'onMessageReceived', dispatch });
				const contact = getContactByPhone(number);
				const header = `New Message from ${contact?.name || number}`;
				const toast = { header, message: body };
				setMessageReceivedToast(toast);
			});

			window.Storm.onLinesChanged(({ lines }) => {
				debugLogger({ name: 'onLinesChanged', dispatch });
				lines.forEach((call) => {
					if (call.focused) {
						if (call.contactId) history.push(`/detail/${call.contactId}`);
					}
				});
			});

			window.Storm.onCallStarted(({ number }) => {
				debugLogger({ name: 'onCallStarted', dispatch });
				dispatch({ type: SET_NUMBER_DIALING, payload: number });
			});

			window.Storm.onCampaignEnded(() => {
				debugLogger({ name: 'onCampaignEnded', dispatch });
				dispatch({ type: SET_NUMBER_DIALING, payload: null });
			});

			window.Storm.onDialerIdle(({ idle }) => {
				debugLogger({ name: 'onDialerIdle', dispatch });
				dispatch({ type: SET_ENABLE_CLICK_TO_CALL, payload: idle });
			});

			window.Storm.onCallEnded((outcome) => {
				debugLogger({ name: 'onCallEnded', dispatch });
				const { contactId } = outcome;
				dispatch({ type: ADD_OUTCOME, payload: { contactId, outcome } });
			});

			window.Storm.onDncChanged((dnc) => {
				debugLogger({ name: 'onDncChanged', dispatch });
				dispatch({ type: UPDATE_DNC, payload: dnc });
			});
		}
	}, [authed]);

	const removeNumber = ({ contactId, number }) => {
		dispatch({ type: REMOVE_NUMBER, payload: { contactId, number } });
		window.Storm.removePhone({ contactId, number });
		debugLogger({ name: 'removePhone', dispatch });
	};

	const addNumber = ({ contactId, number }) => {
		dispatch({ type: ADD_NUMBER, payload: { contactId, number } });
		window.Storm.addPhone({ contactId, number });
		debugLogger({ name: 'addPhone', dispatch });
	};

	const deleteContact = ({ contactId, skip = false }) => {
		dispatch({ type: REMOVE_CONTACT, payload: { contactId, skip } });
		window.Storm.removeContact({ contactId, hangup: skip, resume: skip });
		debugLogger({ name: 'removeContact', dispatch });
	};

	const textNumber = (params) => {
		window.Storm.openMessengerThread(params);
		debugLogger({ name: 'openMessengerThread', dispatch });
	};

	const callNumber = (ops) => {
		window.Storm.callPhone(ops);
		debugLogger({ name: 'callPhone', dispatch });
	};

	const handleStart = async () => {
		const filteredContacts = contactList.filter((contact) => selected.includes(contact.contactId));
		window.Storm.startCampaign({ contacts: filteredContacts });
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
