/* globals HTMLElement,HTMLDocument */

// external dependencies
import * as ReactDOM from 'react-dom';

// constants
import { ReactElement } from 'react';
import { RENDER_CONTAINER_ID } from './constants';

/**
 * @function getMainContainer
 *
 * @description
 * get the main container that future containers will be rendered into
 *
 * @param doc document to render into
 * @returns the main container that all future containers will render into
 */
export function getMainContainer(doc: HTMLDocument) {
  const container = doc.createElement('div');

  container.id = RENDER_CONTAINER_ID;

  container.style.left = '-9999px';
  container.style.position = 'absolute';
  container.style.top = '-9999px';
  container.style.visibility = 'hidden';

  return container;
}

/**
 * @function getNewContainer
 *
 * @description
 * get a new container that has the necessary styles for rendering
 *
 * @param doc document to create element with
 * @param type the type of element to use for the container
 * @param passedContainer the passed container to used, instead of creating one
 * @param width the width to assign to the container
 * @returns the new container element
 */
export function getNewContainer(
  doc: HTMLDocument,
  type: string,
  passedContainer: Element,
  width: number | string,
): Element {
  if (passedContainer) {
    return passedContainer;
  }

  const container = doc.createElement(type);

  container.style.width = typeof width === 'number' ? `${width}px` : width;

  return container;
}

/**
 * @function isElement
 *
 * @description
 * is the object passed an element
 *
 * @param object the object to test
 * @returns is the object an element
 */
export const isHtmlElement = (object: any): object is HTMLElement =>
  object instanceof HTMLElement || object instanceof HTMLDocument;

/**
 * @function getRenderedElement
 *
 * @description
 * get the element rendered into the container
 *
 * @param container the container to render into
 * @param element the element to render into the container
 * @returns the ReactElement rendered as a DOM element
 */
export async function getRenderedElement(
  container: Element,
  element: ReactElement<any>,
): Promise<Element | Text> {
  await new Promise((resolve) => {
    ReactDOM.render(element, container, resolve);
  });

  return isHtmlElement(container.firstChild)
    ? ReactDOM.findDOMNode(container.firstChild)
    : null;
}
