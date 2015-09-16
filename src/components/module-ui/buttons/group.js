import React from 'react';
import './buttons.less';

export default class ButtonsGroup extends React.Component {

	render() {
		return (
			<div>
				{
					this.props.children.map(function(child) {
						var classes;
						switch (child.type) {
							case 'text':
								return (
									<a href="#" className="text">{child.text}</a>
								)
							break;
							case 'icon':
								return (
									<a href="#" className={child.icon}></a>
								)
							break;
						}
					})
				}
			</div>
		);
	}
}