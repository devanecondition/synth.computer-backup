import React from 'react';
import "./jack.less";

class Jack extends React.Component {

	constructor(props) {
		super();
		this.voice = props.voice;
	}

	render() {
		return (
			<div className="jack-wrap">
				<p>{this.props.name}</p>
				<div className={"button jack " + this.props.type}>
					<div></div>
				</div>
			</div>
		);
	}
}

export default Jack;