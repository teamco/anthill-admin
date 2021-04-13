import React from 'react';
import {Breadcrumb} from 'antd';

export default class MainBreadcrumbs extends React.Component {
  render() {
    return (
        <Breadcrumb className={'site-breadcrumbs'}>
          <Breadcrumb.Item>User</Breadcrumb.Item>
          <Breadcrumb.Item>Bill</Breadcrumb.Item>
        </Breadcrumb>
    );
  }
}

