import React, { createContext, useReducer } from 'react';
import _ from 'lodash';
import { contacts, exampleNotes, exampleOutcomes } from './constants';
import {
	SET_STORM_LOADED,
	SET_OPEN_NOTE,
	SET_SELECTED,
	SET_UNREAD_MESSAGES,
	SET_NUMBER_DIALING,
	SET_UNREAD_COUNTS,
	SET_ENABLE_CLICK_TO_CALL,
	TOGGLE_DRAWER,
	SET_TAGS,
	SET_NOTES,
	REMOVE_CONTACT,
	ADD_NUMBER,
	REMOVE_NUMBER,
	ADD_OUTCOME,
	ADD_CONTACT,
	ADD_DEBUG_LOG,
	ADD_UPDATE_CREDENTIALS,
	REMOVE_CREDENTIALS,
	TOGGLE_CREDENTIALS,
} from './types';

const initialState = {
	stormLoaded: false,
	openNote: false,
	contactList: JSON.parse(localStorage.getItem('contacts')) || contacts,
	selected: [],
	skipped: [],
	dncAction: '',
	dncNumber: '',
	unreadMessages: 0,
	numberDialing: null,
	unreadCounts: {},
	enableClickToCall: true,
	showDrawer: false,
	showCreds: false,
	tags: {
		1: {
			'Warm Lead': true,
		},
	},
	notes: {
		1: exampleNotes,
	},
	outcomes: {
		1: exampleOutcomes,
	},
	logs: [],
	credentials: JSON.parse(localStorage.getItem('creds')) || [],
};
const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }) => {
	const [storeState, dispatch] = useReducer((state, action) => {
		const { type, payload } = action;
		switch (type) {
			case SET_STORM_LOADED: {
				return { ...state, stormLoaded: payload };
			}
			case SET_OPEN_NOTE: {
				return { ...state, openNote: payload };
			}
			case SET_SELECTED: {
				const { selected, contactList } = state;
				let newSelected = [...selected];
				if (payload === 'all') {
					if (selected.length === contactList.length) newSelected = [];
					else newSelected = contactList.map((contact) => contact.contactId);
				} else if (selected.includes(payload)) {
					newSelected = selected.filter((item) => item !== payload);
				} else {
					newSelected.push(payload);
				}
				return { ...state, selected: newSelected };
			}
			case SET_UNREAD_MESSAGES: {
				return { ...state, unreadMessages: payload };
			}
			case SET_NUMBER_DIALING: {
				return { ...state, numberDialing: payload };
			}
			case SET_UNREAD_COUNTS: {
				return { ...state, unreadCounts: payload };
			}
			case SET_ENABLE_CLICK_TO_CALL: {
				return { ...state, enableClickToCall: payload };
			}
			case TOGGLE_DRAWER: {
				return { ...state, showDrawer: !state.showDrawer };
			}
			case TOGGLE_CREDENTIALS: {
				return { ...state, showCreds: !state.showCreds };
			}
			case SET_TAGS: {
				return { ...state, tags: payload };
			}
			case SET_NOTES: {
				return { ...state, notes: payload };
			}
			case ADD_CONTACT: {
				const updatedContacts = [...state.contactList, payload];
				localStorage.setItem('contacts', JSON.stringify(updatedContacts));
				return { ...state, contactList: updatedContacts };
			}
			case REMOVE_CONTACT: {
				const { contactId, skip } = payload;
				if (!skip) {
					const updatedContacts = state.contactList.filter((contact) => contact.contactId !== contactId);
					localStorage.setItem('contacts', JSON.stringify(updatedContacts));
					return { ...state, contactList: updatedContacts };
				}
				const updatedSkipped = new Set([...state.skipped, contactId]);
				return { ...state, skipped: [...updatedSkipped] };
			}
			case ADD_NUMBER: {
				const { contactId, number } = payload;
				const updatedContacts = state.contactList.map((contact) => {
					if (contact.contactId === contactId) {
						const newNumbers = [...contact.numbers, number];
						return { ...contact, numbers: newNumbers };
					}
					return contact;
				});
				localStorage.setItem('contacts', JSON.stringify(updatedContacts));
				return { ...state, contactList: updatedContacts };
			}
			case REMOVE_NUMBER: {
				const { contactId, number } = payload;
				const updatedContacts = state.contactList.map((contact) => {
					if (contact.contactId === contactId) {
						const filteredNumbers = contact.numbers.filter((num) => num !== number);
						return { ...contact, numbers: filteredNumbers };
					}
					return contact;
				});
				localStorage.setItem('contacts', JSON.stringify(updatedContacts));
				return { ...state, contactList: updatedContacts };
			}
			case ADD_OUTCOME: {
				const { contactId, outcome } = payload;
				const { outcomes } = state;
				const newOutcomes = { ...outcomes };
				outcome.date = Date.now();
				if (outcomes[contactId]) newOutcomes[contactId].push(outcome);
				else newOutcomes[contactId] = [outcome];
				return { ...state, outcomes: newOutcomes };
			}
			case ADD_DEBUG_LOG: {
				const logs = [...state.logs, payload];
				return { ...state, logs };
			}
			case ADD_UPDATE_CREDENTIALS: {
				const newState = { ...state };
				if (payload.token) newState.credentials = newState.credentials.filter((cred) => !cred.token);
				if (payload.active)
					newState.credentials.map((cred) => {
						if (cred.id !== payload.id) {
							cred.active = false;
						}
						return cred;
					});
				const existingIndex = _.findIndex(newState.credentials, { id: payload.id });
				if (existingIndex >= 0) {
					newState.credentials[existingIndex] = payload;
				} else {
					newState.credentials = [payload, ...newState.credentials];
				}
				localStorage.setItem('creds', JSON.stringify(newState.credentials));
				return newState;
			}
			case REMOVE_CREDENTIALS: {
				const credentials = state.credentials.filter((cred) => cred.id !== payload);
				localStorage.setItem('creds', JSON.stringify(credentials));
				return { ...state, credentials };
			}
			default:
				return state;
		}
	}, initialState);

	return <Provider value={{ ...storeState, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
