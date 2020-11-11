import React from 'react';
import styled from '@emotion/styled';
import { Button, Dropdown } from 'semantic-ui-react';
import { openMessenger } from '@wavv/messenger';
import { Link } from 'react-router-dom';

const Nav = ({ setDncAction, disableStart, startCampaign }) => {
	return (
		<NavBar>
			<Link to="/" style={{ color: 'inherit' }}>
				WAVV Demo
			</Link>
			<NavItems>
				<Dropdown text="DNC Actions" button>
					<Dropdown.Menu>
						<Dropdown.Item
							onClick={() => {
								setDncAction('Remove');
							}}
						>
							Remove
						</Dropdown.Item>
						<Dropdown.Item
							onClick={() => {
								setDncAction('Add');
							}}
						>
							Add
						</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>

				<Button content="Open Messenger" onClick={openMessenger} />
				<Button primary disabled={disableStart} onClick={startCampaign} content="Start Campaign" />
			</NavItems>
		</NavBar>
	);
};

const NavBar = styled.div({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	width: '100%',
	height: 50,
	backgroundColor: '#EAEAEA',
	fontSize: 30,
	padding: 20,
});

const NavItems = styled.div({
	display: 'flex',
	alignItems: 'center',
	zIndex: 1000,
});

export default Nav;
