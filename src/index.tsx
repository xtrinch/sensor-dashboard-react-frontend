import * as Sentry from '@sentry/react';
import config from 'config/Config';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

Sentry.init({
  dsn: config.sentryDSN,
});

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorkerRegistration.register();
