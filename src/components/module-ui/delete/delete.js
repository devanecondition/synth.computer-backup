import React from 'react';
import "./delete.less";

export default class Delete extends React.Component {

	constructor(props) {
		super();
		this.voice = props.voice;
		this.module = props.module;
	}

	deleteModule(event) {
		event.preventDefault();

		this.voice.deleteModule(this.module);
	}

	render() {
		return (
			<div className="delete button" onClick={this.deleteModule.bind(this)}>X</div>
		);
	}
}