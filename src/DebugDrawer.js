import React, { useContext, useState } from 'react';
import styled from '@emotion/styled';
import { Segment, Header, Form, Radio, Button, Item, Popup, Message, Checkbox } from 'semantic-ui-react';
import { v4 as uuid } from 'uuid';
import { store } from './store';
import { ADD_UPDATE_CREDENTIALS, REMOVE_CREDENTIALS } from './types';

const DebugDrawer = ({ showDrawer, handleCheckbox }) => {
	const [showForm, setShowForm] = useState(false);
	const [formError, setFormError] = useState(false);
	const { logs, credentials, dispatch } = useContext(store);
	const [server, setServer] = useState('prod');
	const [newCredentials, setNewCredentials] = useState({ id: '', userId: '', vendorId: '', apiKey: '', active: false });

	const handleCreds = (event) => {
		const { name, value } = event.target;
		const newCreds = { ...newCredentials };
		newCreds[name] = value;
		setNewCredentials(newCreds);
	};

	const handleChange = (event, { value }) => setServer(value);

	const reset = () => {
		setNewCredentials({ id: '', userId: '', vendorId: '', apiKey: '', active: false });
		setShowForm(false);
		setServer('prod');
		setFormError(false);
	};

	const handleSubmit = () => {
		const { userId, vendorId, apiKey } = newCredentials;
		if (!userId || !vendorId || !apiKey) {
			setFormError(true);
		} else {
			setFormError(false);
			const payload = { ...newCredentials, server };
			if (!payload.id) payload.id = uuid();
			dispatch({ type: ADD_UPDATE_CREDENTIALS, payload });
			reset();
		}
	};

	return showDrawer ? (
		<Container>
			<Segment>
				<Header as="h5">Credentials</Header>
				{!credentials.length || showForm ? (
					<Form onSubmit={handleSubmit} error={formError}>
						<Form.Field
							name="userId"
							value={newCredentials.userId}
							onChange={handleCreds}
							label="UserId"
							control="input"
						/>
						<Form.Field
							name="vendorId"
							value={newCredentials.vendorId}
							onChange={handleCreds}
							label="VendorId"
							control="input"
						/>
						<Form.Field
							name="apiKey"
							value={newCredentials.apiKey}
							onChange={handleCreds}
							label="ApiKey"
							control="input"
						/>
						<Form.Group grouped>
							{/* eslint-disable-next-line */}
							<label>Server</label>
							<Form.Field
								control={Radio}
								label="prod"
								value="prod"
								checked={server === 'prod'}
								onChange={handleChange}
							/>
							<Form.Field
								control={Radio}
								label="stage"
								value="stage"
								checked={server === 'stage'}
								onChange={handleChange}
							/>
							<Form.Field control={Radio} label="dev" value="dev" checked={server === 'dev'} onChange={handleChange} />
						</Form.Group>
						<Form.Group>
							{!!credentials.length && (
								<Form.Field
									id="form-button-cancel-credentials"
									control={Button}
									content="Cancel"
									size="small"
									onClick={() => {
										reset();
									}}
								/>
							)}
							<Form.Field
								type="submit"
								id="form-button-save-credentials"
								control={Button}
								content="Save"
								size="small"
							/>
						</Form.Group>
						<Message error header="All fields are required" />
					</Form>
				) : (
					<>
						{credentials.map((cred) => (
							<Item.Group key={cred.id}>
								<Item>
									<Item.Content verticalAlign="middle" as="h4">
										<Checkbox
											checked={cred.active}
											onChange={() => handleCheckbox(cred.id)}
											style={{ marginRight: 8, paddingTop: 3 }}
										/>
										{cred.server.toUpperCase()}
										<Popup
											content="Edit"
											position="bottom center"
											trigger={
												<Button
													icon="pencil"
													size="mini"
													style={{ marginLeft: 8 }}
													onClick={() => {
														const { id, userId, vendorId, apiKey, active, server: serv } = cred;
														setServer(serv);
														setNewCredentials({ id, userId, vendorId, apiKey, active });
														setShowForm(true);
													}}
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
														dispatch({ type: REMOVE_CREDENTIALS, payload: cred.id });
													}}
												/>
											}
										/>
									</Item.Content>
								</Item>
							</Item.Group>
						))}
						<Button size="mini" onClick={() => setShowForm(true)}>
							New
						</Button>
					</>
				)}
			</Segment>
			<Segment>
				{logs.length ? (
					<>
						<Header as="h5">WAVV Log</Header>
						{logs.map((log) => {
							const key = uuid();
							return <div key={key}>{log}</div>;
						})}
					</>
				) : (
					<div>No logs to show</div>
				)}
			</Segment>
		</Container>
	) : null;
};

const Container = styled.div({
	display: 'flex',
	flexDirection: 'column',
	width: 200,
});

export default DebugDrawer;
