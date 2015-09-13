import React from 'react';

var privates = {
    // $document : $(document),
    max       : Math.max,
    min       : Math.min,
    touch     : function (e) {
        return e.originalEvent.touches.length - 1;
    }
};

class KnobWrapper extends React.Component {
	render() {

        var styles = {
            height: this.props.height,
            width : this.props.width
        };

        if (this.props.inline) {
            styles.display = 'inline';
        }

		return (
			<div style={styles}>
          		{this.props.children}
			</div>
		);
	}	
}

class KnobCanvas extends React.Component {

	constructor( props ) {
		super();

        this.options = props.options || {};

        // UI
        this.input = null; // mixed HTMLInputElement or array of HTMLInputElement
        this.graphics = null; // deprecated 2D graphics context for 'pre-rendering'
        this.value = props.value || 0; // value ; mixed array or integer
        this.changeValue = null; // change value ; not commited value
        this.x = 0; // canvas x position
        this.y = 0; // canvas y position
        this.canvasContext = null; // rendered canvas context
        this.touchIndex = 0; // touches index
        this.pColor = null; // previous color
        this.drawHook = null; // draw hook
        this.changeHook = null; // change hook
        this.cancelHook = null; // cancel hook
        this.releaseHook = null; // release hook
        this.scale = 1; // scale factor
        this.relativeWidth = props.width % 1 !== 0 && props.width.indexOf('%');
        this.relativeHeight = props.height % 1 !== 0 && props.height.indexOf('%');
        this.relative = this.relativeWidth || this.relativeHeight;
        this.startAngle = null;
        this.xy = null;
        this.radius = null;
        this.lineWidth = null;
        this.cursorExt = null;
        this.w2 = null;
        this.PI2 = 2*Math.PI;
	}

	componentDidMount(component) {

        // not sure what this does...
        // if (typeof G_vmlCanvasManager !== 'undefined') {
        //     G_vmlCanvasManager.initElement(this.$canvas[0]);
        // }

		this.canvasContext = this.setCanvasContext();
		this.scale = this.setScale();

        // prepares props for transaction
        if (this.value instanceof Object) {
            this.changeValue = {};
            this.copy(this.value, this.changeValue);
        } else {
            this.changeValue = this.value;
        }

        this
            ._configure()
            ._xy()
            .init()
            ._draw();
	}

	componentDidUpdate() {
		this.canvasContext = this.setCanvasContext();
		this.scale = this.setScale();
	}

    setCanvasContext() {
        var canvasContext = React.findDOMNode(this).getContext('2d');

        if (!canvasContext) {
            throw {
                name:        "CanvasNotSupportedException",
                message:     "Canvas not supported. Please use excanvas on IE8.0.",
                toString:    function(){return this.name + ": " + this.message}
            }
        }

        return canvasContext;
    }

    setScale() {
        // hdpi support
        return (window.devicePixelRatio || 1) / (
            this.canvasContext.webkitBackingStorePixelRatio ||
            this.canvasContext.mozBackingStorePixelRatio ||
            this.canvasContext.msBackingStorePixelRatio ||
            this.canvasContext.oBackingStorePixelRatio ||
            this.canvasContext.backingStorePixelRatio || 1
        );
    }

    // Utils
    h2rgba(hex, opacity) {
        var rgb;
        hex = hex.substring(1,7)
        rgb = [
            parseInt(hex.substring(0,2), 16),
            parseInt(hex.substring(2,4), 16),
            parseInt(hex.substring(4,6), 16)
        ];

        return "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + opacity + ")";
    }

    copy(f, t) {
        for (var i in f) {
            t[i] = f[i];
        }
    }

    _configure() {

        // Hooks
        if (this.options.draw) this.drawHook = this.options.draw;
        if (this.options.change) this.changeHook = this.options.change;
        if (this.options.cancel) this.cancelHook = this.options.cancel;
        if (this.options.release) this.releaseHook = this.options.release;

        if (this.options.displayPrevious) {
            this.pColor = this.h2rgba(this.options.fgColor, "0.4");
            this.fgColor = this.h2rgba(this.options.fgColor, "0.6");
        } else {
            this.fgColor = this.options.fgColor;
        }

        return this;
    }

    _xy() {
        var node = React.findDOMNode(this);

        this.x = 1;
        this.y = 1;

        return this;
    }

    init() {

        if (this.value < this.options.min || this.value > this.options.max) { this.value = this.options.min; }

        this.w2 = this.props.width / 2;
        this.cursorExt = this.options.cursor / 100;
        this.xy = this.w2 * this.scale;
        this.lineWidth = this.xy * this.options.thickness;
        this.lineCap = this.options.lineCap;
        this.radius = this.xy - this.lineWidth / 2;

        this.options.angleOffset
        && (this.options.angleOffset = isNaN(this.options.angleOffset) ? 0 : this.options.angleOffset);

        this.options.angleArc
        && (this.options.angleArc = isNaN(this.options.angleArc) ? this.PI2 : this.options.angleArc);

        // deg to rad
        this.angleOffset = this.options.angleOffset * Math.PI / 180;
        this.angleArc = this.options.angleArc * Math.PI / 180;

        // compute start and end angles
        this.startAngle = 1.5 * Math.PI + this.angleOffset;
        this.endAngle = 1.5 * Math.PI + this.angleOffset + this.angleArc;

        return this;
    }

    _draw() {

        var draw = true;

        this.graphics = this.canvasContext;

        this.drawHook && (draw = this.drawHook());

        draw !== false && this.draw();
    }

    angle(value) {
        return (value - this.options.min) * this.angleArc / (this.options.max - this.options.min);
    }

    arc(value) {
        var startAngle, endAngle;
        value = this.angle(value);

        if (this.options.flip) {
            startAngle = this.endAngle + 0.00001;
            endAngle = startAngle - value - 0.00001;
        } else {
            startAngle = this.startAngle - 0.00001;
            endAngle = startAngle + value + 0.00001;
        }

        this.options.cursor
        && (startAngle = endAngle - this.cursorExt)
        && (endAngle = endAngle + this.cursorExt);

        return {
            start: startAngle,
            end: endAngle,
            degree: this.options.flip && !this.options.cursor
        };
    }

    draw() {

        var graphics = this.graphics,                 // context
            arc = this.arc(this.changeValue),      // Arc
            previousArc,                         // Previous arc
            r = 1;

        graphics.lineWidth = this.lineWidth;
        graphics.lineCap = this.lineCap;

        if (this.options.bgColor !== "none") {
            graphics.beginPath();
            graphics.strokeStyle = this.options.bgColor;
            graphics.arc(this.xy, this.xy, this.radius, this.endAngle - 0.00001, this.startAngle + 0.00001, true);
            graphics.stroke();
        }

        if (this.options.displayPrevious) {
            previousArc = this.arc(this.value);
            graphics.beginPath();
            graphics.strokeStyle = this.pColor;
            graphics.arc(this.xy, this.xy, this.radius, previousArc.start, previousArc.end, previousArc.degree);
            graphics.stroke();
            r = this.changeValue == this.value;
        }

        graphics.beginPath();
        graphics.strokeStyle = r ? this.options.fgColor : this.fgColor;
        graphics.arc(this.xy, this.xy, this.radius, arc.start, arc.end, arc.degree);
        graphics.stroke();
    }

	render() {
		return (
			<canvas height={this.props.height} width={this.props.width}></canvas>
		);
	}
}

