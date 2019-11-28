import React from 'react';

import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Home from './Pages/Home';
import Login from './Pages/Login';
import Exercise from './Pages/Exercise';

export default function Routes() {
	return (
		<BrowserRouter>
			<Switch>
				<Route path="/" component={Home} exact />
				<Route path="/login" component={Login} />
				<Route path="/exercise/:id" component={Exercise} />
			</Switch>
		</BrowserRouter>
	);
}
