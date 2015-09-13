import React from 'react';
import ReactJSKnob from '../../reactjs-knob/reactjs-knob'

export default class Knob extends React.Component {

	constructor( props ) {
		super();

		// personalized options
		props.options.fgColor = "#999";
		props.options.displayInput = true;
		props.options.inputColor = '#666';
		props.options.angleOffset = -125;
		props.options.angleArc = 250;
	}

	render() {
		return (
			<ReactJSKnob height="150" width="150" {...this.props} />
		);
	}
}