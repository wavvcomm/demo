/* eslint-disable */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import axios from 'axios';
import { Image, Button, Feed, Header, Label, Grid, List, Menu, Segment } from 'semantic-ui-react';
import { formatPhone } from './utils';
import { SERVER, VENDER_USER_ID, VENDOR_ID, APP_ID } from './constants';

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
	const [activeMain, setActiveMain] = useState('notes');
	const [activeSub, setActiveSub] = useState('messages');
	const [messages, setMessages] = useState([]);
	const [nextPageToken, setNextPageToken] = useState(null);
	const [note, setNote] = useState('');
	const { id } = match.params;
	const contact = getContactById(id);

	const getMessages = (token) => {
		axios
			.get(`http://${SERVER}:7073/api/customers/${VENDER_USER_ID}/messages`, {
				params: {
					limit: 15,
					token,
				},
				auth: {
					username: VENDOR_ID,
					password: APP_ID,
				},
			})
			.then(({ data }) => {
				setMessages([...messages, ...data.messages]);
				setNextPageToken(data.nextPageToken);
			})
			.catch((err) => console.log({ err }));
	};

	useEffect(() => {
		getMessages();
	}, []);

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
			<HeaderContainer>
				<Grid>
					<Grid.Column width={3}>
						<Image
							src={
								contact.avatarUrl || 'https://res.cloudinary.com/stormapp/image/upload/v1567524915/avatar_uwqncn.png'
							}
						/>
					</Grid.Column>
					<Grid.Column width={10}>
						<Header as="h3">{contact.name}</Header>
						<List>
							<List.Item icon="marker" content={`${contact.address} ${contact.city}`} />
							{contact.numbers.map((number) => {
								return (
									<Number key={number} dialing={formatPhone(numberDialing) === formatPhone(number)}>
										{formatPhone(number)}
										<Button
											icon="phone"
											size="mini"
											style={{ margin: '3px 3px 3px 6px' }}
											disabled={!enableClickToCall}
											onClick={() => window.Storm.callPhone({ number })}
										/>
										<div style={{ position: 'relative' }}>
											<Button
												icon="comment alternate"
												size="mini"
												style={{ margin: 3 }}
												onClick={() => window.Storm.openMessengerThread({ contact, number, dock: true })}
											/>
											{unreadCounts[number] ? (
												<Label color="red" size="tiny" circular floating content={unreadCounts[number]} />
											) : null}
										</div>
									</Number>
								);
							})}
						</List>
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
									{notes[id]?.map(({ note: nte, time }) => (
										<Feed.Event key={time}>
											<Feed.Content>
												<Feed.Summary>{time}</Feed.Summary>
												<Feed.Meta>{nte}</Feed.Meta>
											</Feed.Content>
										</Feed.Event>
									))}
								</Feed>
							</FeedContainer>
						) : (
							<FeedContainer>
								<Feed>
									{recordings[id]?.map(({ id, date, url }) => (
										<Feed.Event key={id}>
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
						<Segment attached="bottom" placeholder>
							{activeSub === 'messages' ? (
								<MessagesContainer>
									{messages?.map(({ id, number, body, date, status }) => (
										<Message received={status === 'RECEIVED'} key={id}>
											<MessageBubble received={status === 'RECEIVED'}>{body}</MessageBubble>
										</Message>
									))}
								</MessagesContainer>
							) : (
								<FeedContainer>
									<Feed>
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
							)}
						</Segment>
					</Grid.Column>
				</Grid>
			</MainContainer>
		</Container>
		// 	<Modal
		// 		onClose={() => {
		// 			setOpen(false);
		// 		}}
		// 		open={open}
		// 		size="mini"
		// 	>
		// 		<Modal.Header>Add Note</Modal.Header>
		// 		<Modal.Content>
		// 			<Input value={note} onChange={({ target }) => setNote(target.value)} />
		// 		</Modal.Content>
		// 		<Modal.Actions>
		// 			<Button
		// 				onClick={() => {
		// 					setOpen(false);
		// 				}}
		// 			>
		// 				Cancel
		// 			</Button>
		// 			<Button
		// 				onClick={() => {
		// 					const newNotes = { ...notes };
		// 					if (newNotes[id]) newNotes[id].push({ note, time: Date.now() });
		// 					else newNotes[id] = [{ note, time: Date.now() }];
		// 					setNotes(newNotes);
		// 					setOpen(false);
		// 					window.Storm.continue();
		// 				}}
		// 				positive
		// 			>
		// 				Done
		// 			</Button>
		// 		</Modal.Actions>
		// 	</Modal>
		// </Container>
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

const Number = styled.div(({ dialing }) => ({
	display: 'flex',
	alignItems: 'center',
	marginTop: 12,
	marginLeft: 20,
	width: '80%',
	border: dialing && '1px solid #2185D0',
	borderRadius: 5,
}));

const MessagesContainer = styled.div({});

const Message = styled.div(({ received }) => ({
	display: 'flex',
	justifyContent: received ? 'flex-start' : 'flex-end',
	color: received ? 'black' : 'white',
}));

const MessageBubble = styled.div(({ received }) => ({
	border: '1px solid blue',
	borderRadius: 5,
	padding: 3,
	margin: '5px 0',
	backgroundColor: received ? null : 'blue',
}));

export default DetailView;
