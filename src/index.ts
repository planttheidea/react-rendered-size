/* globals document */

// types
import { ReactElement } from 'react';

// constants
import { DEFAULT_CONTAINER_ELEMENT } from './constants';

// element
import {
  getMainContainer,
  getNewContainer,
  getRenderedElement,
  isHtmlElement,
} from './element';

// types
import { ContainerOptions, Size } from './types';

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
export async function getRenderedSize(
  element: ReactElement<any>,
  containerWidth?: number | string,
  containerOptions: ContainerOptions = {},
): Promise<Size> {
  const { container, type = DEFAULT_CONTAINER_ELEMENT } = containerOptions;

  let { doc } = containerOptions;

  if (!doc) {
    if (typeof document === 'undefined') {
      // this may be happening in an SSR mount, so return default values
      // instead of throwing error
      return {
        height: 0,
        width: 0,
      };
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
    containerWidth !== undefined
      ? containerWidth
      : doc.documentElement.clientWidth,
  );

  mainContainer.appendChild(renderContainer);

  const size = { height: 0, width: 0 };

  try {
    const renderedElement = await getRenderedElement(renderContainer, element);

    if (isHtmlElement(renderedElement)) {
      size.height = renderedElement.offsetHeight;
      size.width = renderedElement.offsetWidth;
    }

    mainContainer.removeChild(renderContainer);
  } catch (error) {
    if (typeof console !== 'undefined') {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  } finally {
    // eslint-disable-next-line no-unsafe-finally
    return size;
  }
}

export const createGetRenderedValue = (value: keyof Size) =>
  async function getRenderedValue(
    element: ReactElement<any>,
    containerWidth?: number | string,
    containerOptions: ContainerOptions = {},
  ): Promise<number> {
    const size = await getRenderedSize(
      element,
      containerWidth,
      containerOptions,
    );

    return size[value];
  };

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
