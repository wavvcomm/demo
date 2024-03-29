/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import styled from '@emotion/styled';
import { callPhone, addDncNumber, removeDncNumber, addWaitingForContinueListener } from '@wavv/dialer';
import { openMessengerThread } from '@wavv/messenger';
import { Image, Button, Dropdown, Feed, Header, Label, Grid, List, Menu, Popup } from 'semantic-ui-react';
import { formatPhone, rawPhone, debugLogger } from './utils';
import CallDispositionModal from './CallDispositionModal';
import { store } from './store';
import { SET_OPEN_NOTE } from './actionTypes';
import { Contact, Note, Outcome } from './paramTypes';

const DetailView = ({
	match,
	getContactById,
}: RouteComponentProps<{ id: string }> & { getContactById: (id: string) => Contact | undefined }) => {
	const { notes, outcomes, unreadCounts, authed, tags, enableClickToCall, numberDialing, dispatch, dncList } =
		useContext(store);
	const [activeMain, setActiveMain] = useState('notes');
	const [note, setNote] = useState('');
	const { id } = match.params;
	const contact = getContactById(id);

	useEffect(() => {
		const waitingForContinueListener = addWaitingForContinueListener(({ waiting }: { waiting: boolean }) => {
			if (waiting) dispatch({ type: SET_OPEN_NOTE, payload: true });
		});
		return () => {
			waitingForContinueListener.remove();
		};
	}, []);

	const textNumber = ({ number, dock }: { number: string; dock?: boolean }) =>
		openMessengerThread({ contact, number, contactView: true, dock })
			.then(() =>
				debugLogger({
					name: 'openMessengerThread',
					dispatch,
				})
			)
			.catch(() =>
				debugLogger({
					name: 'openMessengerThread Failed',
					dispatch,
				})
			);

	if (!contact) return <div>No contact found with that id</div>;

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
							{contact?.name || `${contact?.firstName} ${contact?.lastName}`}
						</Header>
						<List>
							{contact.address && contact.city && (
								<List.Item
									className="contactAddress"
									icon="marker"
									content={`${contact.address} ${contact.city}`}
								/>
							)}
							{contact.numbers.map((number: string) => {
								const dncNumber = !!dncList[rawPhone(number)];
								const removable = dncList[rawPhone(number)]?.removable;
								return (
									<Number
										key={number}
										dialing={formatPhone(numberDialing || '') === formatPhone(number)}
										dncNumber={dncNumber}
									>
										{formatPhone(number)}
										<Popup
											content="Call Number"
											position="top center"
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
											position="top center"
											trigger={
												<div style={{ position: 'relative' }}>
													<Dropdown
														trigger={
															<Button
																icon="comment alternate"
																size="mini"
																style={{ margin: 3 }}
																disabled={!authed}
															/>
														}
														icon={null}
													>
														<Dropdown.Menu>
															<Dropdown.Item
																onClick={() => textNumber({ number, dock: false })}
															>
																Modal
															</Dropdown.Item>
															<Dropdown.Item
																onClick={() => textNumber({ number, dock: true })}
															>
																Dock
															</Dropdown.Item>
														</Dropdown.Menu>
													</Dropdown>
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
											position="top center"
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
													color={dncNumber ? 'red' : undefined}
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
							{notes[id]?.map(({ note: nte, date }: Note) => (
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
							{outcomes[id]?.map(({ number, duration, human, outcome, date }: Outcome) => (
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

type NumberProps = {
	dialing?: boolean;
	dncNumber?: boolean;
};

const Number = styled.div<NumberProps>(({ dialing, dncNumber }) => ({
	display: 'flex',
	width: 'fit-content',
	alignItems: 'center',
	marginTop: 12,
	paddingLeft: 4,
	border: dialing ? '1px solid #2185D0' : undefined,
	borderRadius: 5,
	textDecoration: dncNumber ? 'line-through' : undefined,
}));

export default DetailView;
