import React, { useContext, useState } from 'react';
import styled from '@emotion/styled';
import { Button, Checkbox, Dropdown, Label, Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
// @ts-ignore
import { setTheme, constants } from '@wavv/core';
// @ts-ignore
import { openMessenger } from '@wavv/messenger';
import { store } from './store';
import { TOGGLE_DRAWER, TOGGLE_CREDENTIALS } from './actionTypes';
import { debugLogger } from './utils';

const Nav = ({ startCampaign, startBlast }: { startCampaign: () => void; startBlast: () => void }) => {
	const {
		showDrawer: showingDrawer,
		showCreds: showingCreds,
		unreadMessages: unreadCount,
		selected,
		dispatch,
		authed,
	} = useContext(store);
	const [on, toggleOn] = useState(false);
	const disableStart = !selected.length;

	const accents: { [key: string]: string } = {
		default: '#48B0D6',
		red: '#BF6350',
		green: '#4F945B',
		blue: '#076BC2',
		yellow: '#FDD454',
		purple: '#A67EC5',
	};

	const handleTheme = () => {
		const { LIGHT, DARK } = constants.themes;
		const lightTheme = !on; // state hasn't changed yet, so we want the inverse
		setTheme({ theme: lightTheme ? LIGHT : DARK });
		debugLogger({ name: 'setTheme', dispatch });
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
						<Checkbox disabled={!authed} toggle checked={on} onChange={handleTheme} />
					</ToggleContainer>
				</Menu.Item>
				<Menu.Item fitted>
					<Dropdown item text="WAVV Primary Color" button disabled={!authed}>
						<Dropdown.Menu>
							{Object.keys(accents).map((name) => {
								const primaryColor = accents[name];
								const { LIGHT, DARK } = constants.themes;
								return (
									<Dropdown.Item
										key={name}
										onClick={() => setTheme({ primaryColor, theme: on ? LIGHT : DARK })}
									>
										<ColorItem color={primaryColor} />
									</Dropdown.Item>
								);
							})}
						</Dropdown.Menu>
					</Dropdown>
				</Menu.Item>
				<Menu.Item fitted>
					<Button
						disabled={!authed}
						onClick={() => {
							openMessenger({ dock: true })
								.then(() => debugLogger({ name: 'openMessenger', dispatch }))
								.catch(() => debugLogger({ name: 'openMessenger Failed', dispatch }));
						}}
					>
						Messenger
						{unreadCount > 0 ? <Label color="red" circular floating content={unreadCount} /> : null}
					</Button>
				</Menu.Item>
				<Menu.Item fitted>
					<Button primary disabled={disableStart || !authed} onClick={startBlast} content="Blast" />
				</Menu.Item>
				<Menu.Item fitted>
					<Button primary disabled={disableStart || !authed} onClick={startCampaign} content="Dial" />
				</Menu.Item>
				<Menu.Item fitted>
					<Button
						color={showingDrawer ? 'grey' : undefined}
						icon="bug"
						onClick={() => dispatch({ type: TOGGLE_DRAWER })}
					/>
				</Menu.Item>
				<Menu.Item fitted>
					<Button
						color={showingCreds ? 'grey' : undefined}
						icon={showingCreds ? 'unlock' : 'lock'}
						onClick={() => dispatch({ type: TOGGLE_CREDENTIALS })}
					/>
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
