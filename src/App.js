/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { Container } from 'semantic-ui-react';
import { Route, Switch, useHistory } from 'react-router-dom';
import {
	API_KEY,
	contacts,
	VENDOR_USER_ID,
	VENDOR_ID,
	SERVER_URL,
	exampleOutcomes,
	exampleNotes,
	exampleRecordings,
} from './constants';
import ListView from './ListView';
import DetailView from './DetailView';
import Nav from './Nav';
import Toast from './Toast';
import { rawPhone } from './utils';

const App = () => {
	const [stormLoaded, setStormLoaded] = useState(false);
	const [openNote, setOpenNote] = useState(false);
	const [contactList, setContacts] = useState(contacts);
	const [selected, setSelected] = useState([]);
	const [skipped, setSkipped] = useState([]);
	const [unreadMessages, setUnreadMessages] = useState(0);
	const [numberDialing, setNumberDialing] = useState(null);
	const [unreadCounts, setUnreadCounts] = useState({});
	const [messageReceivedToast, setMessageReceivedToast] = useState({});
	const [enableClickToCall, setEnableClickToCall] = useState(true);
	const [tags, setTags] = useState({
		1: {
			'Warm Lead': true,
		},
	});
	const [notes, setNotes] = useState({
		1: exampleNotes,
	});
	const [recordings, setRecordings] = useState({
		1: exampleRecordings,
	});
	const [outcomes, setOutcomes] = useState({
		1: exampleOutcomes,
	});
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
		setStormLoaded(true);
		window.Storm.auth({ token });
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
				outcome.date = Date.now();
				if (newOutcomes[contactId]) newOutcomes[contactId].push(outcome);
				else newOutcomes[contactId] = [outcome];
				setOutcomes(newOutcomes);
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
					.then(({ data }) => {
						if (!contactId) contactId = getContactByPhone(number).id;
						const newRecordings = { ...recordings };
						if (newRecordings[contactId]) newRecordings[contactId].push(data);
						else newRecordings[contactId] = [data];
						setRecordings(newRecordings);
					});
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
		} else {
			const updatedSkipped = new Set([...skipped, contactId]);
			setSkipped([...updatedSkipped]);
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
		window.Storm.startCampaign({ contacts: filteredContacts });
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

	return (
		<div>
			<Nav disableStart={!selected.length} startCampaign={handleStart} unreadCount={unreadMessages} />
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
								skipped={skipped}
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
								tags={tags}
								setTags={setTags}
							/>
						)}
					/>
				</Switch>
			</Container>
			<Toast {...messageReceivedToast} onHide={() => setMessageReceivedToast({})} delay={5000} />
		</div>
	);
};

export default App;
