import React from 'react';

import './knob.less';

export default class Knob extends React.Component {

	constructor() {
		super();

		this._seconds = 0;
		this._radius = null;
		this._fraction = null;
		this._content = null;
		this._canvas = null;
		this.propTypes = {
			seconds: React.PropTypes.number,
			size: React.PropTypes.number,
			color: React.PropTypes.string,
			alpha: React.PropTypes.number,
			onComplete: React.PropTypes.func
		}
	}

	getDefaultProps() {
		return {
			size: 300,
			color: '#000',
			alpha: 1
		};
	}

	componentWillReceiveProps(props) {
		this._seconds = props.seconds;
		return this._setupTimer();
	}

	componentDidMount() {
		this._seconds = this.props.seconds;
		return this._setupTimer();
	}

	_setupTimer() {
		this._setScale();
		this._setupCanvas();
		this._drawTimer();
		return this._startTimer();
	}

	_updateCanvas() {
		this._clearTimer();
		return this._drawTimer();
	}

	_setScale() {
		this._radius = this.props.size / 2;
		this._fraction = 2 / this._seconds;
		return this._tickPeriod = this._seconds * 1.8;
	}

	_setupCanvas() {
		this._canvas = <canvas />;//this.getDOMNode();
		this._context = this._canvas.getContext('2d');
		this._context.textAlign = 'center';
		this._context.textBaseline = 'middle';
		return this._context.font = "bold " + (this._radius / 2) + "px Arial";
	}

	_startTimer() {
		return setTimeout(((function(_this) {
			return function() {
				return _this._tick();
			};
		})(this)), 200);
	}

	_tick() {
		var start;
		start = Date.now();
		return setTimeout(((function(_this) {
			return function() {
				var duration;
				duration = (Date.now() - start) / 1000;
				_this._seconds -= duration;
				if (_this._seconds <= 0) {
					_this._seconds = 0;
					_this._handleComplete();
					return _this._clearTimer();
				} else {
					_this._updateCanvas();
					return _this._tick();
				}
			};
		})(this)), this._tickPeriod);
	}

	_handleComplete() {
		if (this.props.onComplete) {
			return this.props.onComplete();
		}
	}

	_clearTimer() {
		this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
		return this._drawBackground();
	}

	_drawBackground() {
		this._context.beginPath();
		this._context.globalAlpha = this.props.alpha / 3;
		this._context.arc(this._radius, this._radius, this._radius, 0, Math.PI * 2, false);
		this._context.arc(this._radius, this._radius, this._radius / 1.8, Math.PI * 2, 0, true);
		return this._context.fill();
	}

	_drawTimer() {
		var decimals, percent, ref;
		percent = this._fraction * this._seconds + 1.5;
		decimals = (ref = this._seconds <= 9.9) != null ? ref : {
			1: 0
		};
		this._context.globalAlpha = this.props.alpha;
		this._context.fillStyle = this.props.color;
		this._context.fillText(this._seconds.toFixed(decimals), this._radius, this._radius);
		this._context.beginPath();
		this._context.arc(this._radius, this._radius, this._radius, Math.PI * 1.5, Math.PI * percent, false);
		this._context.arc(this._radius, this._radius, this._radius / 1.8, Math.PI * percent, Math.PI * 1.5, true);
		return this._context.fill();
	}

	render() {
		return <canvas className="react-countdown-clock" width={this.props.size} height={this.props.size} />;
	}
}