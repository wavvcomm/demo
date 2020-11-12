import _ from 'lodash';
import * as WavvDialer from '@wavv/dialer';
import * as WavvMessenger from '@wavv/messenger';

export const rawPhone = (phone, long = false) => {
	phone = _.trim(phone).replace(/[^0-9]/g, '');
	if (phone.length < 11) phone = `1${phone}`;
	return phone.substr(long ? 0 : 1, long ? 11 : 10);
};

export const formatPhone = (phone) => {
	return rawPhone(phone).replace(/^(.{3})(.{3})(.{4})/, '($1) $2-$3');
};

export const registerCallbacks = () => {
	const stormDialerCallbacks = [
		'onCallStarted',
		'onCallAnswered',
		'onCallEnded',
		'onCallRecorded',
		'onDialerIdle',
		'onWaitingForContinue',
		'onCampaignEnded',
		'onLinesChanged',
		'onClosed',
		'onDialerVisible',
		'onMiniDialerVisible',
		'onOverlayVisible',
	];

	const stormMessengerCallbacks = [
		'onContactSearch',
		'onMessageReceived',
		'onUnreadCount',
		'onMessageSent',
		'onContactLink',
	];

	stormDialerCallbacks.forEach((func) => {
		if (_.isFunction(WavvDialer[func])) {
			WavvDialer[func]((ob) => {
				console.log(`${func} called`, { ob });
			});
		} else {
			console.log(`[ WARN ] WavvDialer.${func} is not a function`);
		}
	});

	stormMessengerCallbacks.forEach((func) => {
		if (_.isFunction(WavvMessenger[func])) {
			WavvMessenger[func]((ob) => {
				console.log(`${func} called`, { ob });
			});
		} else {
			console.log(`[ WARN ] WavvMessenger.${func} is not a function`);
		}
	});
};
