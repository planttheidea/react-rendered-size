// types
import { ReactElement } from 'react';

// constants
import { DEFAULT_CONTAINER_ELEMENT } from './constants';

// element
import {
  getMainContainer,
  getNewContainer,
  getRenderedElement,
} from './element';

let mainContainer: HTMLDivElement;

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
export const getRenderedSize = (
  element: ReactElement<any>,
  containerWidth?: number | string,
  containerOptions: ReactRenderedSize.ContainerOptions = {},
): Promise<ReactRenderedSize.Size> => {
  const { container, type = DEFAULT_CONTAINER_ELEMENT } = containerOptions;

  let { doc } = containerOptions;

  if (!doc) {
    if (typeof document === 'undefined') {
      // this may be happening in an SSR mount, so return default values
      // instead of throwing error
      return Promise.resolve({
        height: 0,
        width: 0,
      });
    }

    doc = document;
  }

  if (!mainContainer) {
    mainContainer = getMainContainer(doc);

    doc.body.appendChild(mainContainer);
  }

  const renderContainer = getNewContainer(
    doc,
    type,
    container,
    containerWidth || doc.documentElement.clientWidth,
  );

  mainContainer.appendChild(renderContainer);

  return getRenderedElement(renderContainer, element)
    .catch((error) => {
      if (typeof console !== 'undefined') {
        // eslint-disable-next-line no-console
        console.error(error);
      }

      return {
        offsetHeight: 0,
        offsetWidth: 0,
      };
    })
    .then((renderedElement: HTMLElement | null) => {
      const size = {
        height: renderedElement ? renderedElement.offsetHeight : 0,
        width: renderedElement ? renderedElement.offsetWidth : 0,
      };

      mainContainer.removeChild(renderContainer);

      return size;
    });
};

export const createGetRenderedValue = (value: keyof ReactRenderedSize.Size) => (
  element: ReactElement<any>,
  containerWidth?: number | string,
  containerOptions: ReactRenderedSize.ContainerOptions = {},
): Promise<number> =>
  getRenderedSize(element, containerWidth, containerOptions).then(
    (size: ReactRenderedSize.Size) => size[value],
  );

/**
 * @function getRenderedHeight
 *
 * @description
 * shortcut method to get only the height property from getRenderedSize
 *
 * @returns {number} the rendered height
 */
export const getRenderedHeight = createGetRenderedValue('height');

/**
 * @function getRenderedWidth
 *
 * @description
 * shortcut method to get only the width property from getRenderedSize
 *
 * @param {...Array<*>} args the arguments to pass to getRenderedSize
 * @returns {number} the rendered width
 */
export const getRenderedWidth = createGetRenderedValue('width');
