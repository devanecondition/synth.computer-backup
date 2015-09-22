import React from 'react';
import {Route} from 'react-router';
import Main from 'components/main/main';
import Voice from 'components/voice/voice';
import VoiceAudio from 'components/voiceaudio/voiceaudio';

import {RouteHandler, Link} from 'react-router';


const routes = (
	<Route>
		<Route name='/' handler={Main}/>
		<Route name='main' handler={Main}/>
		<Route name='voice' handler={Voice}/>
		<Route name='voiceaudio' handler={VoiceAudio}/>
  	</Route>
);

export default routes;
