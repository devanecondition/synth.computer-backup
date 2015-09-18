import React from 'react';
import './buttons.less';

export default class ButtonsGroup extends React.Component {

	render() {
		return (
			<div>
				{
					this.props.children.map(function(child, keyId) {
						var classes;
						switch (child.type) {
							case 'text':
								return (
									<a href="#" key={"button_" + keyId} className="text">{child.text}</a>
								)
							break;
							case 'icon':
								return (
									<a href="#" key={"button_" + keyId} className={child.icon}></a>
								)
							break;
						}
					})
				}
			</div>
		);
	}
}