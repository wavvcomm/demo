/* eslint-disable */
import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import _ from 'lodash';
import { Card, Icon, Image, Button, Feed, Header, Modal, Input } from 'semantic-ui-react';
import { formatPhone } from './utils';

const DetailView = ({ contactList, setContacts, match, getContactById, stormLoaded, open, setOpen, numberDialing }) => {
	const [note, setNote] = useState('');
	const { id } = match.params;
	const contact = getContactById(id);

	useEffect(() => {
		if (stormLoaded) {
			window.Storm.onWaitingForContinue(({ waiting }) => {
				if (waiting) {
					setOpen(true);
				}
			});
		}
	}, [stormLoaded]);

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
							<Number key={number} dialing={formatPhone(numberDialing) === formatPhone(number)}>
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
					{contact.notes.map(({ note: nte, time }) => (
						<Feed.Event key={time}>
							<Feed.Content>
								<Feed.Summary>
									Note
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
					{contact.callOutcomes.map(({ number, duration, human, outcome }) => (
						<Feed.Event key={`${number} - ${duration} - ${outcome}`}>
							<Feed.Content>
								<Feed.Summary>
									{number}
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
			<FeedContainer>
				<Feed>
					<Header as="h3">Call Recordings</Header>
					{contact.callRecordings.map(({ id, phone, seconds, date, url }) => (
						<Feed.Event key={id}>
							<Feed.Content>
								<Feed.Summary>
									{phone}
									<Feed.Date>Duration of call {seconds}</Feed.Date>
								</Feed.Summary>
								<Feed.Meta>{date}</Feed.Meta>
								<audio controls src={url} />
							</Feed.Content>
						</Feed.Event>
					))}
				</Feed>
			</FeedContainer>
			<Modal
				onClose={() => {
					setOpen(false);
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
						}}
					>
						Cancel
					</Button>
					<Button
						onClick={() => {
							const newNotes = [...contact.notes, { note, time: Date.now() }];
							const updatedContacts = contactList.map((item) => {
								if (item.contactId === id) {
									item.notes = newNotes;
									return item;
								}
								return item;
							});
							setContacts(updatedContacts);
							setOpen(false);
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
	width: 270,
	borderLeft: '1px solid black',
	padding: '5px 10px',
});

const Number = styled.div(({ dialing }) => ({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	padding: '3px 1px 3px 3px',
	marginBottom: 10,
	width: '70%',
	border: dialing && '1px solid #2185D0',
	borderRadius: 5,
}));

export default DetailView;
