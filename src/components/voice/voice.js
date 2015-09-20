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
	    this._newCable = {
	    	cable: null,
	    	outlet: null,
	    	inlet: null
		};		
	    this._cableHoveredOverInlet = false;

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
		var moduleIndex = _.findIndex(this.state.modules, 'id', module.props.id);
		this.state.modules.splice(moduleIndex,1);
		this.setState({
			modules: this.state.modules
		});
	}

    _getElemPosition(module) {

        var el = React.findDOMNode(module);
        var el2 = el;
        var x = 0;
        var y = 0;

        if (document.getElementById || document.all) {
            do  {
                x += el.offsetLeft-el.scrollLeft;
                y += el.offsetTop-el.scrollTop;
                el = el.offsetParent;
                el2 = el2.parentNode;
                while (el2 != el) {
                    x -= el2.scrollLeft;
                    y -= el2.scrollTop;
                    el2 = el2.parentNode;
                }
            } while (el.offsetParent);

        } else if (document.layers) {
            y += el.y;
            x += el.x;
        }

        return { x:x, y:y };
    }

	onJackHoverOn(jack, module) {
console.log(jack.props.id, module.props.id);
		this._cableHoveredOverInlet = true
	}

	onJackHoverOff() {
		this._cableHoveredOverInlet = false
	}

	onNewCableEnabled(jack, module, event) {
		// var jackPosition = this._getElemPosition(module);
console.log(jack, module.props.id);

        document.addEventListener('mouseup', this._mouseUp.bind(this));
        this.setState({
        	connections: this.state.connections.concat({
        		type: 'cable',
        		position:{
        			top: event.pageY,
        			left: event.pageX
        		},
        		enabled: true
	        })
        });
    }

    mouseUp(event) {
        document.removeEventListener('mousemove', this._mouseMove);
        document.removeEventListener('mouseup', this._mouseMove);
    }

	render() {
		var _this = this;
		return (
			<div>
				<Header voice={_this} />
				<div className="patch-container">
					{
						this.state.modules.map(function(module, keyId) {
							return <Module id={module.id} voice={_this} module={module} key={'voice_' + keyId++} name={module.name} ui={module.ui} />
						})
					}
					{
						this.state.connections.map(function(connection, keyId) {
							var Connection = Connections[connection.type];
							return <Connection position={connection.position} enabled={connection.enabled} />
						})
					}
				</div>
			</div>
		);
	}
}	