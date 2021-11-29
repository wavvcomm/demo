export type Creds =
	| {
			id: string;
			title?: string;
			vendorId: string;
			apiKey: string;
			groupId?: string;
			email?: string;
			token?: string;
			userId: string;
			server: string;
			active: boolean;
	  }
	| {
			id?: string;
			title?: string;
			vendorId?: string;
			apiKey?: string;
			groupId?: string;
			email?: string;
			token: string;
			userId?: string;
			server: string;
			active?: boolean;
	  }
	| {
			id: string;
			title?: string;
			vendorId: string;
			apiKey: string;
			groupId: string;
			email: string;
			token?: string;
			userId?: string;
			server: string;
			active: boolean;
	  };

export type Contact = {
	contactId: string;
	numbers: string[];
	address?: string;
	city?: string;
	firstName?: string;
	lastName?: string;
	avatarUrl?: string;
	mergeFields?: any[];
	name?: string;
};

export type Action = {
	type: string;
	payload?: any;
};

type Tag = {
	[key: string]: boolean;
};

export type Store = {
	authed: boolean;
	openNote: boolean;
	contactList: Contact[];
	selected: any[];
	skipped: any[];
	unreadMessages: number;
	numberDialing: string | null;
	unreadCounts: any;
	enableClickToCall: boolean;
	showDrawer: boolean;
	showCreds: boolean;
	tags: { [key: string]: Tag };
	notes: any;
	outcomes: any;
	logs: any[];
	credentials: Creds[];
	dncList: any;
	dispatch: (arg0: Action) => void;
};

export type Note = {
	note: string;
	date: string;
	number: string;
};

export type Outcome = {
	date: string;
	number: string;
	duration: number;
	outcome: string;
	human: boolean;
};

export type AddContact = (contact: Contact) => void;
export type RemoveContact = (arg0: { contactId: string; skip?: boolean }) => void;
export type AddRemoveNumber = (arg0: { contactId: string; number: string }) => void;
export type TextNumber = (arg0: { contact?: Contact; number: string; dock?: boolean }) => void;
export type CallNumber = (arg0: { contact: Contact; number: string }) => void;
export type StartRingless = (arg0: { contacts: Contact[] }) => void;
