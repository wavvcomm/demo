/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react';
import styled from '@emotion/styled';
import axios from 'axios';
import { Image, Button, Feed, Header, Label, Grid, List, Menu, Segment, Popup } from 'semantic-ui-react';
import { callPhone, addDncNumber, removeDncNumber, addWaitingForContinueListener } from '@wavv/dialer';
import { openMessengerThread } from '@wavv/messenger';
import { formatPhone, rawPhone } from './utils';
import { exampleMessages } from './constants';
import CallDispositionModal from './CallDispositionModal';
import { store } from './store';
import { SET_OPEN_NOTE, SET_DNC_LIST } from './types';

const DetailView = ({ match, getContactById }) => {
	const {
		notes,
		recordings,
		outcomes,
		unreadCounts,
		stormLoaded,
		tags,
		enableClickToCall,
		numberDialing,
		dispatch,
		dncList,
		credentials,
	} = useContext(store);
	const [activeMain, setActiveMain] = useState('notes');
	const [activeSub, setActiveSub] = useState('messages');
	const [messages, setMessages] = useState(exampleMessages);
	// const [nextPageToken, setNextPageToken] = useState(null);
	const [note, setNote] = useState('');
	const { id } = match.params;
	const contact = getContactById(id);

	const getMessages = (creds) => {
		const { server, userId, vendorId, apiKey } = creds;
		axios
			.get(`https://${server}.stormapp.com/api/customers/${userId}/messages`, {
				params: {
					limit: 15,
				},
				auth: {
					username: vendorId,
					password: apiKey,
				},
			})
			.then(({ data }) => {
				const contactMessages = data.messages.filter((message) => {
					return contact.numbers.find((number) => rawPhone(number) === rawPhone(message.number));
				});
				if (contactMessages.length > 0) setMessages(contactMessages);
				// TODO: setNextPageToken(data.nextPageToken);
			});
	};

	useEffect(() => {
		if (stormLoaded) {
			const creds = credentials.find((cred) => cred.active);
			getMessages(creds);
		}
	}, []);

	useEffect(() => {
		const waitingForContinueListener = addWaitingForContinueListener(({ waiting }) => {
			if (waiting) dispatch({ type: SET_OPEN_NOTE, payload: true });
		});
		return () => {
			waitingForContinueListener.remove();
		};
	}, [id]);

	const handleDnc = (isDncNumber, number) => {
		if (isDncNumber) removeDncNumber({ number });
		else addDncNumber({ number });
		let newDncList = [...dncList];
		if (isDncNumber) newDncList = newDncList.filter((num) => num !== rawPhone(number));
		else newDncList.push(rawPhone(number));
		dispatch({ type: SET_DNC_LIST, payload: newDncList });
	};

	return (
		<Container>
			<HeaderContainer>
				<Grid>
					<Grid.Column width={3}>
						<Image
							src={
								contact?.avatarUrl || 'https://res.cloudinary.com/stormapp/image/upload/v1567524915/avatar_uwqncn.png'
							}
						/>
					</Grid.Column>
					<Grid.Column width={10}>
						<Header as="h3">{contact.name}</Header>
						<List>
							{contact.address && contact.city && (
								<List.Item icon="marker" content={`${contact.address} ${contact.city}`} />
							)}
							{contact.numbers.map((number) => {
								const isDncNumber = dncList.includes(rawPhone(number));
								return (
									<Number key={number} dialing={formatPhone(numberDialing) === formatPhone(number)}>
										<span style={{ textDecoration: isDncNumber && 'line-through' }}>{formatPhone(number)}</span>
										<Popup
											content="Call Number"
											position="bottom center"
											trigger={
												<Button
													icon="phone"
													size="mini"
													style={{ margin: '3px 3px 3px 6px' }}
													disabled={!enableClickToCall || isDncNumber || !stormLoaded}
													onClick={() => callPhone({ number })}
												/>
											}
										/>

										<Popup
											content="Message Number"
											position="bottom center"
											trigger={
												<div style={{ position: 'relative' }}>
													<Button
														icon="comment alternate"
														size="mini"
														style={{ margin: 3 }}
														disabled={isDncNumber || !stormLoaded}
														onClick={() => openMessengerThread({ contact, number, dock: true })}
													/>
													{unreadCounts[number] ? (
														<Label color="red" size="tiny" circular floating content={unreadCounts[number]} />
													) : null}
												</div>
											}
										/>

										<Popup
											content={isDncNumber ? 'Remove from DNC' : 'Do Not Call'}
											position="bottom center"
											trigger={
												<Button
													onClick={() => handleDnc(isDncNumber, number)}
													disabled={!stormLoaded}
													icon="exclamation triangle"
													size="mini"
													color={isDncNumber ? 'red' : null}
													style={{ margin: 3 }}
												/>
											}
										/>
									</Number>
								);
							})}
						</List>
						<div>
							{tags?.[id]?.['Warm Lead'] && (
								<Label as="h6" tag color="blue" style={{ marginRight: 7 }}>
									Warm Lead
								</Label>
							)}
							{tags?.[id]?.['Follow Up'] && (
								<Label as="h6" tag color="teal" style={{ marginRight: 7 }}>
									Follow Up
								</Label>
							)}
							{tags?.[id]?.['Do Not Call'] && (
								<Label as="h6" tag color="red">
									Do Not Call
								</Label>
							)}
						</div>
					</Grid.Column>
				</Grid>
			</HeaderContainer>
			<MainContainer>
				<Grid>
					<Grid.Column width={10}>
						<Menu secondary>
							<Menu.Item
								name="Notes"
								active={activeMain === 'notes'}
								onClick={() => {
									setActiveMain('notes');
								}}
							/>
							<Menu.Item
								name="Recordings"
								active={activeMain === 'recordings'}
								onClick={() => {
									setActiveMain('recordings');
								}}
							/>
						</Menu>
						{activeMain === 'notes' ? (
							<FeedContainer>
								<Feed>
									{notes[id]?.map(({ note: nte, date }) => (
										<Feed.Event key={date} style={{ width: 500, marginBottom: 20 }}>
											<Feed.Content>
												<Feed.Summary>{new Date(date).toLocaleDateString('en-US')}</Feed.Summary>
												<Feed.Extra>{nte}</Feed.Extra>
											</Feed.Content>
										</Feed.Event>
									))}
								</Feed>
							</FeedContainer>
						) : (
							<FeedContainer>
								<Feed>
									{recordings[id]?.map(({ id: recordingId, date, url }) => (
										<Feed.Event key={recordingId}>
											<Feed.Content>
												<Feed.Summary>{new Date(date).toLocaleDateString('en-US')}</Feed.Summary>
												<audio controls src={url} style={{ marginTop: 10 }}>
													<track kind="captions" />
												</audio>
											</Feed.Content>
										</Feed.Event>
									))}
								</Feed>
							</FeedContainer>
						)}
					</Grid.Column>
					<Grid.Column width={6}>
						<Menu tabular attached="top">
							<Menu.Item
								name="Messages History"
								active={activeSub === 'messages'}
								onClick={() => {
									setActiveSub('messages');
								}}
							/>
							<Menu.Item
								name="Call Outcomes"
								active={activeSub === 'calls'}
								onClick={() => {
									setActiveSub('calls');
								}}
							/>
						</Menu>
						<Segment attached="bottom" placeholder style={{ justifyContent: 'flex-start' }}>
							{activeSub === 'messages' ? (
								<MessagesContainer>
									{messages?.map(({ id: messageId, body, status }) => (
										<Message received={status === 'RECEIVED'} key={messageId}>
											<MessageBubble received={status === 'RECEIVED'}>{body}</MessageBubble>
										</Message>
									))}
								</MessagesContainer>
							) : (
								<FeedContainer>
									<Feed>
										{outcomes[id]?.map(({ number, duration, human, outcome, date }) => (
											<Feed.Event key={`${number} - ${duration} - ${outcome}`} style={{ marginBottom: 15 }}>
												<Feed.Content>
													<Feed.Summary>{new Date(date).toLocaleDateString('en-US')}</Feed.Summary>
													<Feed.Extra>
														{outcome} {human ? '- human answered' : ''}
													</Feed.Extra>
												</Feed.Content>
											</Feed.Event>
										))}
									</Feed>
								</FeedContainer>
							)}
						</Segment>
					</Grid.Column>
				</Grid>
			</MainContainer>
			<CallDispositionModal contactId={id} note={note} setNote={setNote} />
		</Container>
	);
};

