import React from 'react';
import './toggle.less';

export default class Toggle extends React.Component {

	constructor( props ) {
		super();
		this.state = props;
	}

	toggleState() {
		this.setState({
			value: (this.state.value === 'on') ? 'off' : 'on'
		});
	}

	render() {
		var stateClass = "button " + this.state.options[this.state.value];

		return (
			<div className={stateClass} onClick={this.toggleState.bind(this)}></div>
		);
	}
}