import React from 'react';
import {Empty, Input, Layout, Menu, Tooltip} from 'antd';
import {
  AppstoreAddOutlined,
  LayoutOutlined,
  PlusSquareTwoTone,
  SearchOutlined,
  SettingOutlined
} from '@ant-design/icons';

import request from '@/utils/request';
import styles from '@/pages/website/mode/mode.module.less';
import PagePropertiesModal from '@/pages/website/mode/page/page.properties.modal';

const {Sider} = Layout;
const {SubMenu} = Menu;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
const MenuDevelopment = props => {

  const {
    t,
    onPageSettingModal,
    onCancelModal,
    onUpdatePageSetting,
    onAddPage,
    onAddWidget,
    onNavigateToPage,
    onSearch,
    onCollapse,
    onScrollToWidget,
    workspaceModel
  } = props;

  const {
    pages,
    widgets,
    showPageModal,
    collapsedMenu,
    onSavePage,
    pageSettingOf,
    currentPage = {widgets: []},
    pagesFiltered = [],
    pageWidgetsFiltered = [],
    widgetsFiltered = []
  } = workspaceModel;

  /**
   * @constant
   * @param page
   * @param idx
   * @return {JSX.Element}
   * @private
   */
  const _page = (page, idx) => (
    <div onClick={() => onNavigateToPage(idx)}
         style={{position: 'relative'}}>
      <LayoutOutlined/>
      <Tooltip title={page.entityForm.description}
               placement={'right'}>
        {page.entityForm.name}
      </Tooltip>
      <div className={styles.setting}>
        <SettingOutlined key={'setting'}
                         onClick={e => {
                           e.preventDefault();
                           e.stopPropagation();
                           onPageSettingModal(onUpdatePageSetting, page);
                         }}/>
      </div>
    </div>
  );

  /**
   * @constant
   * @param widget
   * @return {JSX.Element}
   * @private
   */
  const _pageWidget = widget => (
    <div onClick={() => onScrollToWidget(widget)}>
      {/*<img src={widget.picture.thumb.url}*/}
      {/*     alt={widget.name}/>*/}
      <Tooltip title={widget.entityForm.widgetDescription}
               placement={'right'}>
        {widget.entityForm.widgetName}
      </Tooltip>
    </div>
  );

  /**
   * @constant
   * @param {{name, description, picture:{thumb:{url}}}} widget
   * @return {JSX.Element}
   * @private
   */
  const _widget = widget => (
    <div onClick={() => onAddWidget(widget)}>
      <img src={request.adoptUrlToServer(widget.picture.thumb.url)}
           alt={widget.name}/>
      <Tooltip title={widget.description}
               placement={'right'}>
        {widget.name}
      </Tooltip>
    </div>
  );

  /**
   * @constant
   * @param entities
   * @param type
   * @return {JSX.Element}
   * @private
   */
  const _search = (entities, type) => (
    <Menu.Item className={styles.search} disabled>
      <Input placeholder={t('website:search')}
             suffix={<SearchOutlined/>}
             allowClear
             onChange={e => onSearch(entities, e.target.value, type)}
             style={{width: 180}}/>
    </Menu.Item>
  );

  /**
   * Empty result
   * @constant
   * @return {JSX.Element}
   * @private
   */
  const _empty = () => (
    <Menu.Item className={styles.emptyDataWrapper} disabled>
      <Empty className={styles.emptyData}
             description={t('msg:noData')}
             image={Empty.PRESENTED_IMAGE_SIMPLE}/>
    </Menu.Item>
  );

  return (
    <Sider collapsible
           collapsed={collapsedMenu}
           onCollapse={onCollapse}
           theme={'light'}
           style={{overflow: 'hidden'}}>
      <Menu mode={'inline'}
            theme={'light'}
            triggerSubMenuAction={'click'}
            className={collapsedMenu ? styles.devMenuCollapsed : styles.devMenu}>
        <SubMenu key={'pages'}
                 icon={<LayoutOutlined/>}
                 title={t('menu:pages')}
                 popupClassName={styles.devSubMenuCollapsed}
                 style={{position: 'relative'}}>
          <Menu.Item key={'add-page'}
                     className={styles.addPage}
                     onClick={() => onPageSettingModal(onAddPage)}>
            <PlusSquareTwoTone/>
          </Menu.Item>
          {_search(pages, 'pages')}
          {pagesFiltered.length ?
            pagesFiltered.map((page, idx) => (
              <Menu.Item key={`page-${idx}`}>
                {_page(page, idx)}
              </Menu.Item>
            )) : _empty()}
        </SubMenu>
        {currentPage.entityForm && widgets.length && (
          <SubMenu key={'widgets'}
                   icon={<AppstoreAddOutlined/>}
                   popupClassName={styles.devSubMenuCollapsed}
                   title={t('menu:widgets')}>
            {_search(widgets, 'widgets')}
            {widgetsFiltered.length ?
              widgetsFiltered.map((widget, idx) => (
                <Menu.Item key={`widget-${idx}`}>
                  {_widget(widget)}
                </Menu.Item>
              )) : _empty()}
          </SubMenu>
        )}
        {currentPage.widgets.length && (
          <SubMenu key={'pageWidgets'}
                   icon={<AppstoreAddOutlined/>}
                   popupClassName={styles.devSubMenuCollapsed}
                   title={t('menu:pageWidgets')}>
            {_search(currentPage.widgets, 'currentPageWidgets')}
            {pageWidgetsFiltered.length ?
              pageWidgetsFiltered.map((widget, idx) => (
                <Menu.Item key={`widget-${idx}`}>
                  {_pageWidget(widget)}
                </Menu.Item>
              )) : _empty()}
          </SubMenu>
        )}
      </Menu>
      <PagePropertiesModal showPageModal={showPageModal}
                           onCancel={onCancelModal}
                           page={pageSettingOf}
                           onOk={onSavePage}/>
    </Sider>
  );
};

export default MenuDevelopment;
