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
						{
							name:'BPM',
							type: 'knob',
							options: {
								min: 20,
								max: 350
							},
							value: 240
						}
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
					ui: [
						{
							name:'Fine Tune',
							type: 'knob',
							options: {
								min: -20,
								max: 20
							},
							value: 0
						}
					]
				},
				{
					name: 'VCA',
					ui: [
						{
							name:'Attenuator',
							type: 'knob',
							options: {
								min: 0,
								max: 100
							},
							value: 50
						}
					]
				},
				{
					name: 'Envelope Generator',
					ui: [
						{
							name:'Attack',
							type: 'knob',
							options: {
								min: 0,
								max: 100
							},
							value: 0
						},
						{
							name:'Release',
							type: 'knob',
							options: {
								min: 0,
								max: 100
							},
							value: 23
						}
					]
				},
				{
					name: 'Filter',
					ui: [
						{
							name:'Frequency',
							type: 'knob',
							options: {
								min: 25,
								max: 10000
							},
							value: 2600
						},
						{
							name:'Resonance',
							type: 'knob',
							options: {
								min: 0,
								max: 100
							},
							value: 62
						}
					]
				},
				{
					name: 'Delay',
					ui: [
						{
							name:'Time',
							type: 'knob',
							options: {
								min: 0,
								max: 100
							},
							value: 38
						},
						{
							name:'Delay',
							type: 'knob',
							options: {
								min: 0,
								max: 100
							},
							value: 40
						}
					]
				},
				{
					name: 'Output',
					ui: []
				}
			]
		};
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