import React from 'react';
import {Route} from 'react-router';
import Main from 'components/main/main';
import Voice from 'components/voice/voice';

import {RouteHandler, Link} from 'react-router';


const routes = (
	<Route>
		<Route name='/' handler={Main}/>
		<Route name='main' handler={Main}/>
		<Route name='voice' handler={Voice}/>
  	</Route>
);

export default routes;
