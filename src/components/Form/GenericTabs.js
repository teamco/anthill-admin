import React, {Component} from 'react';
import {Tabs} from 'antd';
import './form.less';

const {TabPane} = Tabs;

class GenericTabs extends Component {
  render() {
    const {
      children,
      tabs,
      defaultActiveKey
    } = this.props;

    const _children = Array.isArray(children) ?
        [...children] : [children];

    return (
        <Tabs defaultActiveKey={defaultActiveKey}>
          {_children.map((child, idx) => (
              <TabPane tab={tabs[idx]}
                       key={idx}>
                {child}
              </TabPane>
          ))}
        </Tabs>
    );
  }
}

export default GenericTabs;