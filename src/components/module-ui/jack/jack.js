import React from 'react';
import "./jack.less";

class Jack extends React.Component {

	constructor(props) {
		super();
		this.voice = props.voice;
		this.module = props.module;
		this.state = {
			mouseOver: ''
		}
	}

	onJackClick(event) {
		if (this.props.type === 'outlet') {
			this.voice.onNewCableEnabled(this, this.module, event);
		}
	}

	onJackHoverOn() {
console.log('onJackHoverOn');
		if (this.props.type === 'inlet') {
			this.voice.onJackHoverOn(this, this.module);
			this.setState({
				mouseOver: ' mouseOver'
			});
		}
	}

	onJackHoverOff() {
console.log('onJackHoverOff');
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
					<div></div>
				</div>
			</div>
		);
	}
}

export default Jack;