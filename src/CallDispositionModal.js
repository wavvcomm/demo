import React, { useContext } from 'react';
import { Modal, Form, TextArea, Button } from 'semantic-ui-react';
import { store } from './store';
import { SET_NOTES, SET_OPEN_NOTE, SET_TAGS } from './types';

const CallDispositonModal = ({ contactId: id, note, setNote }) => {
	const { openNote, tags, notes, dispatch } = useContext(store);
	const handleTags = ({ target }) => {
		const newTags = { ...tags };
		if (!newTags[id]) newTags[id] = {};
		newTags[id][target.name] = target.checked;
		dispatch({ type: SET_TAGS, payload: newTags });
	};

	return (
		<Modal
			className="callDispositionModal"
			onClose={() => {
				dispatch({ type: SET_OPEN_NOTE, payload: false });
			}}
			open={openNote}
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
							onChange={handleTags}
						/>
						<Form.Field
							label="Follow Up"
							name="Follow Up"
							control="input"
							type="checkbox"
							checked={tags?.[id]?.['Follow Up']}
							onChange={handleTags}
						/>
						<Form.Field
							label="Do Not Call"
							name="Do Not Call"
							control="input"
							type="checkbox"
							checked={tags?.[id]?.['Do Not Call']}
							onChange={handleTags}
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
						dispatch({ type: SET_OPEN_NOTE, payload: false });
						window.Storm.continue();
					}}
				>
					Cancel
				</Button>
				<Button
					onClick={() => {
						const newNotes = { ...notes };
						if (newNotes[id]) newNotes[id].push({ note, date: Date.now() });
						else newNotes[id] = [{ note, date: Date.now() }];
						dispatch({ type: SET_NOTES, payload: newNotes });
						dispatch({ type: SET_OPEN_NOTE, payload: false });
						window.Storm.continue();
					}}
					positive
				>
					Save
				</Button>
			</Modal.Actions>
		</Modal>
	);
};

export default CallDispositonModal;
