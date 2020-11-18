import React from 'react';
import styled from '@emotion/styled';
import { Segment } from 'semantic-ui-react';

const DebugDrawer = ({ showDrawer }) => {
	return showDrawer ? (
		<Container>
			<Segment>
				<div>one</div>
				<div>one</div>
				<div>one</div>
				<div>one</div>
				<div>one</div>
				<div>one</div>
				<div>one</div>
				<div>one</div>
				<div>one</div>
				<div>one</div>
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
