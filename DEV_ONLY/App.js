// external dependencies
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import ReactMount from 'react-dom';
import {List} from 'react-virtualized';
import measure from 'remeasure';

// src
import getRenderedSize from '../src';

const isLargeIndex = (index) => {
  return index % 10 === 0;
};

let listItems = [],
    index = -1;

while (++index < 10000) {
  const text = !isLargeIndex(index) ? (
    `Item ${index}`
  ) : (
    <div>
      This will be
      <br />a very long piece of text
      <br />
      with carraige returns
      <br />
      for item {index}.
    </div>
  );

  listItems.push(text);
}

const Bar = ({item, style}) => {
  return <div style={style}>{item}</div>;
};

const Foo = ({item, style}) => {
  return (<Bar
    item={item}
    style={style}
  />);
};

class App extends Component {
  static propTypes = {
    width: PropTypes.number.isRequired
  };

  height = 500;
  list = null;

  getRowHeight = ({index}) => {
    const {width} = this.props;

    if (!isLargeIndex(index)) {
      return 18;
    }

    console.time();

    const height = getRenderedSize(this.rowRenderer({index}), width).height;

    console.timeEnd();

    return height;
  };

  rowRenderer = ({index, key, style}) => {
    const item = listItems[index];

    return (<Foo
      item={item}
      key={key}
      style={style}
    />);
  };

  setListRef = (component) => {
    this.list = component;
  };

  render() {
    const {width} = this.props;

    return (
      <main>
        <h1>App</h1>

        <List
          estimatedRowSize={38}
          height={this.height}
          ref={this.setListRef}
          rowCount={listItems.length}
          rowHeight={this.getRowHeight}
          rowRenderer={this.rowRenderer}
          width={width}
        />
      </main>
    );
  }
}

export default measure.width(App);
