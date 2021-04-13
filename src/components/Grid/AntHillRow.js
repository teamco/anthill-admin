import React, {Component} from 'react';
import {Col, Row} from 'antd';

import {antLayout} from '@/utils/ant.layout';

export default class AntHillRow extends Component {
  render() {
    const {
      gutter = [16, 16],
      children,
      ...rest
    } = this.props;

    let items = 1;
    let _children;

    if (Array.isArray(children)) {
      items = children.length;
      _children = [...children];
    } else {
      _children = [children];
    }

    return (
        <Row gutter={gutter} {...rest}>
          {_children.filter(item => item).map((child, key) => (
              <Col span={antLayout[items]} key={key}>{child}</Col>
          ))}
        </Row>
    );
  }
}
