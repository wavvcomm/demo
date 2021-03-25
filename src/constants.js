export const contacts = [
	{
		contactId: '1',
		numbers: ['9588880000'],
		address: '123 E. 456 S.',
		city: 'Some City',
		firstName: 'Victor',
		lastName: 'Voicemail',
		avatarUrl: 'https://res.cloudinary.com/stormapp/image/upload/v1605635973/2_bt1i2a.png',
		mergeFields: [{ id: 'email', label: 'Email', value: 'test@test.com' }],
	},
	{
		contactId: '3',
		numbers: ['9586660000', '9586660001', '9586660002'],
		address: '123 E. 456 S.',
		city: 'Some City',
		firstName: 'Rachel',
		lastName: 'Ring',
		avatarUrl: 'https://res.cloudinary.com/stormapp/image/upload/v1605635949/3_rqjcbi.png',
		mergeFields: [{ id: 'email', label: 'Email', value: 'test@test.com' }],
	},
	{
		contactId: '2',
		numbers: ['9587770000', '9587770001'],
		address: '123 E. 456 S.',
		city: 'Some City',
		firstName: 'Alice',
		lastName: 'Answer',
		avatarUrl: 'https://res.cloudinary.com/stormapp/image/upload/v1605635993/1_mfsioi.png',
		mergeFields: [{ id: 'email', label: 'Email', value: 'test@test.com' }],
	},
	{
		contactId: '4',
		numbers: ['9585550000'],
		address: '123 E. 456 S.',
		city: 'Some City',
		firstName: 'Eric',
		lastName: 'Echo',
		avatarUrl: 'https://res.cloudinary.com/stormapp/image/upload/v1605636272/crop-2020-11-17_1_awpief.jpg',
		mergeFields: [{ id: 'email', label: 'Email', value: 'test@test.com' }],
	},
	{
		contactId: '5',
		numbers: ['9584440000', '9584440001'],
		address: '123 E. 456 S.',
		city: 'Some City',
		firstName: 'Hank',
		lastName: 'Hangup',
		avatarUrl: 'https://res.cloudinary.com/stormapp/image/upload/v1605636306/crop-2020-11-17_chpw7v.jpg',
		mergeFields: [{ id: 'email', label: 'Email', value: 'test@test.com' }],
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
