/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import axios from 'axios';
import {
	Image,
	Button,
	Feed,
	Header,
	Label,
	Grid,
	List,
	Menu,
	Segment,
	Modal,
	Form,
	TextArea,
} from 'semantic-ui-react';
import { formatPhone, rawPhone } from './utils';
import { SERVER, VENDER_USER_ID, VENDOR_ID, APP_ID } from './constants';

const DetailView = ({
	notes,
	recordings,
	outcomes,
	match,
	unreadCounts,
	getContactById,
	stormLoaded,
	setOpen,
	numberDialing,
	enableClickToCall,
	setNotes,
	open,
	tags,
	setTags,
}) => {
	const [activeMain, setActiveMain] = useState('notes');
	const [activeSub, setActiveSub] = useState('messages');
	const [messages, setMessages] = useState([
		{
			id: 'b809f77f-ea6d-45f1-9608-b123b71c2f4b',
			body: 'Ut enim ad minim veniam, quis nostrud exercitation.',
			status: 'RECEIVED',
		},
		{ id: 'c809f742-a234d-45f1-9608-b123b71c2f4b', body: 'quis nostrud exercitation.', status: 'DELIVERED' },
		{
			id: 'c809f742-a234d-45f1-9608-b1223456df4b',
			body:
				'nostrud exercitation. Ut enim ad minim veniam, quis nostrud exercitation. Ut enim ad minim veniam, quis nostrud exercitation.',
			status: 'RECEIVED',
		},
		{
			id: 'bgs4f77f-ea6d-45f1-9608-b123b71c2f4b',
			body:
				'Ad minim veniam, quis nostrud exercitation. nostrud exercitation. Ut enim ad minim veniam, quis nostrud exercitation. Ut enim ad minim veniam. nostrud exercitation. Ut enim ad minim veniam, quis nostrud exercitation. Ut enim ad minim veniam.',
			status: 'DELIVERED',
		},
	]);
	// const [nextPageToken, setNextPageToken] = useState(null);
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
				const contactMessages = data.messages.filter((message) => {
					return contact.numbers.find((number) => rawPhone(number) === rawPhone(message.number));
				});
				if (contactMessages.length > 0) setMessages(contactMessages);
				// setNextPageToken(data.nextPageToken);
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

			<Modal
				onClose={() => {
					setOpen(false);
				}}
				open={open}
				size="mini"
			>
				<Modal.Header>Call Disposition</Modal.Header>
				<Modal.Content>
					<Form>
						<Form.Group grouped>
							<Form.Field
								label="Warm Lead"
								name="Warm Lead"
								control="input"
								type="checkbox"
								checked={tags?.[id]?.['Warm Lead']}
								onChange={({ target }) => {
									const newTags = { ...tags };
									if (!newTags[id]) newTags[id] = {};
									newTags[id][target.name] = target.checked;
									setTags(newTags);
								}}
							/>
							<Form.Field
								label="Follow Up"
								name="Follow Up"
								control="input"
								type="checkbox"
								checked={tags?.[id]?.['Follow Up']}
								onChange={({ target }) => {
									const newTags = { ...tags };
									if (!newTags[id]) newTags[id] = {};
									newTags[id][target.name] = target.checked;
									setTags(newTags);
								}}
							/>
							<Form.Field
								label="Do Not Call"
								name="Do Not Call"
								control="input"
								type="checkbox"
								checked={tags?.[id]?.['Do Not Call']}
								onChange={({ target }) => {
									const newTags = { ...tags };
									if (!newTags[id]) newTags[id] = {};
									newTags[id][target.name] = target.checked;
									setTags(newTags);
								}}
							/>
							<Form.Field
								control={TextArea}
								label="Notes"
								placeholder="How did the call go?"
								value={note}
								onChange={({ target }) => setNote(target.value)}
							/>
						</Form.Group>
					</Form>
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
							if (newNotes[id]) newNotes[id].push({ note, date: Date.now() });
							else newNotes[id] = [{ note, date: Date.now() }];
							setNotes(newNotes);
							setOpen(false);
							window.Storm.continue();
						}}
						positive
					>
						Save
					</Button>
				</Modal.Actions>
			</Modal>
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
	color: received ? 'black' : 'white',
}));

const MessageBubble = styled.div(({ received }) => ({
	maxWidth: 220,
	margin: 5,
	padding: '8px 12px',
	borderRadius: 10,
	background: '#2185D0',
	color: '#fff',
	position: 'relative',

	'&:before': {
		content: '" "',
		width: 0,
		height: 0,
		position: 'absolute',
		borderRight: `8px solid ${received ? '#2185D0' : 'transparent'}`,
		borderLeft: `8px solid ${received ? 'transparent' : '#2185D0'}`,
		borderTop: '8px solid #2185D0',
		borderBottom: '8px solid transparent',
		right: !received && -8,
		left: received && -8,
		top: 0,
	},
}));

export default DetailView;