const Container = styled.div({});

const HeaderContainer = styled.div({
	borderBottom: '1px solid #EAEAEA',
	padding: 20,
});

const FeedContainer = styled.div({
	width: 270,
	padding: '5px 10px',
});

const MainContainer = styled.div({
	padding: 20,
	marginTop: 20,
});

const Number = styled.div(({ received }) => ({
	display: 'flex',
	width: 'fit-content',
	alignItems: 'center',
	marginTop: 12,
	paddingLeft: 4,
	border: received && '1px solid #2185D0',
	borderRadius: 5,
}));

const MessagesContainer = styled.div({});

const Message = styled.div(({ received }) => ({
	display: 'flex',
	justifyContent: received ? 'flex-start' : 'flex-end',
	color: received ? '#000' : '#fff',
}));

const MessageBubble = styled.div(({ received }) => {
	const textColor = received ? '#000' : '#fff';
	const bubbleColor = received ? '#fff' : '#2185D0';

	return {
		maxWidth: 220,
		margin: 5,
		padding: '8px 12px',
		borderRadius: 10,
		background: bubbleColor,
		color: textColor,
		position: 'relative',

		'&:before': {
			content: '" "',
			width: 0,
			height: 0,
			position: 'absolute',
			borderRight: `8px solid ${received ? bubbleColor : 'transparent'}`,
			borderLeft: `8px solid ${received ? 'transparent' : bubbleColor}`,
			borderTop: `8px solid ${bubbleColor}`,
			borderBottom: '8px solid transparent',
			right: !received && -8,
			left: received && -8,
			top: 0,
		},
	};
});

export default DetailView;
