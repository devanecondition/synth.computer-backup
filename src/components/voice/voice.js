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

	    this.connectionComponents = [];

	    this.cablesBuilt = false;

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
			connections: [
				{
					id: 1,
	        		type: 'cable',
	        		start_module_id: 10,
        			start_jack_id: 0,
	        		end_module_id: 16,
        			end_jack_id: 1
		        },
				{
					id: 2,
	        		type: 'cable',
	        		start_module_id: 11,
        			start_jack_id: 2,
	        		end_module_id: 13,
        			end_jack_id: 0
		        }
			]
		};
	}

	deleteModule(module) {
		let moduleIndex = _.findIndex(this.state.modules, 'id', module.props.id);
		// let moduleConnections = 
		this.state.modules.splice(moduleIndex,1);
this.cablesBuilt = false;
		this.setState({
			modules: this.state.modules
		});
	}

	getActiveInlet() {
		return this._activeInlet;
	}

	onJackHoverOn(jackParams) {
		this._activeInlet = {
			end_module_id: jackParams.moduleId,
			end_jack_id: jackParams.jackId
		}
	}

	onJackHoverOff() {
		this._activeInlet = false
	}

	onNewCableEnabled(cableParams) {
		this.activeCable = this.createNewCable({
			id: new Date().getTime(),
    		type: 'cable',
    		start_module_id: cableParams.moduleId,
			start_jack_id: cableParams.jackId,
    		enabled: true
        });
        document.addEventListener('mouseup', this._mouseUp);
    }

    mouseUp(event) {

		document.removeEventListener('mouseup', this._mouseUp);

        if (!this._activeInlet) {
        	this.removeCable(this.activeCable.id);
        } else {
        	let connections = this.state.connections;
        	let cable = _.findWhere(connections, {id: this.activeCable.id});
        	_.assign(cable, this._activeInlet);
    		this.cablesBuilt = false;
        	this.setState({
        		connections: connections
        	});
        	this.forceUpdate();
        }

        this.activeCable = null;
    }

    createNewCable(cable) {
    	this.cablesBuilt = false;
        this.setState({
        	connections: this.state.connections.concat(cable)
        });
        return cable;
    }

    removeCable(cableId) {

		let cableIndex = _.findIndex(this.state.connections, 'id', cableId);

		this.cablesBuilt = false;

        this.state.connections.splice(cableIndex, 1);
        this.setState({
        	connections: this.state.connections
        });
    }

    getJackPosition(params) {

    	params = params || {};

		let module = this.refs['module_' + params.module_id];
		let jack = (module) ? module.getJackById(params.jack_id) : {};

		if (_.isFunction(jack.getPosition)) {
			return jack.getPosition();
		} else {
			return null;
		}
    }

    buildCables() {

		this.connectionComponents = this.state.connections.map(function(connection, keyId) {
			let Connection = Connections[connection.type];
    		let startPostion = this.getJackPosition({module_id: connection.start_module_id, jack_id: connection.start_jack_id});
    		let endPosition = this.getJackPosition({module_id: connection.end_module_id, jack_id: connection.end_jack_id});
    		let enabled = (endPosition) ? false : true;

			return <Connection key={'cable_' + keyId++} voice={this} startPosition={startPostion} endPosition={endPosition} enabled={enabled} />			
    	}, this);

		this.cablesBuilt = true;
    	this.forceUpdate();
    }

    componentDidUpdate() {
    	if (!this.cablesBuilt) {
    		this.buildCables();
    	}
    }

    componentDidMount() {
    	if (!this.cablesBuilt) {
    		this.buildCables();
    	}
    }

	render() {

		let _this = this;
		let connections;

		if (this.state.mode === 'edit') {
			connections = this.connectionComponents;
		}

		return (
			<div>
				<Header voice={_this} />
				<div className="patch-container">
					{
						this.state.modules.map(function(module, keyId) {
							return <Module id={module.id} ref={'module_' + module.id} voice={_this} module={module} key={'voice_' + keyId++} name={module.name} ui={module.ui} />
						})
					}
					{connections}
				</div>
			</div>
		);
	}
}	