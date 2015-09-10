import React from 'react';
import './label-input.less';

class LabelAndInput extends React.Component {
	render () {
		return (
			<div className="label-input">
				<label>{ this.props.name }</label>
				<input type="text" name={this.props.name.replace(' ', '_')} placeholder={this.props.placeholder || ''} />
			</div>
		);
	}
}

export default LabelAndInput;