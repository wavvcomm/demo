import _ from 'lodash';
import * as WavvDialer from '@wavv/dialer';
import * as WavvMessenger from '@wavv/messenger';

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
