// external dependencies
import debounce from 'lodash/debounce';
import React, { Component, ReactElement } from 'react';
import { List } from 'react-virtualized';
import { measure } from 'remeasure';

// src
import { getRenderedHeight, getRenderedSize } from '../src';

type Props = {
  width: number;
};

type State = {
  sizes: any[];
};

interface ReactVirtualizedList {
  recomputeGridSize: () => void;
}

const DEFAULT_ROW_SIZE = 38;

const isLargeIndex = (index: number) => index % 10 === 0;

const listItems: any[] = [];

let index = -1;

// eslint-disable-next-line no-plusplus
while (++index < 10000) {
  const text = !isLargeIndex(index) ? (
    `Item ${index}`
  ) : (
    <div>
      This will be
      <br />
      a very long piece of text
      <br />
      with carraige returns
      <br />
      {`for item ${index}.`}
    </div>
  );

  listItems.push(text);
}

const Bar = ({
  item,
  style,
}: {
  item: ReactElement<any> | Text;
  style: object;
}) => <div style={style}>{item}</div>;

const Foo = ({
  item,
  style,
}: {
  item: ReactElement<any> | Text;
  style: object;
}) => <Bar item={item} style={style} />;

class App extends Component<Props, State> {
  state: State = {
    sizes: [],
  };

  height: number = 500;

  list?: ReactVirtualizedList = null;

  // eslint-disable-next-line no-shadow
  getRowHeight = ({ index }: { index: number }) => {
    const { width } = this.props;

    if (!isLargeIndex(index)) {
      return 18;
    }

    const { sizes } = this.state;

    if (sizes[index]) {
      return sizes[index];
    }

    getRenderedSize(this.rowRenderer({ index }), width).then((size) => {
      // eslint-disable-next-line no-shadow
      this.setState(({ sizes }) => {
        // eslint-disable-next-line no-param-reassign
        sizes[index] = size.height;

        return {
          sizes,
        };
      }, debounce(() => this.list.recomputeGridSize()));
    });
    // getRenderedHeight(this.rowRenderer({ index }), width).then((height) => {
    //   this.setState(({ sizes }: State) => {
    //     sizes[index] = height;

    //     return {
    //       sizes,
    //     };
    //   },            debounce(() => this.list.recomputeGridSize()));
    // });

    return DEFAULT_ROW_SIZE;
  };

  rowRenderer = ({
    // eslint-disable-next-line no-shadow
    index,
    key,
    style,
  }: {
    index: number;
    key?: any;
    style?: object;
  }) => {
    const item = listItems[index];

    return (
      // eslint workaround
      <Foo item={item} key={key} style={style} />
    );
  };

  setListRef = (component: ReactVirtualizedList) => {
    this.list = component;
  };

  render() {
    const { width } = this.props;

    return (
      <main>
        <h1>App</h1>

        <List
          estimatedRowSize={DEFAULT_ROW_SIZE}
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

// @ts-ignore
export default measure.width(App);
