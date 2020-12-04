import React, { useContext, useState } from 'react';
import { Modal, Form, Button, Item, Popup, Message, Radio } from 'semantic-ui-react';
import { v4 as uuid } from 'uuid';
import { store } from './store';
import { ADD_UPDATE_CREDENTIALS, REMOVE_CREDENTIALS, TOGGLE_CREDENTIALS } from './types';

const DebugDrawer = ({ handleCheckbox, auth }) => {
	const { credentials, dispatch, showCreds, stormLoaded } = useContext(store);
	const [showForm, setShowForm] = useState(!credentials.length);
	const [formError, setFormError] = useState(false);
	const [newCredentials, setNewCredentials] = useState({
		id: '',
		userId: '',
		vendorId: '',
		apiKey: '',
		server: '',
		active: false,
	});

	const handleCreds = (event) => {
		const { name, value } = event.target;
		const newCreds = { ...newCredentials };
		newCreds[name] = value;
		setNewCredentials(newCreds);
	};

	const reset = () => {
		setNewCredentials({ id: '', userId: '', vendorId: '', apiKey: '', server: '', active: false });
		setShowForm(false);
		setFormError(false);
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
			const creds = credentials.find((cred) => cred.active);
			if (creds) {
				if (stormLoaded) {
					//  open a modal with an option to reload
					//  and set new active cred
				} else {
					auth(creds);
					reset();
					dispatch({ type: TOGGLE_CREDENTIALS });
				}
			} else setFormError(true);
		}
	};

	return (
		<Modal size="mini" open={showCreds}>
			<Modal.Header>WAVV Credentials</Modal.Header>
			<Modal.Content>
				{showForm ? (
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
						<Form.Field
							name="server"
							value={newCredentials.server}
							onChange={handleCreds}
							label="Server"
							control="input"
						/>
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
										<Radio
											checked={cred.active}
											onClick={() => handleCheckbox(cred.id)}
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
														const { id, userId, vendorId, apiKey, active, server } = cred;
														setNewCredentials({ id, userId, vendorId, apiKey, server, active });
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
			<Modal.Actions>
				{stormLoaded && <Button onClick={() => dispatch({ type: TOGGLE_CREDENTIALS })}>Cancel</Button>}
				<Button onClick={handleConnect} primary>
					Connect
				</Button>
			</Modal.Actions>
		</Modal>
	);
};

export default DebugDrawer;
