import {Layout, Menu} from 'antd';
import React from 'react';
import {withTranslation} from 'react-i18next';

const {Sider} = Layout;
const {SubMenu} = Menu;

class MainSiderMenu extends React.Component {
  render() {
    const {
      t,
      collapsed,
      onCollapse,
      onRoute,
      data,
      model
    } = this.props;

    return (
        <Sider collapsible
               collapsed={collapsed}
               onCollapse={onCollapse}
               style={{position: 'relative'}}>
          <div className="logo"/>
          <Menu defaultSelectedKeys={['0']}
                mode="inline">
            {data.map((menu, idx_m) => menu.url ? (
                    <Menu.Item key={idx_m}
                               icon={menu.icon}
                               onClick={() => onRoute(menu.url)}>
                      {t(menu.key)}
                    </Menu.Item>
                ) : (
                    <SubMenu key={idx_m}
                             icon={menu.icon}
                             title={t(menu.key)}>
                      {(menu.items || []).map((s_menu, idx_i) => (
                          <Menu.Item key={`${idx_m}.${idx_i}`}
                                     icon={s_menu.icon}
                                     onClick={() => onRoute(s_menu.url)}>
                            {t(s_menu.key)}
                          </Menu.Item>
                      ))}
                    </SubMenu>
                )
            )}
          </Menu>
        </Sider>
    );
  }
}

export default withTranslation()(MainSiderMenu);