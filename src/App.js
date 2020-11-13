/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { Container, Button, Modal, Input } from 'semantic-ui-react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { APP_ID, contacts, VENDER_USER_ID, VENDOR_ID, SERVER } from './constants';
import ListView from './ListView';
import DetailView from './DetailView';
import Nav from './Nav';
import { rawPhone } from './utils';

const App = () => {
	const [stormLoaded, setStormLoaded] = useState(false);
	const [openNote, setOpenNote] = useState(false);
	const [contactList, setContacts] = useState(contacts);
	const [selected, setSelected] = useState([]);
	const [dncAction, setDncAction] = useState('');
	const [dncNumber, setDncNumber] = useState('');
	const [unreadMessages, setUnreadMessages] = useState(0);
	const [numberDialing, setNumberDialing] = useState(null);
	const [unreadCounts, setUnreadCounts] = useState({});
	const [enableClickToCall, setEnableClickToCall] = useState(true);
	const [notes, setNotes] = useState({});
	const [recordings, setRecordings] = useState({});
	const [outcomes, setOutcomes] = useState({});
	const history = useHistory();

	const loadSnippet = () =>
		new Promise((resolve, reject) => {
			const script = document.createElement('script');
			script.src = `https://${SERVER}.stormapp.com/storm.js`;
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

			// window.Storm.onMessageReceived(({ number }) => {
			// 	const contact = getContactByPhone(number);
			// 	window.Storm.openMessengerThread({ number, dock: true, contact });
			// });

			window.Storm.onLinesChanged(({ lines }) => {
				lines.forEach((call) => {
					if (call.focused) {
						if (call.contactId) history.push(`/detail/${call.contactId}`);
					}
				});
			});

			window.Storm.onCallStarted(({ number }) => {
				setNumberDialing(number);
			});

			window.Storm.onCampaignEnded(() => {
				setNumberDialing(null);
			});

			window.Storm.onDialerIdle(({ idle }) => {
				setEnableClickToCall(idle);
			});
		}
	}, [stormLoaded]);

	useEffect(() => {
		if (stormLoaded) {
			window.Storm.onCallEnded((outcome) => {
				const { contactId } = outcome;
				const newOutcomes = { ...outcomes };
				if (newOutcomes[contactId]) newOutcomes[contactId].push(outcome);
				else newOutcomes[contactId] = [outcome];
				setOutcomes(newOutcomes);
			});
		}
	}, [stormLoaded, outcomes]);

	useEffect(() => {
		if (stormLoaded) {
			window.Storm.onCallRecorded(({ recordingId: id, contactId }) => {
				axios
					.get(`http://${SERVER}:7073/api/customers/${VENDER_USER_ID}/recordings/${id}`, {
						auth: {
							username: VENDOR_ID,
							password: APP_ID,
						},
					})
					.then(({ data }) => {
						const newRecordings = { ...recordings };
						if (newRecordings[contactId]) newRecordings[contactId].push(recordings);
						else newRecordings[contactId] = [data];
						setRecordings(newRecordings);
					})
					.catch((err) => console.log({ err }));
			});
		}
	}, [stormLoaded, recordings]);

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
		window.Storm.openMessengerThread(params);
	};

	const callNumber = (ops) => {
		window.Storm.callPhone(ops);
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
								contactList={contactList}
								setContacts={setContacts}
								getContactById={getContactById}
								stormLoaded={stormLoaded}
								open={openNote}
								setOpen={setOpenNote}
								numberDialing={numberDialing}
								notes={notes}
								setNotes={setNotes}
								outcomes={outcomes}
								setOutcomes={setOutcomes}
								unreadCounts={unreadCounts}
								enableClickToCall={enableClickToCall}
								recordings={recordings}
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
		</div>
	);
};

export default App;