class KnobInput extends React.Component {

	constructor( props ) {
		super();

        var s = privates.max(
            String(Math.abs(props.options.max)).length,
            String(Math.abs(props.options.min)).length,
            2
        ) + 2;

        this.options = props.options || {};

		this.styles = this.options.displayInput ? {
            width : ((props.width / 2 + 4) >> 0) + 'px',
            height : ((props.width / 3) >> 0) + 'px',
            position : 'absolute',
            verticalAlign : 'middle',
            marginTop : ((props.width / 3) >> 0) + 'px',
            marginLeft : '-' + ((props.width * 3 / 4 + 2) >> 0) + 'px',
            border : 0,
            background : 'none',
            font : this.options.fontWeight + ' ' + ((props.width / s) >> 0) + 'px ' + this.options.font,
            textAlign : 'center',
            color : this.options.inputColor,
            padding : '0px',
            WebkitAppearance: 'none'
		} : {
            width: '0px',
            visibility: 'hidden'
		}
	}

	render() {
		return (
			<input type="text" readOnly value={this.props.value} style={this.styles} />
		);
	}	
}

export default class ReactJSKnob extends React.Component {

	constructor( props ) {
		super();

        this.width = props.width || 200;
        this.height = props.height || 200;
        this.options = props.options || {};
        this.options.min = this.options.min !== undefined ? this.options.min : 0;
        this.options.max = this.options.max !== undefined ? this.options.max : 100;
        this.options.bgColor = this.options.bgColor || '#EEEEEE';
        this.options.fgColor = this.options.fgColor || '#87CEEB';
        this.options.angleOffset = this.options.angleOffset || 0;
        this.options.angleArc = this.options.angleArc || 360;
        this.options.displayInput = this.options.displayInput !== undefined ? this.options.displayInput : true;
        this.options.inputColor = this.options.inputColor || this.options.fgColor;

        // TO DO: need to check if these are hooked up...
        this.options.cursor = this.options.cursor === true && 30 || this.options.cursor || 0;
        this.options.inline = this.options.inline || true;
        this.options.stopper = this.options.stopper || true;
        this.options.readOnly = this.options.readOnly || false;
        this.options.thickness = this.options.thickness && Math.max(Math.min(this.options.thickness, 1), 0.01) || 0.35;
        this.options.lineCap = this.options.linecap || 'butt';
        this.options.displayPrevious = this.options.displayprevious;
        this.options.font = this.options.font || 'Arial';
        this.options.fontWeight = this.options['font-weight'] || 'bold';
        this.options.step = this.options.step || 1;
        this.options.rotation = this.options.rotation;
        this.options.flip = this.options.rotation === 'anticlockwise' || this.options.rotation === 'acw';

        // Hooks
        this.options.draw = null, // function () {}
        this.options.change = null, // function (value) {}
        this.options.cancel = null, // function () {}
        this.options.release = null, // function (value) {}

        // Output formatting, allows to add unit = %, ms ...
        this.options.format = function(v) {
            return v;
        },
        this.options.parse = function (v) {
            return parseFloat(v);
        }
	}

	render() {
		return (
			<KnobWrapper height={this.height} width={this.width} inline={this.options.inline}>
				<KnobCanvas height={this.height} width={this.width} value={this.props.value} options={this.options} />
				<KnobInput height={this.height} width={this.width} value={this.props.value} options={this.options} />
			</KnobWrapper>
		);
	}
}