import React from 'react';
import Title from '../module-ui/component-title/component-title'
import Toggle from '../module-ui/toggle/toggle';
import Knobs from '../module-ui/knob/knob';
import './module.less';

var UiComponents = {
	toggle: Toggle,
	knob: Knobs
};

export default class Module extends React.Component {
	render() {
		return (
			<div className="module">
				<label>{this.props.name}</label>
				{
					this.props.ui.map(function(component) {
						var Component = UiComponents[component.type];

						return (
							<div>
								<Title name={component.name} />
								<Component options={component.options} value={component.value} />
							</div>
						);
					})
				}
			</div>
		);
	}
}