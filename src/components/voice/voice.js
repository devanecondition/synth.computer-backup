import React from 'react';
import Header from '../header/header';
import Module from '../module/module'
import './voice.less';

export default class Voice extends React.Component {

	constructor() {
		super();
		this.state = {
			modules : [
				{
					name: 'Clock',
					ui: [
						{
							name:'Play/Stop',
							type: 'toggle',
							options: {
								off:'play',
								on:'stop'
							},
							value: 'off'
						},
						// {
						// 	name:'BPM',
						// 	type: 'knob',
						// 	options: {
						// 		range: {
						// 			min: 0,
						// 			max:350
						// 		}
						// 	},
						// 	value: 240
						// }
					]
				},
				{
					name: 'Sequencer',
					ui: [
						{
							name:'Record',
							type: 'toggle',
							options: {
								off:'record',
								on:'stop'
							},
							value: 'off'
						}
					]
				},
				{
					name: 'VCO',
					ui: []
				},
				{
					name: 'VCA',
					ui: []
				},
				{
					name: 'Envelope Generator',
					ui: []
				},
				{
					name: 'Filter',
					ui: []
				},
				{
					name: 'Delay',
					ui: []
				},
				{
					name: 'Output',
					ui: []
				}
			]
		};
	}

	getModules() {

	}

	render() {
		return (
			<div>
				<Header />
				<div className="patch-container">
					{
						this.state.modules.map(function(module) {
							return <Module name={module.name} ui={module.ui} />
						})
					}
				</div>
			</div>
		);
	}
}