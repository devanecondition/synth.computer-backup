import React from 'react';
import './buttons.less';

class RadioLink extends React.Component {

	constructor(props) {
		super();
		this.radio = props.radio;
	}

	onRadioClick(event) {
		event.preventDefault();
		this.radio.setState({
			value: this.props.option
		});
	}

	render() {
		return (
			<a href="#" option={this.props.option} className={this.props.classes} onClick={this.onRadioClick.bind(this)}></a>
		);		
	}
}

export default class ButtonsRadio extends React.Component {

	constructor( props ) {
		super();
		this.state = {
			value: props.value
		}
	}

	render() {

		var radio = this;
		var options = Object.keys(this.props.options);
		var state = this.state;

		return (
			<div>
				{
					options.map(function(option, keyId) {

						var classes = (state.value === option) ? option + ' active' : option;

						return (
							<RadioLink key={"button_" + keyId} radio={radio} option={option} classes={classes}  />
						)
					})
				}
			</div>
		);
	}
}