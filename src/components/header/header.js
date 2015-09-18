import React from 'react';
import "./header.less";

class Header extends React.Component {

	constructor(props) {
		super();
		this.voice = props.voice;
	}

	toggleMode(event) {
		event.preventDefault();
		this.voice.setState({
			mode: (this.voice.state.mode === 'edit') ? 'performance' : 'edit'
		});
	}

	render() {
		return (
			<div className="menu-container">
				<div className="top">
					<a href="#" className="patch-mode" onClick={this.toggleMode.bind(this)}>{this.voice.state.mode} Mode</a>
				</div>
			</div>
		);
	}
}

export default Header;