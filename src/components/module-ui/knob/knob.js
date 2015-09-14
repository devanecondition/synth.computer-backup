import React from 'react';
import ReactJSKnob from '../../reactjs-knob/reactjs-knob'

export default class Knob extends React.Component {

	constructor( props ) {
		super();

		this.height = props.height || 150;
		this.width = props.width || 150;
		this.value = props.value || 0;
		this.options = props.options || {};

		// personalized options
		this.options.fgColor = "#999";
		this.options.displayInput = true;
		this.options.inputColor = '#666';
		this.options.angleOffset = -125;
		this.options.angleArc = 250;
		this.options.inline = true;

		this.options.change = function(value) {
			console.log('we called change, and it\'s value is', value);
		};
	}

	render() {
		return (
			<ReactJSKnob height={this.width} width={this.height} value={this.value} options={this.options} />
		);
	}
}