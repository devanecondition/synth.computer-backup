import React from 'react';
import "./cable-end.less";

class CableEnd extends React.Component {

	constructor(props) {
		super();
	}

	render() {

		let styles = {
			top: this.props.top + 'px' || '12px',
			left: this.props.left + 'px' || '12px'
		}

		return (
			<div className="cable-end" style={styles}>
				<svg width="16" height="16" pointer-events="all" position="absolute" version="1.1" xmlns="http://www.w3.org/1999/xhtml">
					<circle cx="8" cy="8" r="8" version="1.1" xmlns="http://www.w3.org/1999/xhtml" fill="#456" stroke="none"></circle>
				</svg>
			</div>
		);
	}
}

export default CableEnd;