(function (factory) {
    if (typeof exports === 'object') {
        // CommonJS
        module.exports = factory(require('jquery'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    /**
     * Kontrol library
     */
    "use strict";

    var privates = {
        $document : $(document),
        max       : Math.max,
        min       : Math.min,
        touch     : function (e) {
            return e.originalEvent.touches.length - 1;
        }
    };

    var Dial = function () {
        this.options = {}; // array of options
        this.$ = null; // jQuery wrapped element
        this.input = null; // mixed HTMLInputElement or array of HTMLInputElement
        this.graphics = null; // deprecated 2D graphics context for 'pre-rendering'
        this.value = null; // value ; mixed array or integer
        this.changeValue = null; // change value ; not commited value
        this.x = 0; // canvas x position
        this.y = 0; // canvas y position
        this.width = 0; // canvas width
        this.height = 0; // canvas height
        this.$canvas = null; // jQuery canvas element
        this.canvasContext = null; // rendered canvas context
        this.touchIndex = 0; // touches index
        this.isInit = false;
        this.fgColor = null; // main color
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
    };

    var thisDial = Dial.prototype;

    thisDial.run = function () {

        if (this.$.data('kontroled')) return;
        this.$.data('kontroled', true);

        this.options = this.extendOptions();

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

        this.canvasContext = this.setCanvasContext();
        this.scale = this.setScale();

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
        this._draw();

        return this;
    };

    thisDial.extendOptions = function() {
        return $.extend({

            bgColor: this.$.data('bgcolor') || '#EEEEEE',
            angleOffset: this.$.data('angleoffset') || 0,
            angleArc: this.$.data('anglearc') || 360,
            inline: true,

            // Config
            min: this.$.data('min') !== undefined ? this.$.data('min') : 0,
            max: this.$.data('max') !== undefined ? this.$.data('max') : 100,
            stopper: true,
            readOnly: this.$.data('readonly') || (this.$.attr('readonly') === 'readonly'),

            // UI
            cursor: this.$.data('cursor') === true && 30 || this.$.data('cursor') || 0,
            thickness: this.$.data('thickness') && Math.max(Math.min(this.$.data('thickness'), 1), 0.01) || 0.35,
            lineCap: this.$.data('linecap') || 'butt',
            width: this.$.data('width') || 200,
            height: this.$.data('height') || 200,
            displayInput: this.$.data('displayinput') == null || this.$.data('displayinput'),
            displayPrevious: this.$.data('displayprevious'),
            fgColor: this.$.data('fgcolor') || '#87CEEB',
            inputColor: this.$.data('inputcolor'),
            font: this.$.data('font') || 'Arial',
            fontWeight: this.$.data('font-weight') || 'bold',
            inline: false,
            step: this.$.data('step') || 1,
            rotation: this.$.data('rotation'),

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
        }, this.options );
    };

    thisDial.config = function (e, conf) {
        var knob;
        for (knob in conf) {
            _this.options[knob] = conf[knob];
        }
        _this._carve().init();
        _this._configure()._draw();
    };

    thisDial.routeValue = function() {

        var _this = this;

        // routing value
        if (this.$.is('fieldset')) {

            // fieldset = array of integer
            this.value = {};
            this.input = this.$.find('input');
            this.input.each(function(k) {
                var $this = $(this);
                _this.input[knob] = $this;
                _this.value[knob] = _this.options.parse($this.val());

                $this.bind(
                    'change blur',
                    function () {
                        var val = {};
                        val[knob] = $this.val();
                        _this.val(_this._validate(val));
                    }
                );
            });
            this.$.find('legend').remove();
        } else {

            // input = integer
            this.input = this.$;
            this.value = this.options.parse(this.$.val());
            this.value === '' && (this.value = this.options.min);
            this.$.bind(
                'change blur',
                function () {
                    _this.val(_this._validate(_this.options.parse(_this.$.val())));
                }
            );

        }
    };

    thisDial.buildElem = function() {
        this.$canvas = this.createCanvas();
        this.$div = this.createDiv();
        this.$.wrap(this.$div).before(this.$canvas);
        this.$div = this.$.parent();
    };

    thisDial.createCanvas = function() {
        // adds needed DOM elements (canvas, div)
        return $(document.createElement('canvas')).attr({
            width: this.options.width,
            height: this.options.height
        });
    };

    thisDial.createDiv = function() {
        // wraps all elements in a div
        // add to DOM before Canvas init is triggered
        return $('<div style="'
            + (this.options.inline ? 'display:inline;' : '')
            + 'width:' + this.options.width + 'px;height:' + this.options.height + 'px;'
            + '"></div>');
    };

    thisDial.setCanvasContext = function() {
        var canvasContext = this.$canvas[0].getContext ? this.$canvas[0].getContext('2d') : null;

        if (!canvasContext) {
            throw {
                name:        "CanvasNotSupportedException",
                message:     "Canvas not supported. Please use excanvas on IE8.0.",
                toString:    function(){return this.name + ": " + this.message}
            }
        }

        return canvasContext;
    };

    thisDial.setScale = function() {
        // hdpi support
        return (window.devicePixelRatio || 1) / (
            this.canvasContext.webkitBackingStorePixelRatio ||
            this.canvasContext.mozBackingStorePixelRatio ||
            this.canvasContext.msBackingStorePixelRatio ||
            this.canvasContext.oBackingStorePixelRatio ||
            this.canvasContext.backingStorePixelRatio || 1
        );
    };

    thisDial._carve = function() {
        if (this.relative) {
            var w = this.relativeWidth ?
                    this.$div.parent().width() *
                    parseInt(this.options.width) / 100
                    : this.$div.parent().width(),
                h = this.relativeHeight ?
                    this.$div.parent().height() *
                    parseInt(this.options.height) / 100
                    : this.$div.parent().height();

            // apply relative
            this.width = this.height = Math.min(w, h);
        } else {
            this.width = this.options.width;
            this.height = this.options.height;
        }

        // finalize div
        this.$div.css({
            'width': this.width + 'px',
            'height': this.height + 'px'
        });

        // finalize canvas with computed width
        this.$canvas.attr({
            width: this.w,
            height: this.h
        });

        // scaling
        if (this.scale !== 1) {
            this.$canvas[0].width = this.$canvas[0].width * this.scale;
            this.$canvas[0].height = this.$canvas[0].height * this.scale;
            this.$canvas.width(this.w);
            this.$canvas.height(this.h);
        }

        return this;
    }

    thisDial._draw = function () {

        // canvas pre-rendering
        var draw = true;

        this.graphics = this.canvasContext;

        this.clear();

        this.drawHook && (draw = this.drawHook());

        draw !== false && this.draw();
    };

    thisDial._touch = function (e) {
        var touchMove = function (e) {
            var value = _this.xy2val(
                        e.originalEvent.touches[_this.touchIndex].pageX,
                        e.originalEvent.touches[_this.touchIndex].pageY
                    );

            if (value == _this.changeValue) return;

            if (_this.changeHook && _this.changeHook(value) === false) return;

            _this.change(_this._validate(value));
            _this._draw();
        };

        // get touches index
        this.touchIndex = privates.touch(e);

        // First touch
        touchMove(e);

        // Touch events listeners
        privates.$document
            .bind("touchmove.knob", touchMove)
            .bind(
                "touchend.knob",
                function () {
                    privates.$document.unbind('touchmove.knob touchend.knob');
                    _this.val(_this.changeValue);
                }
            );

        return this;
    };

    thisDial._mouse = function (e, _this) {
        var mouseMove = function (e, _this) {
            var value = _this.xy2val(e.pageX, e.pageY);

            if (value == _this.changeValue) return;

            if (_this.changeHook && (_this.changeHook(value) === false)) return;

            _this.change(_this._validate(value));
            _this._draw();
        };

        // First click
        mouseMove(e, _this);

        // Mouse events listeners
        privates.$document
            .bind("mousemove.knob", function(e) {mouseMove(e, _this)})
            .bind(
                // Escape key cancel current change
                "keyup.knob",
                function (e) {
                    if (e.keyCode === 27) {
                        privates.$document.unbind("mouseup.knob mousemove.knob keyup.knob");

                        if (_this.cancelHook && _this.cancelHook() === false)
                            return;

                        _this.cancel();
                    }
                }
            )
            .bind(
                "mouseup.knob",
                function (e) {
                    privates.$document.unbind('mousemove.knob mouseup.knob keyup.knob');
                    _this.val(_this.changeValue);
                }
            );

        return this;
    };

    thisDial._xy = function () {
        var offset = this.$canvas.offset();
        this.x = offset.left;
        this.y = offset.top;

        return this;
    };

    thisDial._listen = function () {
        var _this = this;
        if (!this.options.readOnly) {
            this.$canvas
                .bind( "mousedown", function (e) {
                    e.preventDefault();
                    _this._xy()._mouse(e, _this);
                })
                .bind( "touchstart", function (e) {
                    e.preventDefault();
                    _this._xy()._touch(e, _this);
                });

            this.listen();
        } else {
            this.$.attr('readonly', 'readonly');
        }

        if (this.relative) {
            $(window).resize(function() {
                _this._carve().init();
                _this._draw();
            });
        }

        return this;
    };

    thisDial._configure = function () {

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
    };

    thisDial._clear = function () {
        this.$canvas[0].width = this.$canvas[0].width;
    };

    thisDial._validate = function (value) {
        var val = (~~ (((value < 0) ? -0.5 : 0.5) + (value/this.options.step))) * this.options.step;
        return Math.round(val * 100) / 100;
    };

    // Abstract methods
    thisDial.listen = function () {}; // on start, one time
    thisDial.extend = function () {}; // each time configure triggered
    thisDial.init = function () {}; // each time configure triggered
    thisDial.change = function (value) {}; // on change
    thisDial.val = function (value) {}; // on release
    thisDial.xy2val = function (x, y) {}; //
    thisDial.draw = function () {}; // on change / on release
    thisDial.clear = function () { this._clear(); };

    // Utils
    thisDial.h2rgba = function (hex, opacity) {
        var rgb;
        hex = hex.substring(1,7)
        rgb = [
            parseInt(hex.substring(0,2), 16),
            parseInt(hex.substring(2,4), 16),
            parseInt(hex.substring(4,6), 16)
        ];

        return "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + opacity + ")";
    };

    thisDial.copy = function (f, t) {
        for (var i in f) {
            t[i] = f[i];
        }
    };

    thisDial.val = function (value, triggerRelease) {
        if (null != value) {

            // reverse format
            value = this.options.parse(value);

            if (triggerRelease !== false
                && value != this.v
                && this.releaseHook
                && this.releaseHook(value) === false) { return; }

            this.changeValue = this.options.stopper ? privates.max(privates.min(value, this.options.max), this.options.min) : value;
            this.value = this.changeValue;
            this.$.val(this.options.format(this.value));
            this._draw();
        } else {
            return this.value;
        }
    };

    thisDial.xy2val = function (x, y) {
        var angle, ret;

        angle = Math.atan2(
                    x - (this.x + this.w2),
                    - (y - this.y - this.w2)
                ) - this.angleOffset;

        if (this.options.flip) {
            angle = this.angleArc - angle - this.PI2;
        }

        if (this.angleArc != this.PI2 && (angle < 0) && (angle > -0.5)) {

            // if isset angleArc option, set to min if .5 under min
            angle = 0;
        } else if (angle < 0) {
            angle += this.PI2;
        }

        ret = (angle * (this.options.max - this.options.min) / this.angleArc) + this.options.min;

        this.options.stopper && (ret = privates.max(privates.min(ret, this.options.max), this.options.min));

        return ret;
    };

    thisDial.listen = function () {

        // bind MouseWheel
        var _this = this, mwTimerStop,
            mwTimerRelease,
            mw = function (e) {
                e.preventDefault();

                var ori = e.originalEvent,
                    deltaX = ori.detail || ori.wheelDeltaX,
                    deltaY = ori.detail || ori.wheelDeltaY,
                    value = _this._validate(_this.options.parse(_this.$.val()))
                        + (
                            deltaX > 0 || deltaY > 0
                            ? _this.options.step
                            : deltaX < 0 || deltaY < 0 ? -_this.options.step : 0
                          );

                value = privates.max(privates.min(value, _this.options.max), _this.options.min);

                _this.val(value, false);

                if (_this.releaseHook) {
                    // Handle mousewheel stop
                    clearTimeout(mwTimerStop);
                    mwTimerStop = setTimeout(function () {
                        _this.releaseHook(value);
                        mwTimerStop = null;
                    }, 100);

                    // Handle mousewheel releases
                    if (!mwTimerRelease) {
                        mwTimerRelease = setTimeout(function () {
                            if (mwTimerStop)
                                _this.releaseHook(value);
                            mwTimerRelease = null;
                        }, 200);
                    }
                }
            },
            kval,
            to,
            m = 1,
            kv = {
                37: -_this.options.step,
                38: _this.options.step,
                39: _this.options.step,
                40: -_this.options.step
            };

        this.$
            .bind(
                "keydown",
                function (e) {
                    var keyCode = e.keyCode;

                    // numpad support
                    if (keyCode >= 96 && keyCode <= 105) {
                        keyCode = e.keyCode = keyCode - 48;
                    }

                    kval = parseInt(String.fromCharCode(keyCode));

                    if (isNaN(kval)) {
                        (keyCode !== 13)                     // enter
                        && keyCode !== 8                     // bs
                        && keyCode !== 9                     // tab
                        && keyCode !== 189                   // -
                        && (keyCode !== 190
                            || _this.$.val().match(/\./))   // . allowed once
                        && e.preventDefault();

                        // arrows
                        if ($.inArray(keyCode,[37,38,39,40]) > -1) {
                            e.preventDefault();

                            var v = _this.options.parse(_this.$.val()) + kv[keyCode] * m;
                            _this.options.stopper && (v = privates.max(min(v, _this.options.max), _this.options.min));

                            _this.change(_this._validate(v));
                            _this._draw();

                            // long time keydown speed-up
                            to = window.setTimeout(function () {
                                m *= 2;
                            }, 30);
                        }
                    }
                }
            )
            .bind(
                "keyup",
                function (e) {
                    if (isNaN(kval)) {
                        if (to) {
                            window.clearTimeout(to);
                            to = null;
                            m = 1;
                            _this.val(_this.$.val());
                        }
                    } else {
                        // kval postcond
                        (_this.$.val() > _this.options.max && _this.$.val(_this.options.max))
                        || (_this.$.val() < _this.options.min && _this.$.val(_this.options.min));
                    }
                }
            );

        this.$canvas.bind("mousewheel DOMMouseScroll", mw);
        this.$.bind("mousewheel DOMMouseScroll", mw)
    };

    thisDial.init = function () {
        if (this.value < this.options.min
            || this.value > this.options.max) { this.value = this.options.min; }

        this.$.val(this.value);
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

        this.options.displayInput && this.input.css({
            'width' : ((this.width / 2 + 4) >> 0) + 'px',
            'height' : ((this.width / 3) >> 0) + 'px',
            'position' : 'absolute',
            'vertical-align' : 'middle',
            'margin-top' : ((this.width / 3) >> 0) + 'px',
            'margin-left' : '-' + ((this.width * 3 / 4 + 2) >> 0) + 'px',
            'border' : 0,
            'background' : 'none',
            'font' : this.options.fontWeight + ' ' + ((this.width / s) >> 0) + 'px ' + this.options.font,
            'text-align' : 'center',
            'color' : this.options.inputColor || this.options.fgColor,
            'padding' : '0px',
            '-webkit-appearance': 'none'
        }) || this.input.css({
            'width': '0px',
            'visibility': 'hidden'
        });
    };

    thisDial.change = function (value) {
        this.changeValue = value;
        this.$.val(this.options.format(value));
    };

    thisDial.angle = function (value) {
        return (value - this.options.min) * this.angleArc / (this.options.max - this.options.min);
    };

    thisDial.arc = function (value) {
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
    };

    thisDial.draw = function () {
// if (this.value === 35 && this.options.angleArc == 250) {
// console.log(
//     'this.graphics', this.graphics,
//     '\nthis.changeValue', this.changeValue,
//     '\nthis.arc(this.changeValue)', this.arc(this.changeValue),
//     '\nthis.graphics.lineWidth', this.graphics.lineWidth,
//     '\nthis.graphics.lineCap', this.graphics.lineCap,
//     '\nthis.options.bgColor', this.options.bgColor,
//     '\nthis.xy', this.xy,
//     '\nthis.radius', this.radius,
//     '\nthis.endAngle', this.endAngle,
//     '\nthis.startAngle', this.startAngle,
//     '\nthis.options.displayPrevious', this.options.displayPrevious,
//     '\nthis.pColor', this.pColor,
//     '\nthis.options', this.options
// );
// }
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
    };

    thisDial.cancel = function () {
        this.val(this.value);
    };

    $.fn.dial = $.fn.knob = function (options) {
        return this.each(
            function () {
                var dial = new Dial();
                dial.options = options;
                dial.$ = $(this);
                dial.run();
            }
        ).parent();
    };

}));