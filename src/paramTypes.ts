export type CREDS =
	| {
			id: string;
			title?: string;
			vendorId: string;
			apiKey: string;
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
			token: string;
			userId?: string;
			server: string;
			active?: boolean;
	  };

export type CONTACT = {
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

export type ACTION = {
	type: string;
	payload?: any;
};

type TAG = {
	[key: string]: boolean;
};

export type STORE = {
	authed: boolean;
	openNote: boolean;
	contactList: CONTACT[];
	selected: any[];
	skipped: any[];
	unreadMessages: number;
	numberDialing: string | null;
	unreadCounts: any;
	enableClickToCall: boolean;
	showDrawer: boolean;
	showCreds: boolean;
	tags: { [key: string]: TAG };
	notes: any;
	outcomes: any;
	logs: any[];
	credentials: CREDS[];
	dncList: any;
	dispatch: (arg0: ACTION) => void;
};
