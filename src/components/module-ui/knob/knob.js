import React from 'react';
import './knob.less';

var privates = {
    // $document : $(document),
    max       : Math.max,
    min       : Math.min,
    touch     : function (e) {
        return e.originalEvent.touches.length - 1;
    }
};

export default class Knob extends React.Component {

	constructor( props ) {
		super();
        this.options = {

            bgColor: props.bgcolor || '#EEEEEE',
            angleOffset: props.options.angleOffset || 0,
            angleArc: props.options.angleArc || 360,
            inline: true,

            // Config
            min: props.options.min !== undefined ? props.options.min : 0,
            max: props.options.max !== undefined ? props.options.max : 100,
            stopper: true,
            readOnly: props.readonly || (props.readonly === 'readonly'),

            // UI
            cursor: props.cursor === true && 30 || props.cursor || 0,
            thickness: props.thickness && Math.max(Math.min(props.thickness, 1), 0.01) || 0.35,
            lineCap: props.linecap || 'butt',
            width: props.width || 200,
            height: props.height || 200,
            displayInput: props.displayinput == null || props.displayinput,
            displayPrevious: props.displayprevious,
            fgColor: props.options.fgColor || '#87CEEB',
            inputColor: props.inputcolor,
            font: props.font || 'Arial',
            fontWeight: props['font-weight'] || 'bold',
            // inline: false,
            step: props.step || 1,
            rotation: props.rotation,

            // Hooks
            draw: null, // function () {}
            change: null, // function (value) {}
            cancel: null, // function () {}
            release: null, // function (value) {}

            // Output formatting, allows to add unit: %, ms ...
            format: function(v) {
                return v;
            },
            parse: function (v) {
                return parseFloat(v);
            }
        }; // array of options
        this.$ = null; // jQuery wrapped element
        this.input = null; // mixed HTMLInputElement or array of HTMLInputElement
        this.graphics = null; // deprecated 2D graphics context for 'pre-rendering'
        this.value = props.value || null; // value ; mixed array or integer
        this.changeValue = null; // change value ; not commited value
        this.x = 0; // canvas x position
        this.y = 0; // canvas y position
        this.width = 0; // canvas width
        this.height = 0; // canvas height
        this.$canvas = null; // jQuery canvas element
        this.canvasContext = null; // rendered canvas context
        this.touchIndex = 0; // touches index
        this.isInit = false;
        this.fgColor = props.fgColor || null; // main color
        this.pColor = null; // previous color
        this.drawHook = null; // draw hook
        this.changeHook = null; // change hook
        this.cancelHook = null; // cancel hook
        this.releaseHook = null; // release hook
        this.scale = 1; // scale factor
        this.relative = false;
        this.relativeWidth = false;
        this.relativeHeight = false;
        this.$div = null; // component div
        this.startAngle = null;
        this.xy = null;
        this.radius = null;
        this.lineWidth = null;
        this.cursorExt = null;
        this.w2 = null;
        this.PI2 = 2*Math.PI;
	}

	componentDidMount(component) {
		this.canvasContext = this.setCanvasContext();
		this.scale = this.setScale();
console.log('componentDidMount', this.options);
        // detects relative width / height
        this.relativeWidth =  this.options.width % 1 !== 0 && this.options.width.indexOf('%');
        this.relativeHeight = this.options.height % 1 !== 0 && this.options.height.indexOf('%');
        this.relative = this.relativeWidth || this.relativeHeight;

        // prepares props for transaction
        if (this.value instanceof Object) {
            this.changeValue = {};
            this.copy(this.value, this.changeValue);
        } else {
            this.changeValue = this.value;
        }

        this._configure();
		this._xy();
		this.init();
		this._draw();
		// this.paint();
	}

	componentDidUpdate() {
		this.canvasContext = this.setCanvasContext();
		this.scale = this.setScale();

		// do we need to cleat the canvas?
		// context.clearRect(0, 0, 200, 200);

	}

    buildElem() {
        this.$canvas = this.createCanvas();
        this.$div = this.createDiv();
        this.$.wrap(this.$div).before(this.$canvas);
        this.$div = this.$.parent();
    }

	render() {
		return (
			<canvas ref="canvas" width="200" height="200px"></canvas>
		);
	}

    createCanvas() {
        // adds needed DOM elements (canvas, div)
        return $(document.createElement('canvas')).attr({
            width: this.options.width,
            height: this.options.height
        });
    }

