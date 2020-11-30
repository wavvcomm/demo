export const VENDOR_ID = '90d267ae9889abf5cb9e3539d213e99b';
export const APP_ID = 'c1577a7e48dd721e5783851898c51e2bc62f84da7a40ccade2d872e7d8ce7fd2';
export const VENDOR_USER_ID = '2135221';
export const SERVER = 'https://stage1.stormapp.com';
export const SERVER_API = 'https://stage1.stormapp.com';
// export const SERVER = 'http://devstorm.stormapp.com';
// export const SERVER_API = 'http://devstorm:7073';

export const contacts = [
	{
		contactId: '1',
		numbers: ['9588880000'],
		address: '123 E. 456 S.',
		city: 'Some City',
		name: 'Voice Mail',
		avatarUrl: 'https://res.cloudinary.com/stormapp/image/upload/v1568401491/napoleon_djrmp5.png',
		mergeFields: [
			{ id: 'first_name', label: 'First Name', value: 'Voice' },
			{ id: 'last_name', label: 'Last Name', value: 'Mail' },
			{ id: 'email', label: 'Email', value: 'test@test.com' },
		],
	},
	{
		contactId: '3',
		numbers: ['9586660000', '9586660001', '9586660002'],
		address: '123 E. 456 S.',
		city: 'Some City',
		name: 'Ring',
		mergeFields: [
			{ id: 'first_name', label: 'First Name', value: 'Ring' },
			{ id: 'last_name', label: 'Last Name', value: 'Phone' },
			{ id: 'email', label: 'Email', value: 'test@test.com' },
		],
	},
	{
		contactId: '2',
		numbers: ['9587770000', '9587770001'],
		address: '123 E. 456 S.',
		city: 'Some City',
		name: 'Answer',
		mergeFields: [
			{ id: 'first_name', label: 'First Name', value: 'Answer' },
			{ id: 'last_name', label: 'Last Name', value: 'Phone' },
			{ id: 'email', label: 'Email', value: 'test@test.com' },
		],
	},
	{
		contactId: '4',
		numbers: ['9585550000'],
		address: '123 E. 456 S.',
		city: 'Some City',
		name: 'Echo',
		mergeFields: [
			{ id: 'first_name', label: 'First Name', value: 'Echo' },
			{ id: 'last_name', label: 'Last Name', value: 'Phone' },
			{ id: 'email', label: 'Email', value: 'test@test.com' },
		],
	},
	{
		contactId: '5',
		numbers: ['9584440000', '9584440001'],
		address: '123 E. 456 S.',
		city: 'Some City',
		name: 'Hang Up',
		mergeFields: [
			{ id: 'first_name', label: 'First Name', value: 'Hang' },
			{ id: 'last_name', label: 'Last Name', value: 'Up' },
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
