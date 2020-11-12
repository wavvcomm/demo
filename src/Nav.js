import React from 'react';
import styled from '@emotion/styled';
import { Button, Dropdown, Label, Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const Nav = ({ setDncAction, disableStart, startCampaign }) => {
	return (
		<NavBar>
			<Link to="/" style={{ color: 'inherit' }}>
				WAVV Demo
			</Link>
			<Menu secondary size="tiny" style={{ zIndex: 1000, marginTop: 0 }}>
				<Menu.Item>
					<Dropdown text="DNC Actions" button>
						<Dropdown.Menu>
							<Dropdown.Item onClick={() => setDncAction('Remove')}>Remove</Dropdown.Item>
							<Dropdown.Item onClick={() => setDncAction('Add')}>Add</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				</Menu.Item>
				<Menu.Item>
					<Button onClick={() => window.Storm.openMessenger({ dock: true })}>
						Open Messenger
						<Label color="red" circular floating content="34" />
					</Button>
				</Menu.Item>
				<Menu.Item>
					<Button primary disabled={disableStart} onClick={startCampaign} content="Start Campaign" />
				</Menu.Item>
			</Menu>
		</NavBar>
	);
};

const NavBar = styled.div({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	width: '100%',
	backgroundColor: '#EAEAEA',
	fontSize: 30,
	padding: '15px 20px',
});

export default Nav;
