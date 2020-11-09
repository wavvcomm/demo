import React from 'react';
import { contacts } from './constants';

const DetailView = ({ match }) => {
	const { id } = match.params;
	const contact = contacts.find((item) => item.contactId === id);
	return (
		<div>
			<p>{contact?.name}</p>
		</div>
	);
};

export default DetailView;
