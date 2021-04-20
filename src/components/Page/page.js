import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Form, Layout, Spin } from 'antd';
import classnames from 'classnames';
import { withTranslation } from 'react-i18next';
import { Prompt } from 'umi';

import Page403 from '@/pages/403';
import { Can } from '@/utils/auth/can';

import styles from '@/components/Page/page.module.less';
import Main from '@/components/Main';

const { Content } = Layout;

function Page({
  t,
  loading,
  touched,
  spinEffects = [],
  children,
  className,
  component,
  authModel,
  pageModel,
  buttons,
  model,
  formRef,
  metadata,
  pageHeader
}) {

  const { ability, currentUser } = authModel;

  useEffect(() => {
  }, []);

  const spinning = Object.keys(loading.effects).filter(
    (effect) => spinEffects.indexOf(effect) > -1 && loading.effects[effect]
  );

  const headerProps = {
    model,
    buttons,
    formRef,
    ability,
    component,
    metadata
  };

  return ability ? (
    <Layout className={classnames(styles.layout)}>
      <Layout className={'site-layout'}>
        <Content className={classnames(styles.page, className)}>
          <div style={{ height: '100%' }}>
            <Spin spinning={spinning.length > 0}>
              <Can I={'read'} a={component} ability={ability}>
                {touched && (<Prompt message={t('msg:unsaved')} />)}
                {pageHeader && (<Main.PageHeader {...headerProps} />)}
                {children}
              </Can>
              <Page403 component={component}
                       ability={ability} />
            </Spin>
          </div>
        </Content>
      </Layout>
    </Layout>
  ) : (
    <Layout className={classnames(styles.layout)}>
      <Layout className={'site-layout'}>
        <Content className={classnames(styles.page, className)}>
          <div className={styles.loading}>
            <Spin spinning={true} />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default connect(
  ({ pageModel, authModel, loading }) => {
    return {
      pageModel,
      authModel,
      loading
    };
  },
  (dispatch) => ({
    dispatch
  })
)(withTranslation()(Page));
