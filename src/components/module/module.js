import React from 'react';
import Title from '../module-ui/component-title/component-title'
import Toggle from '../module-ui/toggle/toggle';
import Knobs from '../module-ui/knob/knob';
import ButtonsRadio from '../module-ui/buttons/radio';
import ButtonsGroup from '../module-ui/buttons/group';
import DeleteButton from '../module-ui/delete/delete';
import Jack from '../module-ui/jack/jack';
import './module.less';

var UiComponents = {
	toggle: Toggle,
	knob: Knobs,
	buttonsRadio: ButtonsRadio,
	buttonsGroup: ButtonsGroup
};

export default class Module extends React.Component {

	constructor(props) {
		super();
		this.voice = props.voice;
	}

	getFrontPanel() {
		return this.props.ui.map(function(component, keyId) {
			var Component = UiComponents[component.type];

			return (
				<div key={'module_' + keyId++}>
					<Title name={component.name} />
					<Component 
						options={component.options}
						children={component.children}
						value={component.value}
					/>
				</div>
			);
		});
	}

	getBackPanel() {
		var _this = this;
		return (
			<div>
				<DeleteButton voice={this.voice} module={this} />
				{this.props.module.jacks.map(function(jack, key) {
					return (
						<Jack name={jack.name} type={jack.type} voice={_this.voice} key={"jack_" + key} />
					);
				})}
			</div>
		);
	}

	render() {
		return (
			<div className="module">
				<label>{this.props.name}</label>
				{(this.voice.state.mode === 'performance') ? this.getFrontPanel() : this.getBackPanel()}
			</div>
		);
	}
}