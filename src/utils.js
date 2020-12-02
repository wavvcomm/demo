import _ from 'lodash';
import { ADD_DEBUG_LOG } from './types';

export const rawPhone = (phone, long = false) => {
	phone = _.trim(phone).replace(/[^0-9]/g, '');
	if (phone.length < 11) phone = `1${phone}`;
	return phone.substr(long ? 0 : 1, long ? 11 : 10);
};

export const formatPhone = (phone) => {
	return rawPhone(phone).replace(/^(.{3})(.{3})(.{4})/, '($1) $2-$3');
};

export const debugLogger = ({ name, dispatch }) => {
	dispatch({ type: ADD_DEBUG_LOG, payload: name });
};
