import React, { useContext, useState } from 'react';
import styled from '@emotion/styled';
import { useHistory } from 'react-router-dom';
import { Modal, Form, Button, Item, Popup, Message, Radio, Header } from 'semantic-ui-react';
import { v4 as uuid } from 'uuid';
import { store } from './store';
import { ADD_UPDATE_CREDENTIALS, REMOVE_CREDENTIALS, TOGGLE_CREDENTIALS } from './actionTypes';
import { Creds } from './paramTypes';

type Props = {
	auth: (creds: Creds) => void;
};

const CredentialModal = ({ auth }: Props) => {
	const [open, setOpen] = useState(false);
	const { credentials, dispatch, showCreds, authed } = useContext(store);
	const [showForm, setShowForm] = useState(!credentials.length);
	const [formError, setFormError] = useState(false);
	const [newCredentials, setNewCredentials] = useState<Creds>({
		title: '',
		id: '',
		userId: '',
		groupId: '',
		vendorId: '',
		apiKey: '',
		server: '',
		active: false,
	});
	const [reconnectId, setReconnectId] = useState('');
	const history = useHistory();

	const handleCheckbox = (id: string) => {
		const activeCreds = credentials.find((cred: Creds) => cred.active);
		const newCreds = credentials.find((cred: Creds) => cred.id === id);

		if (authed || activeCreds?.server !== newCreds?.server) {
			setOpen(true);
			setReconnectId(id);
		} else {
			dispatch({ type: ADD_UPDATE_CREDENTIALS, payload: { ...newCreds, active: true } });
		}
	};

	const handleCreds = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		const newCreds = { ...newCredentials };
		// @ts-ignore
		newCreds[name] = value;
		setNewCredentials(newCreds);
	};

	const reset = () => {
		setNewCredentials({
			title: '',
			id: '',
			userId: '',
			vendorId: '',
			apiKey: '',
			server: '',
			groupId: '',
			active: false,
		});
		setShowForm(false);
		setFormError(false);
		setReconnectId('');
	};

	const handleSubmit = () => {
		const { userId, vendorId, apiKey, server } = newCredentials;
		if (!userId || !vendorId || !apiKey || !server) {
			setFormError(true);
		} else {
			const payload = { ...newCredentials };
			if (!payload.id) payload.id = uuid();
			dispatch({ type: ADD_UPDATE_CREDENTIALS, payload });
			reset();
		}
	};

	const handleConnect = () => {
		if (showForm) {
			const { userId, vendorId, apiKey, server } = newCredentials;
			if (!userId || !vendorId || !apiKey || !server) {
				setFormError(true);
			} else {
				auth(newCredentials);
				const payload = { ...newCredentials, active: true };
				if (!payload.id) payload.id = uuid();
				dispatch({ type: ADD_UPDATE_CREDENTIALS, payload });
				reset();
				dispatch({ type: TOGGLE_CREDENTIALS });
			}
		} else {
			const creds = credentials.find((cred: Creds) => cred.active);
			if (creds) {
				auth(creds);
				reset();
				dispatch({ type: TOGGLE_CREDENTIALS });
			} else setFormError(true);
		}
	};

	const handleEdit = (cred: Creds) => {
		const { title = '', id, userId, vendorId, apiKey, active, server, groupId } = cred;
		setNewCredentials({ title, id, userId, vendorId, apiKey, server, active, token: '', groupId });
		setShowForm(true);
	};

	const handleReconnect = () => {
		const creds = credentials.find((cred: Creds) => cred.id === reconnectId);
		dispatch({ type: ADD_UPDATE_CREDENTIALS, payload: { ...creds, active: true } });
		setOpen(false);
		history.push('/');
		window.location.reload();
	};

	return (
		<>
			<Modal className="credentialsModal" size="mini" open={showCreds}>
				<Modal.Header>WAVV Credentials</Modal.Header>
				<Modal.Content>
					{showForm ? (
						<Form onSubmit={handleSubmit} error={formError}>
							<Form.Field
								name="title"
								value={newCredentials.title}
								onChange={handleCreds}
								label="Title"
								control="input"
								placeholder="Optional"
							/>
							<Form.Field
								name="userId"
								value={newCredentials.userId}
								onChange={handleCreds}
								label="User ID"
								control="input"
							/>
							<Form.Field
								name="vendorId"
								value={newCredentials.vendorId}
								onChange={handleCreds}
								label="Vendor ID"
								control="input"
							/>
							<Form.Field
								name="apiKey"
								value={newCredentials.apiKey}
								onChange={handleCreds}
								label="API Key"
								control="input"
							/>
							<Form.Field
								name="groupId"
								value={newCredentials.groupId}
								onChange={handleCreds}
								label="Group ID (Optional)"
								control="input"
							/>
							<ServerContainer>
								<Form.Field
									name="server"
									value={newCredentials.server}
									onChange={handleCreds}
									placeholder="app"
									label="Server"
									control="input"
									style={{ width: 100 }}
								/>
								<Domain>.wavv.com</Domain>
							</ServerContainer>
							<Form.Group>
								<Button
									id="form-button-cancel-credentials"
									content="Cancel"
									size="small"
									onClick={() => reset()}
									style={{ marginLeft: 5 }}
								/>
								<Button
									type="submit"
									id="form-button-save-credentials"
									content="Save"
									size="small"
									primary
									style={{ marginLeft: 5 }}
								/>
							</Form.Group>
							<Message error header="All fields are required" />
						</Form>
					) : (
						<>
							{credentials.map((cred: Creds) => {
								const isToken = !!cred.token;
								return (
									<Item.Group key={cred.id}>
										<Item>
											<Item.Content verticalAlign="middle" as="h4">
												<Radio
													checked={cred.active}
													onClick={() => cred.id && handleCheckbox(cred.id)}
													style={{ marginRight: 8, paddingTop: 3 }}
												/>
												{cred.title || cred.server} {isToken ? '(token)' : ''}
												<Popup
													content="Edit"
													position="bottom center"
													trigger={
														<Button
															icon="pencil"
															size="mini"
															disabled={isToken}
															style={{ marginLeft: 8 }}
															onClick={() => handleEdit(cred)}
														/>
													}
												/>
												<Popup
													content="Delete"
													position="bottom center"
													trigger={
														<Button
															icon="trash"
															size="mini"
															style={{ marginLeft: 8 }}
															onClick={() => {
																dispatch({
																	type: REMOVE_CREDENTIALS,
																	payload: cred.id,
																});
															}}
														/>
													}
												/>
											</Item.Content>
										</Item>
									</Item.Group>
								);
							})}
							{!authed && <Error>Error: Not connected to WAVV</Error>}
							<Button
								size="mini"
								onClick={() => {
									setShowForm(true);
								}}
							>
								New
							</Button>
						</>
					)}
				</Modal.Content>
				{!showForm && (
					<Modal.Actions>
						{authed && <Button onClick={() => dispatch({ type: TOGGLE_CREDENTIALS })}>Cancel</Button>}
						<Button onClick={handleConnect} primary disabled={authed}>
							{authed ? 'Connected' : 'Connect'}
						</Button>
					</Modal.Actions>
				)}
			</Modal>
			<Modal
				size="mini"
				centered
				onClose={() => {
					setReconnectId('');
					setOpen(false);
				}}
				onOpen={() => setOpen(true)}
				open={open}
			>
				<Header icon>Reconnect WAVV</Header>
				<Modal.Content>
					<p>End your current WAVV session and reconnect with selected credentials?</p>
				</Modal.Content>
				<Modal.Actions>
					<Button
						basic
						onClick={() => {
							setReconnectId('');
							setOpen(false);
						}}
					>
						No
					</Button>
					<Button basic color="red" onClick={handleReconnect}>
						Yes
					</Button>
				</Modal.Actions>
			</Modal>
		</>
	);
};

const ServerContainer = styled.div({ display: 'flex', alignItems: 'flex-end', marginBottom: 5 });

const Domain = styled.div({ fontSize: 16, paddingBottom: 14 });

const Error = styled.div({ color: 'red', marginBottom: 5 });

export default CredentialModal;
