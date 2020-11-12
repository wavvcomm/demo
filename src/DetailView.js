/* eslint-disable */
import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import _ from 'lodash';
import { Card, Icon, Image, Button, Feed, Header, Modal, Input } from 'semantic-ui-react';
import { contacts } from './constants';

const DetailView = ({ match, notes, setNotes, outcomes, setOutcomes }) => {
	const [outcome, setOutcome] = useState(null);
	const [note, setNote] = useState('');
	const [open, setOpen] = useState(false);
	const [newNumber, setNumber] = useState('');
	const [name, setName] = useState('');
	const { id } = match.params;
	const contact = contacts.find((item) => item.contactId === id);

	useEffect(() => {
		if (window.Storm) {
			window.Storm.onWaitingForContinue(({ waiting, number, contactId: cId }) => {
				if (waiting) {
					setOpen(true);
					setNumber(number);
					const contactName = contacts.find((item) => item.contactId === cId).name;
					setName(contactName);
				}
			});

			window.Storm.onCallEnded((outcome) => {
				const contactName = contacts.find((item) => item.contactId === outcome.contactId).name;
				const newOutcome = { ...outcome, name: contactName };
				setOutcome(newOutcome);
			});
		}
	}, []);

	useEffect(() => {
		if (outcome) {
			const newOutcomes = [...outcomes, outcome];
			setOutcomes(_.uniq(newOutcomes));
		}
	}, [outcome]);

	const reset = () => {
		setNumber('');
		setName('');
	};

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
			<FeedContainer>
				<Feed>
					<Header as="h3">Call Notes</Header>
					{notes.map(({ note: nte, time, number, name }) => (
						<Feed.Event>
							<Feed.Content>
								<Feed.Summary>
									Note for {name} - {number}
									<Feed.Date>{time}</Feed.Date>
								</Feed.Summary>
								<Feed.Meta>{nte}</Feed.Meta>
							</Feed.Content>
						</Feed.Event>
					))}
				</Feed>
			</FeedContainer>
			<FeedContainer>
				<Feed>
					<Header as="h3">Call Outcomes</Header>
					{outcomes.map(({ number, name, duration, human, outcome }) => (
						<Feed.Event>
							<Feed.Content>
								<Feed.Summary>
									Outcome for {name} - {number}
									<Feed.Date>Duration of call {duration}</Feed.Date>
								</Feed.Summary>
								<Feed.Meta>
									Outcome - {outcome}
									{human ? ', answered' : ''}
								</Feed.Meta>
							</Feed.Content>
						</Feed.Event>
					))}
				</Feed>
			</FeedContainer>
			<Modal
				onClose={() => {
					setOpen(false);
					reset();
				}}
				open={open}
				size="mini"
			>
				<Modal.Header>Add Note</Modal.Header>
				<Modal.Content>
					<Input value={note} onChange={({ target }) => setNote(target.value)} />
				</Modal.Content>
				<Modal.Actions>
					<Button
						onClick={() => {
							setOpen(false);
							reset();
						}}
					>
						Cancel
					</Button>
					<Button
						onClick={() => {
							const newNotes = [...notes, { note, time: 'just now', number: newNumber, name }];
							setNotes(newNotes);
							setOpen(false);
							reset();
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
});

const FeedContainer = styled.div({
	width: 400,
	borderLeft: '1px solid black',
	padding: '5px 10px',
});

const Number = styled.div({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	marginBottom: 10,
	width: '70%',
});

export default DetailView;
