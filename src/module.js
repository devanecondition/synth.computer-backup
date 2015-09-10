// Bootstrapping module
import React from 'react';
import Router from 'react-router';
import routes from 'routes';
import "./components/main/main.less";

Router.run(routes, Router.HistoryLocation, (Root, state) => {
	React.render(<Root {...state}/>, document.body);
});
