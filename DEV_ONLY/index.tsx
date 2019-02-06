/* globals document */

// external dependencies
import React from 'react';
import { render } from 'react-dom';

// app
import App from './App';

const renderApp = (container: HTMLElement, props = {}) => {
  render(<App {...props} />, container);
};

const div = document.createElement('div');

document.body.appendChild(div);

renderApp(div);
