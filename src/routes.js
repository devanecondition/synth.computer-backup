import React from 'react';
import {Route} from 'react-router';
import Main from 'components/main/main';
import Voice from 'components/voice/voice';
import TempKnob from 'components/temp-knob/temp-knob';

import {RouteHandler, Link} from 'react-router';


const routes = (
	<Route>
		<Route name='/' handler={Main}/>
		<Route name='main' handler={Main}/>
		<Route name='voice' handler={Voice}/>
		<Route name='temp-knob' handler={TempKnob}/>
  	</Route>
);

export default routes;
