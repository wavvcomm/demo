import React from 'react';
import styled from '@emotion/styled';
import { Button, Dropdown, Label, Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const Nav = ({ setDncAction, disableStart, startCampaign, unreadCount }) => {
	return (
		<NavBar>
			<Link to="/" style={{ color: 'inherit' }}>
				WAVV Demo
			</Link>
			<Menu secondary size="tiny" style={{ zIndex: 1000, marginTop: 0 }}>
				<Menu.Item>
					<Dropdown text="Set Theme" button>
						<Dropdown.Menu>
							<Dropdown.Item>
								<Dropdown text="Light">
									<Dropdown.Menu>
										<Dropdown.Header>Accents</Dropdown.Header>
										<Dropdown.Item onClick={() => window.Storm.setTheme({ theme: 'light' })}>Standard</Dropdown.Item>
										<Dropdown.Item onClick={() => window.Storm.setTheme({ theme: 'light', primaryColor: '#ff0000' })}>
											Red
										</Dropdown.Item>
										<Dropdown.Item onClick={() => window.Storm.setTheme({ theme: 'light', primaryColor: '#ffff00' })}>
											Yellow
										</Dropdown.Item>
										<Dropdown.Item onClick={() => window.Storm.setTheme({ theme: 'light', primaryColor: '#33cc33' })}>
											Green
										</Dropdown.Item>
										<Dropdown.Item onClick={() => window.Storm.setTheme({ theme: 'light', primaryColor: '#0000ff' })}>
											Blue
										</Dropdown.Item>
									</Dropdown.Menu>
								</Dropdown>
							</Dropdown.Item>
							<Dropdown.Item>
								<Dropdown text="Dark">
									<Dropdown.Menu>
										<Dropdown.Header>Accents</Dropdown.Header>
										<Dropdown.Item onClick={() => window.Storm.setTheme({ theme: 'dark' })}>Standard</Dropdown.Item>
										<Dropdown.Item onClick={() => window.Storm.setTheme({ theme: 'dark', primaryColor: '#ff0000' })}>
											Red
										</Dropdown.Item>
										<Dropdown.Item onClick={() => window.Storm.setTheme({ theme: 'dark', primaryColor: '#ffff00' })}>
											Yellow
										</Dropdown.Item>
										<Dropdown.Item onClick={() => window.Storm.setTheme({ theme: 'dark', primaryColor: '#33cc33' })}>
											Green
										</Dropdown.Item>
										<Dropdown.Item onClick={() => window.Storm.setTheme({ theme: 'dark', primaryColor: '#0000ff' })}>
											Blue
										</Dropdown.Item>
									</Dropdown.Menu>
								</Dropdown>
							</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
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
						{unreadCount ? <Label color="red" circular floating content={unreadCount} /> : null}
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
