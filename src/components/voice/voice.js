import _ from 'lodash';
import React from 'react';
import Header from '../header/header';
import Module from '../module/module';
import Cable from '../cable/cable';
import './voice.less';

var Connections = {
	cable : Cable
};

export default class Voice extends React.Component {

	constructor() {
		super();

		this._mouseUp = this.mouseUp.bind(this);
		this.activeCable;
	    this._newCable = {
	    	cable: null,
	    	outlet: null,
	    	inlet: null
		};		
	    this._activeInlet = false;

		this.state = {
			mode: 'edit',
			modules : [
				{
					name: 'Clock',
					id: 10,
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
					id: 11,
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
					id: 12,
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
					id: 13,
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
					id: 14,
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
					id: 15,
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
					id: 16,
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
					id: 17,
					ui: [],
					jacks: [
						{
							name: 'Audio In',
							type: 'inlet'
						}
					]
				}
			],
			connections: []
		};
	}

	deleteModule(module) {
		let moduleIndex = _.findIndex(this.state.modules, 'id', module.props.id);
		this.state.modules.splice(moduleIndex,1);
		this.setState({
			modules: this.state.modules
		});
	}

	getActiveInlet() {
		return this._activeInlet;
	}

	onJackHoverOn(jack, position) {
		this._activeInlet = position
	}

	onJackHoverOff() {
		this._activeInlet = false
	}

	onNewCableEnabled(jack, position) {
        document.addEventListener('mouseup', this._mouseUp);
        this.setState({
        	connections: this.state.connections.concat({
        		type: 'cable',
        		position:position,
        		enabled: true
	        })
        });
    }

    mouseUp(event) {
		document.removeEventListener('mouseup', this._mouseUp);
        if (!this._activeInlet) {    	
	        this.state.connections.pop();
	        this.setState({
	        	connections: this.state.connections
	        });
        }
    }

	render() {
		let _this = this;
		let connections;

		if (this.state.mode === 'edit') {
			connections = this.state.connections.map(function(connection, keyId) {
				var Connection = Connections[connection.type];
				return <Connection key={'cable_' + keyId++} voice={_this} position={connection.position} enabled={connection.enabled} />
			})
		}

		return (
			<div>
				<Header voice={_this} />
				<div className="patch-container">
					{
						this.state.modules.map(function(module, keyId) {
							return <Module id={module.id} voice={_this} module={module} key={'voice_' + keyId++} name={module.name} ui={module.ui} />
						})
					}
					{connections}
				</div>
			</div>
		);
	}
}	