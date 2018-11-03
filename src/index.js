// constants
import {DEFAULT_CONTAINER_ELEMENT} from './constants';

// element
import {getMainContainer, getNewContainer, getRenderedElement} from './element';

let mainContainer;

/**
 * @function getRenderedSize
 *
 * @description
 * get the rendered height and width of the ReactElement passed based on a given containerWidth
 *
 * @param {ReactElement} element the element to get the rendered size of
 * @param {number} containerWidth the width in pixels of the container to render in
 * @param {Object} [containerOptions={}] additional options for generating the container
 * @returns {{height: number, width: number}} the size of the rendered ReactElement
 */
export const getRenderedSize = (element, containerWidth, containerOptions = {}) => {
  const {container, doc = document, type = DEFAULT_CONTAINER_ELEMENT} = containerOptions;

  if (!mainContainer) {
    mainContainer = getMainContainer(doc);

    doc.body.appendChild(mainContainer);
  }

  const renderContainer = getNewContainer(doc, type, container, containerWidth || doc.documentElement.clientWidth);

  mainContainer.appendChild(renderContainer);

  const renderedElement = getRenderedElement(renderContainer, element);
  const size = {
    height: renderedElement.offsetHeight,
    width: renderedElement.offsetWidth
  };

  mainContainer.removeChild(renderContainer);

  return size;
};

/**
 * @function getRenderedHeight
 *
 * @description
 * shortcut method to get only the height property from getRenderedSize
 *
 * @param {...Array<*>} args the arguments to pass to getRenderedSize
 * @returns {number} the rendered height
 */
export const getRenderedHeight = (...args) => {
  const size = getRenderedSize(...args);

  return size.height;
};

/**
 * @function getRenderedWidth
 *
 * @description
 * shortcut method to get only the width property from getRenderedSize
 *
 * @param {...Array<*>} args the arguments to pass to getRenderedSize
 * @returns {number} the rendered width
 */
export const getRenderedWidth = (...args) => {
  const size = getRenderedSize(...args);

  return size.width;
};

export default getRenderedSize;
