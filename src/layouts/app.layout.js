import React, { Component, memo, Suspense } from 'react';
import { connect } from 'dva';
import { history, withRouter, Helmet } from 'umi';
import { Form, Layout, BackTop } from 'antd';
import { withTranslation } from 'react-i18next';
import ReactInterval from 'react-interval';

import '@/utils/i18n';

import Loader from '@/components/Loader';
import Main from '@/components/Main';
import Login from '@/pages/login';

import { isAdmin } from '@/services/user.service';

import styles from '@/layouts/app.layout.less';

const { Content } = Layout;

class AppLayout extends Component {
  componentDidMount() {
    const { onActiveTab, onQuery } = this.props;
    // handleActiveTab(onActiveTab);
    onQuery();
  }

  render() {
    const {
      t,
      children,
      appModel,
      authModel,
      loading,
      onToggleMenu,
      onNotification,
      onUpdateDocumentMeta,
      onRoute
    } = this.props;

    const {
      language,
      menus,
      collapsedMenu,
      activeModel,
      layoutOpts: {
        mainMenu,
        mainHeader,
        mainFooter,
        pageBreadcrumbs
      },
      meta,
      interval: { timeout, enabled }
    } = appModel;

    const { currentUser } = authModel;

    return (
      <>
        <Helmet>
          <meta charSet={meta?.charSet} />
          <title>{`${meta?.name}${meta?.title ? ` | ${meta?.title}` : ''}`}</title>
        </Helmet>
        <ReactInterval timeout={timeout}
                       enabled={enabled}
                       callback={onNotification} />
        <Suspense fallback={
          <Loader fullScreen
                  spinning={loading.effects['appModel/appQuery']} />
        }>
          {/* Have to refresh for production environment */}
          <Layout style={{ minHeight: '100vh' }}
                  key={language ? language : 'en-US'}>
            {mainMenu && isAdmin(currentUser) && (
              <Main.Menu data={menus}
                         onRoute={onRoute}
                         model={activeModel}
                         collapsed={collapsedMenu}
                         onCollapse={onToggleMenu} />
            )}
            <Layout className={styles.siteLayout}>
              {mainHeader && currentUser && (<Main.Header />)}
              <Content>
                <Form.Provider>
                  {pageBreadcrumbs && currentUser && (
                    <Main.Breadcrumbs meta={meta}
                                      onUpdateDocumentMeta={onUpdateDocumentMeta} />
                  )}
                  <div className={styles.layoutContent}>
                    {currentUser ? children : <Login />}
                  </div>
                </Form.Provider>
              </Content>
              {mainFooter && currentUser && (
                <Main.Footer author={t('author', {
                  name: 'Team©',
                  year: 2020
                })} />
              )}
            </Layout>
          </Layout>
          <BackTop />
        </Suspense>
      </>
    );
  }
}

export default withRouter(
  connect(
    ({
        appModel,
        authModel,
        loading
      }
    ) => {
      return {
        appModel,
        authModel,
        loading
      };
    },
    (dispatch) => (
      {
        dispatch,
        onRoute(path) {
          history.push(path);
        },
        onToggleMenu(collapse) {
          dispatch({ type: `appModel/toggleMenu`, payload: { collapse } });
        },
        onActiveTab(payload) {
          dispatch({ type: 'appModel/checkActiveTab', payload });
        },
        onQuery() {
          dispatch({ type: 'appModel/appQuery' });
        },
        onUpdateDocumentMeta(meta) {
          dispatch({ type: 'appModel/updateDocumentMeta', payload: { meta } });
        },
        onNotification() {
          dispatch({ type: 'appModel/notification' });
        }
      }
    )
  )(withTranslation()(memo(AppLayout)))
);
