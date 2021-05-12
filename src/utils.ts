import _ from 'lodash';
import { ADD_DEBUG_LOG } from './actionTypes';

export const rawPhone = (phone: string, long = false) => {
	phone = _.trim(phone).replace(/[^0-9]/g, '');
	if (phone.length < 11) phone = `1${phone}`;
	return phone.substr(long ? 0 : 1, long ? 11 : 10);
};

export const formatPhone = (phone: string) => {
	return rawPhone(phone).replace(/^(.{3})(.{3})(.{4})/, '($1) $2-$3');
};

export const validPhone = (phone: string) => {
	if (!_.isString(phone)) return false;
	phone = phone.replace(/[^0-9]/g, '');
	return phone.length === 10 || phone.length === 11;
};

export const debugLogger = ({ name, dispatch }: { name: string; dispatch: any }) => {
	dispatch({ type: ADD_DEBUG_LOG, payload: name });
};
