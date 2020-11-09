import React from 'react';
import { contacts } from './constants';

const DetailView = ({ match }) => {
	const { id } = match.params;
	const contact = contacts.find((item) => item.id.toString() === id);
	return (
		<div>
			<p>{contact?.title || 'Test'}</p>
		</div>
	);
};

export default DetailView;
