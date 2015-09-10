import React from 'react';
import './login.less';
import LabelAndInput from '../label-input/label-input'
// import Auth from './server/Auth'

export default class LoginForm extends React.Component {

 	constructor(props) {
        super(props);
        this.state = {isMember: false};
    }

	onSubmit() {
		event.preventDefault();
	    Auth.login(this.state.user, this.state.password).catch(function(err) {
			alert("There's an error logging in");
		});
	}

	toggleMemberForm(event) {
		event.preventDefault();
		this.setState({isMember:!this.state.isMember});
	}

	render() {
		var userForm = (
			<form>
				{!this.state.isMember ? <LabelAndInput name="first name" placeholder="enter your first name" /> : ''}
				<LabelAndInput name="user name" placeholder="enter your username" />
				<LabelAndInput name="password" placeholder="enter your password" />
				{!this.state.isMember ? <LabelAndInput name="confirm password" placeholder="confirm your password" /> : ''}
				{!this.state.isMember ?
					<a href="#" onClick={this.toggleMemberForm.bind(this)} className="signup">Already a member? Log In Here</a> :
					<a href="#" onClick={this.toggleMemberForm.bind(this)} className="signup">Not a member? Sign Up Here</a>
				}
				<button type="button" onClick={this.onSubmit.bind(this)}>Sign In</button>
			</form>
		);

		return <div className="login-container">{userForm}</div>;
	}
}