// test
import test from 'ava';
import sinon from 'sinon';

// src
import * as index from 'src/index';
import * as constants from 'src/constants';
import * as element from 'src/element';

const DOCUMENT_WIDTH = 1000;

const setupIndexTest = (widthToUse, docToUse) => {
  const reactElement = {};
  const mainContainer = {
    appendChild: sinon.spy(),
    clientWidth: DOCUMENT_WIDTH,
    removeChild: sinon.spy()
  };
  const container = {};
  const width = widthToUse;
  const doc = docToUse || ({
    body: {
      appendChild: sinon.spy(),
      removeChild: sinon.spy()
    },
    createElement(type) {
      return {
        appendChild: sinon.spy(),
        nodeName: type.toUpperCase(),
        removeChild: sinon.spy(),
        style: {}
      };
    },
    documentElement: {
      clientWidth: DOCUMENT_WIDTH
    }
  });
  const offsetWidth = width || doc.documentElement.clientWidth;

  const renderedElement = {
    offsetHeight: 100,
    offsetWidth
  };

  const mainContainerStub = sinon.stub(element, 'getMainContainer').callsFake(() => {
    return mainContainer;
  });
  const containerStub = sinon.stub(element, 'getNewContainer').callsFake(() => {
    return container;
  });

  const renderedStub = sinon.stub(element, 'getRenderedElement').callsFake(() => {
    return renderedElement;
  });

  return {
    container,
    doc,
    mainContainerStub,
    reactElement,
    renderedElement,
    stubs: [
      containerStub,
      renderedStub
    ],
    width
  };
};

const teardownIndexTest = (stubs) => {
  stubs.forEach((stub) => {
    stub.restore();
  });
};

test.serial('if getRenderedSize will return the rendered size of the react element passed based on the explicit width passed', (t) => {
  const {
    container,
    doc,
    mainContainerStub,
    reactElement,
    renderedElement,
    stubs,
    width
  } = setupIndexTest(500);

  const stubsCalledWith = [
    [doc, constants.DEFAULT_CONTAINER_ELEMENT, undefined, width],
    [container, reactElement]
  ];

  const result = index.default(reactElement, width, {
    doc
  });

  t.deepEqual(result, {
    height: renderedElement.offsetHeight,
    width: renderedElement.offsetWidth
  });

  t.true(mainContainerStub.calledOnce);
  t.true(mainContainerStub.calledWith(doc));

  stubs.forEach((stub, index) => {
    t.true(stub.calledOnce);
    t.true(stub.calledWith(...stubsCalledWith[index]), `${index}`);
  });

  teardownIndexTest([
    ...stubs,
    mainContainerStub
  ]);
});

test.serial('if getRenderedSize will return the rendered size of the react element passed based on the documentElement width when no explicit width is passed', (t) => {
  const {
    container,
    doc,
    mainContainerStub,
    reactElement,
    renderedElement,
    stubs
  } = setupIndexTest();

  const stubsCalledWith = [
    [doc, constants.DEFAULT_CONTAINER_ELEMENT, undefined, doc.documentElement.clientWidth],
    [container, reactElement]
  ];

  const result = index.default(reactElement, undefined, {
    doc
  });

  t.deepEqual(result, {
    height: renderedElement.offsetHeight,
    width: renderedElement.offsetWidth
  });

  t.true(mainContainerStub.notCalled);

  stubs.forEach((stub, index) => {
    t.true(stub.calledOnce);
    t.true(stub.calledWith(...stubsCalledWith[index]));
  });

  teardownIndexTest([
    ...stubs,
    mainContainerStub
  ]);
});

test.serial('if getRenderedSize will call getNewContainer with the right type when it is passed in options', (t) => {
  const {
    container,
    doc,
    mainContainerStub,
    reactElement,
    renderedElement,
    stubs,
    width
  } = setupIndexTest(500);

  const type = 'foo';

  const stubsCalledWith = [
    [doc, type, undefined, width],
    [container, reactElement]
  ];

  const result = index.default(reactElement, width, {
    doc,
    type
  });

  t.deepEqual(result, {
    height: renderedElement.offsetHeight,
    width: renderedElement.offsetWidth
  });

  t.true(mainContainerStub.notCalled);

  stubs.forEach((stub, index) => {
    t.true(stub.calledOnce);
    t.true(stub.calledWith(...stubsCalledWith[index]));
  });

  teardownIndexTest([
    ...stubs,
    mainContainerStub
  ]);
});

test.serial('if getRenderedSize will use the right defaults when no options are passed', (t) => {
  global.document = {};

  const {
    container,
    mainContainerStub,
    reactElement,
    renderedElement,
    stubs,
    width
  } = setupIndexTest(500);

  const stubsCalledWith = [
    [global.document, constants.DEFAULT_CONTAINER_ELEMENT, undefined, width],
    [container, reactElement]
  ];

  const result = index.default(reactElement, width);

  t.deepEqual(result, {
    height: renderedElement.offsetHeight,
    width: renderedElement.offsetWidth
  });

  t.true(mainContainerStub.notCalled);

  stubs.forEach((stub, index) => {
    t.true(stub.calledOnce);
    t.true(stub.calledWith(...stubsCalledWith[index]));
  });

  teardownIndexTest([
    ...stubs,
    mainContainerStub
  ]);

  global.document = undefined;
});

test.serial('if getRenderedHeight calls getRenderedSize and returns the height property from it', (t) => {
  const {
    container,
    doc,
    mainContainerStub,
    reactElement,
    renderedElement,
    stubs,
    width
  } = setupIndexTest(500);

  const stubsCalledWith = [
    [doc, constants.DEFAULT_CONTAINER_ELEMENT, undefined, width],
    [container, reactElement]
  ];

  const result = index.getRenderedHeight(reactElement, width, {
    doc
  });

  t.is(result, renderedElement.offsetHeight);

  stubs.forEach((stub, index) => {
    t.true(stub.calledOnce);
    t.true(stub.calledWith(...stubsCalledWith[index]));
  });

  t.true(mainContainerStub.notCalled);

  teardownIndexTest([
    ...stubs,
    mainContainerStub
  ]);
});

test.serial('if getRenderedWidth calls getRenderedSize and returns the width property from it', (t) => {
  const {
    container,
    doc,
    mainContainerStub,
    reactElement,
    renderedElement,
    stubs,
    width
  } = setupIndexTest(500);

  const stubsCalledWith = [
    [doc, constants.DEFAULT_CONTAINER_ELEMENT, undefined, width],
    [container, reactElement]
  ];

  const result = index.getRenderedWidth(reactElement, width, {
    doc
  });

  t.is(result, renderedElement.offsetWidth);

  t.true(mainContainerStub.notCalled);

  stubs.forEach((stub, index) => {
    t.true(stub.calledOnce);
    t.true(stub.calledWith(...stubsCalledWith[index]));
  });

  teardownIndexTest([
    ...stubs,
    mainContainerStub
  ]);
});
