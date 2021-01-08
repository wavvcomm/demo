/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react';
import styled from '@emotion/styled';
import { addDncNumber, removeDncNumber } from '@wavv/core';
import { callPhone, addWaitingForContinueListener } from '@wavv/dialer';
import { openMessengerThread } from '@wavv/messenger';
import { Image, Button, Feed, Header, Label, Grid, List, Menu, Popup } from 'semantic-ui-react';
import { formatPhone, rawPhone, debugLogger } from './utils';
import CallDispositionModal from './CallDispositionModal';
import { store } from './store';
import { SET_OPEN_NOTE } from './types';

const DetailView = ({ match, getContactById }) => {
	const {
		notes,
		outcomes,
		unreadCounts,
		authed,
		tags,
		enableClickToCall,
		numberDialing,
		dispatch,
		dncList,
	} = useContext(store);
	const [activeMain, setActiveMain] = useState('notes');
	const [note, setNote] = useState('');
	const { id } = match.params;
	const contact = getContactById(id);

	useEffect(() => {
		const waitingForContinueListener = addWaitingForContinueListener(({ waiting }) => {
			if (waiting) dispatch({ type: SET_OPEN_NOTE, payload: true });
		});
		return () => {
			waitingForContinueListener.remove();
		};
	}, []);

	return (
		<Container>
			<HeaderContainer>
				<Grid>
					<Grid.Column width={3} style={{ minWidth: 175 }}>
						<Image
							size="medium"
							src={
								contact?.avatarUrl ||
								'https://res.cloudinary.com/stormapp/image/upload/v1567524915/avatar_uwqncn.png'
							}
							className="profilePicture"
						/>
					</Grid.Column>
					<Grid.Column width={10}>
						<Header as="h3" className="contactName">
							{contact.name}
						</Header>
						<List>
							{contact.address && contact.city && (
								<List.Item
									className="contactAddress"
									icon="marker"
									content={`${contact.address} ${contact.city}`}
								/>
							)}
							{contact.numbers.map((number) => {
								const dncNumber = !!dncList[rawPhone(number)];
								const removable = dncList[rawPhone(number)]?.removable;
								return (
									<Number
										key={number}
										dialing={formatPhone(numberDialing) === formatPhone(number)}
										dncNumber={dncNumber}
									>
										{formatPhone(number)}
										<Popup
											content="Call Number"
											position="bottom center"
											trigger={
												<Button
													icon="phone"
													size="mini"
													style={{ margin: '3px 3px 3px 6px' }}
													disabled={!enableClickToCall || !authed}
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
														disabled={!authed}
														onClick={() =>
															openMessengerThread({ contact, number, contactView: true })
														}
													/>
													{unreadCounts[number] ? (
														<Label
															color="red"
															size="tiny"
															circular
															floating
															content={unreadCounts[number]}
														/>
													) : null}
												</div>
											}
										/>
										<Popup
											content={dncNumber ? 'Remove from Do Not Call' : 'Do Not Call'}
											position="bottom center"
											trigger={
												<Button
													onClick={() => {
														const methodName = dncNumber
															? 'removeDncNumber'
															: 'addDncNumber';
														const dncFunc = dncNumber ? removeDncNumber : addDncNumber;
														dncFunc({ number })
															.then(() => debugLogger({ name: methodName, dispatch }))
															.catch(() =>
																debugLogger({ name: `${methodName} failed`, dispatch })
															);
													}}
													disabled={dncNumber && !removable}
													icon="exclamation triangle"
													size="mini"
													color={dncNumber ? 'red' : null}
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
				<Menu secondary>
					<Menu.Item
						name="Notes"
						active={activeMain === 'notes'}
						onClick={() => {
							setActiveMain('notes');
						}}
					/>
					<Menu.Item
						name="Call Outcomes"
						active={activeMain === 'callOutcomes'}
						onClick={() => {
							setActiveMain('callOutcomes');
						}}
					/>
				</Menu>
				{activeMain === 'notes' ? (
					<FeedContainer>
						<Feed>
							{notes[id]?.map(({ note: nte, date }) => (
								<Feed.Event key={date} style={{ marginBottom: 20 }}>
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
	padding: '5px 10px',
	width: '75%',
});

const MainContainer = styled.div({
	padding: 20,
	marginTop: 20,
});

const Number = styled.div(({ dialing, dncNumber }) => ({
	display: 'flex',
	width: 'fit-content',
	alignItems: 'center',
	marginTop: 12,
	paddingLeft: 4,
	border: dialing && '1px solid #2185D0',
	borderRadius: 5,
	textDecoration: dncNumber && 'line-through',
}));

export default DetailView;
