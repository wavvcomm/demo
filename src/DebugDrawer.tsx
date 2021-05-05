import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { Segment, Header } from 'semantic-ui-react';
import { v4 as uuid } from 'uuid';
import { store } from './store';

type Props = {
	showDrawer: boolean;
};

const DebugDrawer = ({ showDrawer }: Props) => {
	const { logs } = useContext(store);

	return showDrawer ? (
		<Container>
			<Segment>
				<Header as="h5">WAVV Log</Header>
				{logs.length ? (
					<>
						{logs.map((log: string) => {
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
