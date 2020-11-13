/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Card, Icon, Image, Button, Feed, Header, Modal, Input, Label } from 'semantic-ui-react';
import { formatPhone } from './utils';

const DetailView = ({
	notes,
	setNotes,
	recordings,
	outcomes,
	match,
	unreadCounts,
	getContactById,
	stormLoaded,
	open,
	setOpen,
	numberDialing,
	enableClickToCall,
}) => {
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
								{formatPhone(number)}
								<Button
									icon="phone"
									size="mini"
									disabled={!enableClickToCall}
									onClick={() => window.Storm.callPhone({ number })}
								/>
								<div style={{ position: 'relative' }}>
									<Button
										icon="comment alternate"
										size="mini"
										onClick={() => window.Storm.openMessengerThread({ contact, number, dock: true })}
									/>
									{unreadCounts[number] ? (
										<Label color="red" size="tiny" circular floating content={unreadCounts[number]} />
									) : null}
								</div>
							</Number>
						);
					})}
				</Card.Content>
			</Card>
			<FeedContainer>
				<Feed>
					<Header as="h3">Call Notes</Header>
					{notes[id]?.map(({ note: nte, time }) => (
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
					{outcomes[id]?.map(({ number, duration, human, outcome }) => (
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
					{recordings[id]?.map(({ id: recordingId, phone, seconds, date, url }) => (
						<Feed.Event key={recordingId}>
							<Feed.Content>
								<Feed.Summary>
									{phone}
									<Feed.Date>Duration of call {seconds}</Feed.Date>
								</Feed.Summary>
								<Feed.Meta>{date}</Feed.Meta>
								<audio controls src={url}>
									<track kind="captions" />
								</audio>
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
							const newNotes = { ...notes };
							if (newNotes[id]) newNotes[id].push({ note, time: Date.now() });
							else newNotes[id] = [{ note, time: Date.now() }];
							setNotes(newNotes);
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
	width: '80%',
	border: dialing && '1px solid #2185D0',
	borderRadius: 5,
}));

export default DetailView;
