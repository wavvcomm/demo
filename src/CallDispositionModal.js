import React from 'react';
import { Modal, Form, TextArea, Button } from 'semantic-ui-react';

const CallDispositonModal = ({ tags, contactId: id, setTags, note, setNote, open, setOpen, notes, setNotes }) => {
	const handleTags = ({ target }) => {
		const newTags = { ...tags };
		if (!newTags[id]) newTags[id] = {};
		newTags[id][target.name] = target.checked;
		setTags(newTags);
	};

	return (
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
	);
};

export default CallDispositonModal;
