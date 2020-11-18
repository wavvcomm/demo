export { VENDOR_ID, API_KEY, VENDOR_USER_ID, SERVER_URL } from './constants.json';

export const contacts = [
	{
		contactId: '1',
		numbers: ['9588880000'],
		address: '123 E. 456 S.',
		city: 'Some City',
		name: 'Victor Voicemail',
		avatarUrl: 'https://res.cloudinary.com/stormapp/image/upload/v1605635973/2_bt1i2a.png',
		mergeFields: [
			{ id: 'first_name', label: 'First Name', value: 'Victor' },
			{ id: 'last_name', label: 'Last Name', value: 'Voicemail' },
			{ id: 'email', label: 'Email', value: 'test@test.com' },
		],
	},
	{
		contactId: '3',
		numbers: ['9586660000', '9586660001', '9586660002'],
		address: '123 E. 456 S.',
		city: 'Some City',
		name: 'Rachel Ring',
		avatarUrl: 'https://res.cloudinary.com/stormapp/image/upload/v1605635949/3_rqjcbi.png',
		mergeFields: [
			{ id: 'first_name', label: 'First Name', value: 'Rachel' },
			{ id: 'last_name', label: 'Last Name', value: 'Ring' },
			{ id: 'email', label: 'Email', value: 'test@test.com' },
		],
	},
	{
		contactId: '2',
		numbers: ['9587770000', '9587770001'],
		address: '123 E. 456 S.',
		city: 'Some City',
		name: 'Alice Answer',
		avatarUrl: 'https://res.cloudinary.com/stormapp/image/upload/v1605635993/1_mfsioi.png',
		mergeFields: [
			{ id: 'first_name', label: 'First Name', value: 'Alice' },
			{ id: 'last_name', label: 'Last Name', value: 'Answer' },
			{ id: 'email', label: 'Email', value: 'test@test.com' },
		],
	},
	{
		contactId: '4',
		numbers: ['9585550000'],
		address: '123 E. 456 S.',
		city: 'Some City',
		name: 'Eric Echo',
		avatarUrl: 'https://res.cloudinary.com/stormapp/image/upload/v1605636272/crop-2020-11-17_1_awpief.jpg',
		mergeFields: [
			{ id: 'first_name', label: 'First Name', value: 'Eric' },
			{ id: 'last_name', label: 'Last Name', value: 'Echo' },
			{ id: 'email', label: 'Email', value: 'test@test.com' },
		],
	},
	{
		contactId: '5',
		numbers: ['9584440000', '9584440001'],
		address: '123 E. 456 S.',
		city: 'Some City',
		name: 'Hank Hangup',
		avatarUrl: 'https://res.cloudinary.com/stormapp/image/upload/v1605636306/crop-2020-11-17_chpw7v.jpg',
		mergeFields: [
			{ id: 'first_name', label: 'First Name', value: 'Hank' },
			{ id: 'last_name', label: 'Last Name', value: 'Hangup' },
			{ id: 'email', label: 'Email', value: 'test@test.com' },
		],
	},
];

export const exampleMessages = [
	{
		id: 'b809f77f-ea6d-45f1-9608-b123b71c2f4b',
		body: 'Ut enim ad minim veniam, quis nostrud exercitation.',
		status: 'RECEIVED',
	},
	{ id: 'c809f742-a234d-45f1-9608-b123b71c2f4b', body: 'quis nostrud exercitation.', status: 'DELIVERED' },
	{
		id: 'c809f742-a234d-45f1-9608-b1223456df4b',
		body:
			'nostrud exercitation. Ut enim ad minim veniam, quis nostrud exercitation. Ut enim ad minim veniam, quis nostrud exercitation.',
		status: 'RECEIVED',
	},
	{
		id: 'bgs4f77f-ea6d-45f1-9608-b123b71c2f4b',
		body:
			'Ad minim veniam, quis nostrud exercitation. nostrud exercitation. Ut enim ad minim veniam, quis nostrud exercitation. Ut enim ad minim veniam. nostrud exercitation. Ut enim ad minim veniam, quis nostrud exercitation. Ut enim ad minim veniam.',
		status: 'DELIVERED',
	},
];

export const exampleNotes = [
	{
		note:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. *See recording',
		date: '2019-02-19T06:00:00Z',
		number: '2029659970',
	},
	{
		note:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		date: '2019-05-14T06:00:00Z',
		number: '2029659970',
	},
];

export const exampleRecordings = [
	{
		id: '0234982f-6339-4a9d-8f79-efb6e83d228f',
		date: '2019-02-19T06:00:00Z',
		url: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg',
	},
];

export const exampleOutcomes = [
	{
		date: '2020-10-13T06:00:00Z',
		number: '2029659970',
		duration: 32,
		outcome: 'USER_HUNG_UP',
		human: true,
	},
	{
		date: '2020-07-03T06:00:00Z',
		number: '2029659970',
		duration: 7,
		outcome: 'BUSY',
		human: false,
	},
];
