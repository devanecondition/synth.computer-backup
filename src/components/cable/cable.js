import React from 'react';

class SVGComponent extends React.Component {
    render() {
        return (
            <svg>{this.props.children}</svg>
        );
    }
};

export default class Cable extends React.Component {

	constructor(props) {
		super();
	}

	render() {
        return (
            <SVGComponent height="100" width="100">
        		<line x1="25" y1="25" x2="75" y2="75" strokeWidth="5" stroke="orange" />
            </SVGComponent>
		);
	}
}