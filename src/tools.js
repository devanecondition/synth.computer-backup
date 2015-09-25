import React from 'react';

let Tools = {

    getElemPosition(el) {

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

        return {
        	left:x,
        	top:y
        };
    }

};

export default Tools;