import React from 'react';
import {RouteHandler, Link} from 'react-router';
import LoginForm from '../login/login';
import Header from '../header/header';

class Main extends React.Component {

	render() {
		return (
			<div>
				<Header />
				<LoginForm />
			</div>
		);
	}
}

export default Main;
