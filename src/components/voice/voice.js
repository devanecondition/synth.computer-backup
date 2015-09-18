import React from 'react';
import Header from '../header/header';
import Module from '../module/module'
import './voice.less';

export default class Voice extends React.Component {

	constructor() {
		super();
		this.state = {
			mode: 'performance',
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
					],
					jacks: [
						{
							name: 'Gate out',
							type: 'outlet'
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
						},
						{
							name:'Direction',
							type: 'buttonsRadio',
							options: {
								backward:{
									icon: 'backward'
								},
								random:{
									icon: 'random'
								},
								forward:{
									icon: 'forward'
								}
							},
							value: 'forward'
						},
						{
							name:'Sequence',
							type: 'buttonsGroup',
							children: [
								{
									type: 'text',
									text: 'Skip Note'
								},
								{
									type: 'text',
									text: 'Undo'
								}
							]
						}
					],
					jacks: [
						{
							name: 'Pitch In',
							type: 'inlet'
						},
						{
							name: 'Gate in',
							type: 'inlet'
						},
						{
							name: 'Pitch out',
							type: 'outlet'
						},
						{
							name: 'Gate out',
							type: 'outlet'
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
						},
						{
							name:'Wave Type',
							type: 'buttonsRadio',
							options: {
								sine:{
									icon: 'sine'
								},
								square:{
									icon: 'square'
								},
								sawtooth:{
									icon: 'sawtooth'
								},
								triangle:{
									icon: 'triangle'
								}
							},
							value: 'square'
						},
						{
							name:'Octave',
							type: 'buttonsGroup',
							children: [
								{
									type: 'icon',
									icon: 'down'
								},
								{
									type: 'icon',
									icon: 'up'
								}
							]
						}
					],
					jacks: [
						{
							name: 'Pitch In',
							type: 'inlet'
						},
						{
							name: 'Audio out',
							type: 'outlet'
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
					],
					jacks: [
						{
							name: 'Audio/Env',
							type: 'inlet'
						},
						{
							name: 'Audio out',
							type: 'outlet'
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
					],
					jacks: [
						{
							name: 'Gate In',
							type: 'inlet'
						},
						{
							name: 'Env out',
							type: 'outlet'
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
					],
					jacks: [
						{
							name: 'Audio In',
							type: 'inlet'
						},
						{
							name: 'Audio out',
							type: 'outlet'
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
					],
					jacks: [
						{
							name: 'Audio In',
							type: 'inlet'
						},
						{
							name: 'Audio out',
							type: 'outlet'
						}
					]
				},
				{
					name: 'Output',
					ui: [],
					jacks: [
						{
							name: 'Audio In',
							type: 'inlet'
						}
					]
				}
			]
		};
	}

	render() {
		var _this = this;
		return (
			<div>
				<Header voice={_this} />
				<div className="patch-container">
					{
						this.state.modules.map(function(module, keyId) {
							return <Module voice={_this} module={module} key={'voice_' + keyId++} name={module.name} ui={module.ui} />
						})
					}
				</div>
			</div>
		);
	}
}