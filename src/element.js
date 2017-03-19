// external dependencies
import {
  render
} from 'react-dom';

// constants
import {
  RENDER_CONTAINER_ID
} from './constants';

/**
 * @function getMainContainer
 *
 * @description
 * get the main container that future containers will be rendered into
 *
 * @param {Object} doc document to render into
 * @returns {HTMLElement} the main container that all future containers will render into
 */
export const getMainContainer = (doc) => {
  const container = doc.createElement('div');

  container.id = RENDER_CONTAINER_ID;

  container.style.left = '-10000px';
  container.style.position = 'absolute';
  container.style.top = '-10000px';
  container.style.visibility = 'hidden';

  return container;
};

/**
 * @function getNewContainer
 *
 * @description
 * get a new container that has the necessary styles for rendering
 *
 * @param {Object} doc document to create element with
 * @param {string} type the type of element to use for the container
 * @param {number|string} width the width to assign to the container
 * @returns {HTMLElement} the new container element
 */
export const getNewContainer = (doc, type, width) => {
  const container = doc.createElement(type);

  container.style.width = typeof width === 'number' ? `${width}px` : width;

  return container;
};

/**
 * @function getRenderedElement
 *
 * @description
 * get the element rendered into the container
 *
 * @param {HTMLElement} container the container to render into
 * @param {ReactElement} element the element to render into the container
 * @returns {HTMLElement} the ReactElement rendered as a DOM element
 */
export const getRenderedElement = (container, element) => {
  return render(element, container);
};
