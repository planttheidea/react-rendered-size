// test
import test from 'ava';
import sinon from 'sinon';
import ReactDOM from 'react-dom';

// src
import * as element from 'src/element';
import * as constants from 'src/constants';

test('if getMainContainer will create the main container with the default styles', (t) => {
  const DOC_WIDTH = 1000;
  const mainContainer = {
    style: {}
  };
  const doc = {
    createElement: sinon.stub().returns(mainContainer),
    documentElement: {
      clientWidth: DOC_WIDTH
    }
  };

  const result = element.getMainContainer(doc);

  t.is(result, mainContainer);
  t.deepEqual(result, {
    id: constants.RENDER_CONTAINER_ID,
    style: {
      left: '-10000px',
      position: 'absolute',
      top: '-10000px',
      visibility: 'hidden'
    }
  });
});

test('if getNewContainer will create a new container, apply the width directly to it, and return it', (t) => {
  const type = constants.DEFAULT_CONTAINER_ELEMENT;
  const width = 'baz';
  const container = {
    style: {}
  };

  const doc = {
    createElement(string) {
      t.is(string, type);

      return container;
    }
  };

  const result = element.getNewContainer(doc, type, width);

  t.is(result, container);
  t.deepEqual(result, {
    style: {
      width
    }
  });
});

test('if getNewContainer will create a new container, apply the width with px to it, and return it', (t) => {
  const type = constants.DEFAULT_CONTAINER_ELEMENT;
  const width = 1000;
  const container = {
    style: {}
  };

  const doc = {
    createElement(string) {
      t.is(string, type);

      return container;
    }
  };

  const result = element.getNewContainer(doc, type, width);

  t.is(result, container);
  t.deepEqual(result, {
    style: {
      width: `${width}px`
    }
  });
});

test('if getRenderedElement will call render from ReactDOM with container and element', (t) => {
  const stub = sinon.stub(ReactDOM, 'render');

  const container = 'foo';
  const el = 'bar';

  element.getRenderedElement(container, el);

  t.true(stub.calledWith(el, container));

  stub.restore();
});
