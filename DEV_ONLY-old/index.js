// external dependencies
import React from 'react';
import {render} from 'react-dom';

// app
import App from './App';

const renderApp = (container, props = {}) => {
  render(<App {...props} />, container);
};

const div = document.createElement('div');

document.body.appendChild(div);

renderApp(div);