    createDiv() {
        // wraps all elements in a div
        // add to DOM before Canvas init is triggered
        return $('<div style="'
            + (this.options.inline ? 'display:inline;' : '')
            + 'width:' + this.options.width + 'px;height:' + this.options.height + 'px;'
            + '"></div>');
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

    runDone() {
        // this.canvasContext = this.setCanvasContext();
        // this.scale = this.setScale();
        // this.options = this.extendOptions();
        // this._draw();
    }

    run() {

        if (this.$.data('kontroled')) return;
        this.$.data('kontroled', true);

        // finalize options
        this.options.flip = this.options.rotation === 'anticlockwise' || this.options.rotation === 'acw';
        if (!this.options.inputColor) {
            this.options.inputColor = this.options.fgColor;
        }

        this.routeValue();

        !this.options.displayInput && this.$.hide();

        this.buildElem();

        if (typeof G_vmlCanvasManager !== 'undefined') {
            G_vmlCanvasManager.initElement(this.$canvas[0]);
        }



        // detects relative width / height
        this.relativeWidth =  this.options.width % 1 !== 0 && this.options.width.indexOf('%');
        this.relativeHeight = this.options.height % 1 !== 0 && this.options.height.indexOf('%');
        this.relative = this.relativeWidth || this.relativeHeight;

        // computes size and carves the component
        this._carve();

        // prepares props for transaction
        if (this.value instanceof Object) {
            this.changeValue = {};
            this.copy(this.value, this.changeValue);
        } else {
            this.changeValue = this.value;
        }

        // binds configure event
        this.$
            .bind("configure", this.config)
            .parent()
            .bind("configure", this.config);

        // finalize init
        this._listen()
            ._configure()
            ._xy()
            .init();

        this.isInit = true;

        this.$.val(this.options.format(this.value));

        return this;
    };

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
console.log(node);
        this.x = 1;
        this.y = 1;

        return this;
    }

    init() {
        if (this.value < this.options.min
            || this.value > this.options.max) { this.value = this.options.min; }

        // this.$.val(this.value);
        this.w2 = this.width / 2;
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

        var s = privates.max(
            String(Math.abs(this.options.max)).length,
            String(Math.abs(this.options.min)).length,
            2
        ) + 2;

        // this.options.displayInput && this.input.css({
        //     'width' : ((this.width / 2 + 4) >> 0) + 'px',
        //     'height' : ((this.width / 3) >> 0) + 'px',
        //     'position' : 'absolute',
        //     'vertical-align' : 'middle',
        //     'margin-top' : ((this.width / 3) >> 0) + 'px',
        //     'margin-left' : '-' + ((this.width * 3 / 4 + 2) >> 0) + 'px',
        //     'border' : 0,
        //     'background' : 'none',
        //     'font' : this.options.fontWeight + ' ' + ((this.width / s) >> 0) + 'px ' + this.options.font,
        //     'text-align' : 'center',
        //     'color' : this.options.inputColor || this.options.fgColor,
        //     'padding' : '0px',
        //     '-webkit-appearance': 'none'
        // }) || this.input.css({
        //     'width': '0px',
        //     'visibility': 'hidden'
        // });
    }

    _draw() {

        // canvas pre-rendering
        var draw = true;

        this.graphics = this.canvasContext;

// this.clear();

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
console.log(
    'this.graphics', this.graphics,
    '\nthis.changeValue', this.changeValue,
    '\nthis.arc(this.changeValue)', this.arc(this.changeValue),
    '\nthis.graphics.lineWidth', this.graphics.lineWidth,
    '\nthis.graphics.lineCap', this.graphics.lineCap,
    '\nthis.options.bgColor', this.options.bgColor,
    '\nthis.xy', this.xy,
    '\nthis.radius', this.radius,
    '\nthis.endAngle', this.endAngle,
    '\nthis.startAngle', this.startAngle,
    '\nthis.options.displayPrevious', this.options.displayPrevious,
    '\nthis.pColor', this.pColor,
    '\nthis.options', this.options
);

        var graphics = this.graphics,                 // context
            arc = this.arc(this.changeValue),      // Arc
            previousArc,                         // Previous arc
            r = 1;
this.xy = 75;
this.radius = 61.875;
this.lineWidth = this.xy * this.options.thickness;
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












	paint() {
		var context = this.canvasContext;
		context.save();
		context.translate(100, 100);
		context.rotate(this.props.rotation, 100, 100);
		context.fillStyle = '#F00';
		context.fillRect(-50, -50, 100, 100);
		context.restore();
	}

	render() {
		return (
			<canvas className="georgio" height="150" width="150"></canvas>
		);
	}
}