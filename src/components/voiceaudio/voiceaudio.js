import React from 'react';

// Safari fix...
window.AudioContext = window.AudioContext || window.webkitAudioContext;

var context = new AudioContext();


// var audioComponents = {
// 	oscillator : {
// 		initMethod: 'createOscillator',
// 		apis: [
// 			start: {
// 				name: 'start',
// 				type: 'method',
// 				methodName: 'start',
// 				arguments: [
// 					{
// 						type: 'number',
// 						range: {
// 							min: 0,
// 							max: 1,
// 							initValue: 0
// 						}
// 					}
// 				]
// 			},
// 			frequency: {
// 				name: 'frequency',
// 				type: 'method',
// 				methodName: 'frequency.setValueAtTime',
// 				arguments: [
// 					{
// 						type: 'number',
// 						range: {
// 							min: 0,
// 							max: 20000,
// 							initValue: 440
// 						}
// 					},
// 					{
// 						type: 'contextProp',
// 						prop: 'currentTime'
// 					}
// 				]
// 			},
// 			type: {
// 				name: 'name',
// 				type: 'string',
// 				options: [ 'sine', 'square', 'sawtooth', 'triangle' ],
// 				initValue: 'sine'
// 			}
// 		]
// 	},
// 	output
// };


export default class VoiceAudio extends React.Component {

	constructor() {
		super();




		this.runAudio();
	}

	runAudio() {

		this.output = context.destination;
		this.oscillator.connect(this.output);
	}

	render() {
		return (
			<div>
				this is audio
			</div>
		);
	}
}	