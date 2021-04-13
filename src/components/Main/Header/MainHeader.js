import React from 'react';
import {Layout} from 'antd';

const {Header} = Layout;

export default class MainHeader extends React.Component {
  render() {
    return (
        <Header className="site-layout-background"
                style={{
                  padding: 0,
                  position: 'relative'
                }}/>
    );
  }
}