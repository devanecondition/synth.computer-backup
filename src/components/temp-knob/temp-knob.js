import React from 'react';
import Knob from '../module-ui/knob/knob';
import './temp-knob.less';

export default class TempKnob extends React.Component {
	render() {
		return (
			<Knob angleOffset="-125" angleArc="250" fgColor="#999" value="35" />
		);
	}
}