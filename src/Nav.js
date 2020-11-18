import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Button, Checkbox, Dropdown, Label, Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const Nav = ({ disableStart, startCampaign, unreadCount }) => {
	const [on, toggleOn] = useState(false);

	const accents = {
		default: '#48B0D6',
		red: '#BF6350',
		green: '#4F945B',
		blue: '#076BC2',
		yellow: '#FDD454',
		purple: '#A67EC5',
	};

	const handleTheme = () => {
		const lightTheme = !on; // state hasn't changed yet, so we want the inverse
		window.Storm.setTheme({ theme: lightTheme ? 'light' : 'dark' });
		toggleOn(!on);
	};

	return (
		<NavBar>
			<Link to="/" style={{ color: 'inherit' }}>
				CRM Demo
			</Link>
			<Menu secondary size="tiny" style={{ zIndex: 1000, marginTop: 0 }}>
				<Menu.Item fitted>
					<ToggleContainer>
						<div>WAVV Theme</div>
						<Checkbox toggle checked={on} onChange={handleTheme} />
					</ToggleContainer>
				</Menu.Item>
				<Menu.Item fitted>
					<Dropdown item text="WAVV Primary Color" button>
						<Dropdown.Menu>
							{Object.keys(accents).map((name) => {
								const primaryColor = accents[name];
								return (
									<Dropdown.Item key={name} onClick={() => window.Storm.setTheme({ primaryColor })}>
										<ColorItem color={primaryColor} />
									</Dropdown.Item>
								);
							})}
						</Dropdown.Menu>
					</Dropdown>
				</Menu.Item>
				<Menu.Item fitted>
					<Button onClick={() => window.Storm.openMessenger({ dock: true })}>
						Open Messenger
						{unreadCount ? <Label color="red" circular floating content={unreadCount} /> : null}
					</Button>
				</Menu.Item>
				<Menu.Item fitted>
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

const ColorItem = styled.div(({ color }) => ({
	backgroundColor: color,
	width: 'auto',
	height: 15,
}));

const ToggleContainer = styled.div({
	display: 'grid',
	alignItems: 'center',
	gridTemplateColumns: 'auto auto',
	columnGap: 5,
});

export default Nav;
