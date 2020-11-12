import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Card, Icon, Image, Button, Feed, Header, Modal, Input } from 'semantic-ui-react';
import { contacts } from './constants';

const DetailView = ({ match }) => {
	const [notes, setNotes] = useState([{ note: 'note...', time: '2 weeks ago', user: 'You', number: '(555) 555-5555' }]);
	const [note, setNote] = useState('');
	const [open, setOpen] = useState(false);
	const [newNumber, setNumber] = useState('');
	const { id } = match.params;
	const contact = contacts.find((item) => item.contactId === id);

	useEffect(() => {
		if (window.Storm) {
			window.Storm.onWaitingForContinue(({ waiting, number }) => {
				if (waiting) {
					setOpen(true);
					setNumber(number);
				}
			});
		}
	}, []);

	return (
		<Container>
			<Card>
				{contact.avatarUrl && <Image src={contact.avatarUrl} wrapped ui={false} />}
				<Card.Content>
					<Card.Header>{contact.name}</Card.Header>
					<Card.Meta>
						<span>
							{contact.address}, {contact.city}
						</span>
					</Card.Meta>
					<Card.Description>
						<Button onClick={() => window.Storm.openMessenger({ contact, contactView: true })}>
							<Icon name="comment alternate" size="large" /> Contact Message View
						</Button>
					</Card.Description>
				</Card.Content>
				<Card.Content extra>
					{contact.numbers.map((number) => {
						return (
							<Number>
								{number}
								<Button icon="phone" size="mini" onClick={() => window.Storm.callPhone({ number })} />
								<Button
									icon="comment alternate"
									size="mini"
									onClick={() => window.Storm.openMessengerThread({ contact, number, dock: true })}
								/>
							</Number>
						);
					})}
				</Card.Content>
			</Card>
			<Feed>
				<Header as="h3">Call Notes</Header>
				{notes.map(({ user, note: nte, time, number }) => (
					<Feed.Event>
						<Feed.Content>
							<Feed.Summary>
								<Feed.User>{user}</Feed.User> added a note for {number}
								<Feed.Date>{time}</Feed.Date>
							</Feed.Summary>
							<Feed.Meta>{nte}</Feed.Meta>
						</Feed.Content>
					</Feed.Event>
				))}
			</Feed>
			<Modal onClose={() => {}} open={open} size="mini">
				<Modal.Header>Add Note</Modal.Header>
				<Modal.Content>
					<Input value={note} onChange={({ target }) => setNote(target.value)} />
				</Modal.Content>
				<Modal.Actions>
					<Button
						onClick={() => {
							setOpen(false);
						}}
					>
						Cancel
					</Button>
					<Button
						onClick={() => {
							const newNotes = [...notes, { note, user: 'You', time: 'just now', number: newNumber }];
							setNotes(newNotes);
							setOpen(false);
							setNumber('');
							window.Storm.continue();
						}}
						positive
					>
						Done
					</Button>
				</Modal.Actions>
			</Modal>
		</Container>
	);
};

const Container = styled.div({
	display: 'flex',
	justifyContent: 'space-between',
	maxWidth: 650,
});

const Number = styled.div({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	marginBottom: 10,
	width: '70%',
});

export default DetailView;
