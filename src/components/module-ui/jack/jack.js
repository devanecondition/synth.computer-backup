import React from 'react';
import "./jack.less";
import Tools from "../../../tools.js";

export default class Jack extends React.Component {

	constructor(props) {
		super();
		this.voice = props.voice;
		this.module = props.module;
		this.id = props.id;

		this.state = {
			mouseOver: ''
		}
	}

	getPosition() {
		let jackHole = React.findDOMNode(this.refs.jackHole);
		let jackHolePos = Tools.getElemPosition(jackHole);

		jackHolePos.top = jackHolePos.top + 13;
		jackHolePos.left = jackHolePos.left + 13;

		return jackHolePos;
	}

	onJackClick(event) {
		if (this.props.type === 'outlet') {
			this.voice.onNewCableEnabled({
				moduleId: this.module.id,
				jackId: this.id
			});
		}
	}

	onJackHoverOn() {
		if (this.props.type === 'inlet') {
			this.voice.onJackHoverOn({
				moduleId: this.module.id,
				jackId: this.id
			});
			
			this.setState({
				mouseOver: ' mouseOver'
			});
		}
	}

	onJackHoverOff() {
		if (this.props.type === 'inlet') {
			this.voice.onJackHoverOff(this);
			this.setState({
				mouseOver: ''
			});
		}
	}

	render() {
		return (
			<div className="jack-wrap">
				<p>{this.props.name}</p>
				<div className={"button jack " + this.props.type + this.state.mouseOver} onMouseDown={this.onJackClick.bind(this)} onMouseEnter={this.onJackHoverOn.bind(this)} onMouseLeave={this.onJackHoverOff.bind(this)}>
					<div ref="jackHole"></div>
				</div>
			</div>
		);
	}
}