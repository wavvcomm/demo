import React, { createContext, useReducer } from 'react';
import { contacts, exampleNotes, exampleOutcomes, exampleRecordings } from './constants';
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
	ADD_RECORDING,
	ADD_CONTACT,
	SET_DNC_LIST,
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
	dncList: [],
	tags: {
		1: {
			'Warm Lead': true,
		},
	},
	notes: {
		1: exampleNotes,
	},
	recordings: {
		1: exampleRecordings,
	},
	outcomes: {
		1: exampleOutcomes,
	},
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
			case ADD_RECORDING: {
				const { contactId, recording } = payload;
				const { recordings } = state;
				const newRecordings = { ...recordings };
				if (recordings[contactId]) newRecordings[contactId].push(recording);
				else newRecordings[contactId] = [recording];
				return { ...state, recordings: newRecordings };
			}
			case SET_DNC_LIST: {
				return { ...state, dncList: payload };
			}
			default:
				return state;
		}
	}, initialState);

	return <Provider value={{ ...storeState, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
