import React from 'react';
import "./header.less";

class Header extends React.Component {

	render() {
		return (
			<div className="menu-container">
				<div className="top">
					<a href="#" className="patch-mode">performance Mode</a>
				</div>
			</div>
		);
	}
}

export default Header;