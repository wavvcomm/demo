import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import 'semantic-ui-css/semantic.min.css';
import { StateProvider } from './store';

ReactDOM.render(
	<StateProvider>
		<Router>
			<App />
		</Router>
	</StateProvider>,
	document.getElementById('root')
);
