import React from 'react';
import {
  BugOutlined,
  GlobalOutlined,
  InfoCircleOutlined,
  ShopOutlined,
  TeamOutlined,
  OrderedListOutlined
} from '@ant-design/icons';

/**
 * @export
 * @type {{icon: JSX.Element, key: string, url: string}[]}
 */
export const menus = [
  {
    key: 'menu:users',
    url: '/accounts',
    icon: <TeamOutlined />
  },
  {
    key: 'menu:websites',
    url: '/websites',
    icon: <GlobalOutlined />
  },
  {
    key: 'menu:widgets',
    url: '/widgets',
    icon: <ShopOutlined />
  },
  {
    key: 'menu:systemLogs',
    icon: <InfoCircleOutlined />,
    items: [
      {
        key: 'menu:userLogs',
        url: '/logs',
        icon: <OrderedListOutlined />
      },
      {
        key: 'menu:errorLogs',
        url: '/errors',
        icon: <BugOutlined />
      }
    ]
  }
];
