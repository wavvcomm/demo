import React, { createContext, useReducer, Reducer } from 'react';
import _ from 'lodash';
import { contacts, exampleNotes, exampleOutcomes } from './constants';
import {
	SET_AUTHED,
	SET_DEAUTHED,
	SET_OPEN_NOTE,
	SET_SELECTED,
	SET_UNREAD_MESSAGES,
	SET_NUMBER_DIALING,
	SET_UNREAD_COUNTS,
	SET_ENABLE_CLICK_TO_CALL,
	TOGGLE_DRAWER,
	SET_TAGS,
	SET_NOTES,
	SET_DNC_LIST,
	UPDATE_DNC,
	REMOVE_CONTACT,
	ADD_NUMBER,
	REMOVE_NUMBER,
	ADD_OUTCOME,
	ADD_CONTACT,
	ADD_DEBUG_LOG,
	ADD_UPDATE_CREDENTIALS,
	REMOVE_CREDENTIALS,
	TOGGLE_CREDENTIALS,
} from './actionTypes';
import { Contact, Store, Action, Creds } from './paramTypes';

const getItems = (item: string): any[] | null => {
	const items = localStorage.getItem(item);
	if (items) return JSON.parse(items);
	return null;
};

const initialState: Store = {
	authed: false,
	openNote: false,
	contactList: getItems('contacts') || contacts,
	selected: [],
	skipped: [],
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
	credentials: getItems('creds') || [],
	dncList: {},
	dispatch: (arg: Action) => {
		return arg;
	},
};

const store = createContext(initialState);
const { Provider } = store;

const StateProvider: React.FC = ({ children }) => {
	const [storeState, dispatch] = useReducer<Reducer<Store, Action>>((state, action): Store => {
		const { type, payload } = action;
		switch (type) {
			case SET_AUTHED: {
				return { ...state, authed: payload };
			}
			case SET_DEAUTHED: {
				return initialState;
			}
			case SET_OPEN_NOTE: {
				return { ...state, openNote: payload };
			}
			case SET_SELECTED: {
				const { selected, contactList } = state;
				let newSelected = [...selected];
				if (payload === 'all') {
					if (selected.length === contactList.length) newSelected = [];
					else newSelected = contactList.map((contact: Contact) => contact.contactId);
				} else if (selected.includes(payload)) {
					newSelected = selected.filter((item: string) => item !== payload);
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
			case SET_DNC_LIST: {
				return { ...state, dncList: payload };
			}
			case UPDATE_DNC: {
				const newState = { ...state };
				const { removed, number, type: dncType, removable } = payload;
				if (removed) {
					delete newState.dncList[number];
					return newState;
				}
				const item = { type: dncType, removable };
				newState.dncList[number] = item;
				return newState;
			}
			case ADD_CONTACT: {
				const updatedContacts = [...state.contactList, payload];
				localStorage.setItem('contacts', JSON.stringify(updatedContacts));
				return { ...state, contactList: updatedContacts };
			}
			case REMOVE_CONTACT: {
				const { contactId, skip } = payload;
				if (!skip) {
					const updatedContacts = state.contactList.filter(
						(contact: Contact) => contact.contactId !== contactId
					);
					localStorage.setItem('contacts', JSON.stringify(updatedContacts));
					return { ...state, contactList: updatedContacts };
				}
				const updatedSkipped = new Set([...state.skipped, contactId]);
				return { ...state, skipped: [...updatedSkipped] };
			}
			case ADD_NUMBER: {
				const { contactId, number } = payload;
				const updatedContacts = state.contactList.map((contact: Contact) => {
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
				const updatedContacts = state.contactList.map((contact: Contact) => {
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
				if (payload.token) newState.credentials = newState.credentials.filter((cred: Creds) => !cred.token);
				if (payload.active)
					newState.credentials.map((cred: Creds) => {
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
				const credentials = state.credentials.filter((cred: Creds) => cred.id !== payload);
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
