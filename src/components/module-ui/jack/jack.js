import React from 'react';
import "./jack.less";

class Jack extends React.Component {

	constructor(props) {
		super();
		this.voice = props.voice;
	}

	onJackClick() {
		if (this.props.type === 'outlet') {
			this.voice.onNewCableEnabled(this);
		}
	}

	onJackHoverOn() {
		if (this.props.type === 'inlet') {
			this.voice.onJackHoverOn(this);
		}
	}

	onJackHoverOff() {
		if (this.props.type === 'inlet') {
			this.voice.onJackHoverOff(this);
		}
	}

	render() {
		return (
			<div className="jack-wrap">
				<p>{this.props.name}</p>
				<div className={"button jack " + this.props.type} onMouseDown={this.onJackClick.bind(this)} onMouseEnter={this.onJackHoverOn.bind(this)} onMouseLeave={this.onJackHoverOff.bind(this)}>
					<div></div>
				</div>
			</div>
		);
	}
}

export default Jack;