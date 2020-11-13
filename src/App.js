/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';
import { Container, Button, Modal, Input } from 'semantic-ui-react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { APP_ID, contacts, VENDER_USER_ID, VENDOR_ID } from './constants';
import ListView from './ListView';
import DetailView from './DetailView';
import Nav from './Nav';
import Toast from './Toast';
import { rawPhone } from './utils';

const App = () => {
	const [stormLoaded, setStormLoaded] = useState(false);
	const [contactList, setContacts] = useState(contacts);
	const [selected, setSelected] = useState([]);
	const [dncAction, setDncAction] = useState('');
	const [dncNumber, setDncNumber] = useState('');
	const [notes, setNotes] = useState([]);
	const [outcomes, setOutcomes] = useState([]);
	const [unreadMessages, setUnreadMessages] = useState(0);
	const [unreadCounts, setUnreadCounts] = useState({});
	const [messageReceivedToast, setMessageReceivedToast] = useState({});
	const history = useHistory();

	const loadSnippet = () =>
		new Promise((resolve, reject) => {
			const server = 'devstorm';
			const script = document.createElement('script');
			script.src = `https://${server}.stormapp.com/storm.js`;
			script.onload = () => resolve();
			script.onerror = (err) => reject(err);
			document.body.appendChild(script);
		});

	const authWavv = async () => {
		const issuer = VENDOR_ID;
		const signature = APP_ID;
		const userId = VENDER_USER_ID;
		const payload = { userId };
		const token = jwt.sign(payload, signature, { issuer, expiresIn: 3600 });
		try {
			await loadSnippet();
			setStormLoaded(true);
			window.Storm.auth({ token });
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		authWavv();
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
				setUnreadMessages(unreadCount);
				setUnreadCounts(numberCounts);
			});

			window.Storm.onMessageReceived(({ number, body }) => {
				const contact = getContactByPhone(number);
				const header = `New Message from ${contact.name || number}`;
				setMessageReceivedToast({
					header,
					message: body,
				});
			});

			window.Storm.onLinesChanged(({ lines }) => {
				lines.forEach((call) => {
					if (call.focused) {
						if (call.contactId) history.push(`/detail/${call.contactId}`);
					}
				});
			});
		}
	}, [stormLoaded]);

	const removeNumber = ({ contactId, number }) => {
		const updatedContacts = contactList.map((contact) => {
			if (contact.contactId === contactId) {
				const filteredNumbers = contact.numbers.filter((num) => num !== number);
				return { ...contact, numbers: filteredNumbers };
			}
			return contact;
		});
		setContacts(updatedContacts);
		window.Storm.removePhone({ contactId, number });
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
		window.Storm.addPhone({ contactId, number });
	};

	const deleteContact = ({ contactId, skip = false }) => {
		if (!skip) {
			const updatedContacts = contactList.filter((contact) => contact.contactId !== contactId);
			setContacts(updatedContacts);
		}
		window.Storm.removeContact({ contactId, hangup: skip, resume: skip });
	};

	const textNumber = (params) => {
		console.log(params);
		window.Storm.openMessengerThread(params);
	};

	const callNumber = (ops) => {
		// add Wavv calling functionality
		window.Storm.callPhone(ops);
		console.log(ops);
	};

	const handleStart = async () => {
		const filteredContacts = contactList.filter((contact) => selected.includes(contact.contactId));
		try {
			window.Storm.startCampaign({ contacts: filteredContacts });
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
			<Nav
				disableStart={!selected.length}
				startCampaign={handleStart}
				setDncAction={setDncAction}
				unreadCount={unreadMessages}
			/>
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
								unreadCounts={unreadCounts}
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
					<Route
						exact
						path="/detail/:id"
						component={(props) => (
							<DetailView
								{...props}
								notes={notes}
								setNotes={setNotes}
								outcomes={outcomes}
								setOutcomes={setOutcomes}
								unreadCounts={unreadCounts}
							/>
						)}
					/>
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
									window.Storm.removeDncNumber({ number: dncNumber });
								} else window.Storm.addDncNumber({ number: dncNumber });
								reset();
							}}
							positive
						>
							{dncAction}
						</Button>
					</Modal.Actions>
				</Modal>
			</Container>
			<Toast {...messageReceivedToast} onHide={() => setMessageReceivedToast({})} delay={5000} />
		</div>
	);
};

export default App;
