import React from 'react';
import {
  BugOutlined,
  GlobalOutlined,
  InfoCircleOutlined,
  ShopOutlined,
  TeamOutlined
} from '@ant-design/icons';

/**
 * @export
 * @type {{icon: JSX.Element, key: string, url: string}[]}
 */
export const menus = [
  {
    key: 'menu:websites',
    url: '/pages/websites',
    icon: <GlobalOutlined/>
  },
  {
    key: 'menu:widgets',
    url: '/pages/widgets',
    icon: <ShopOutlined/>
  },
  {
    key: 'menu:systemLogs',
    icon: <InfoCircleOutlined/>,
    items: [
      {
        key: 'menu:userLogs',
        url: '/pages/logs',
        icon: <TeamOutlined/>
      },
      {
        key: 'menu:errorLogs',
        url: '/pages/errors',
        icon: <BugOutlined/>
      }
    ]
  }
];
