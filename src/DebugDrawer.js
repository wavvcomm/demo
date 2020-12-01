import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { Segment } from 'semantic-ui-react';
import { v4 as uuid } from 'uuid';
import { store } from './store';

const DebugDrawer = ({ showDrawer }) => {
	const { logs } = useContext(store);
	return showDrawer ? (
		<Container>
			<Segment>
				{logs.length ? (
					logs.map((log) => {
						const key = uuid();
						return <div key={key}>{log}</div>;
					})
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
