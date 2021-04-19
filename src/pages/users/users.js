import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Form, PageHeader } from 'antd';
import {
  UserSwitchOutlined
} from '@ant-design/icons';
import { withTranslation } from 'react-i18next';

import Page from '@/components/Page';
import Main from '@/components/Main';

import { metadata } from '@/pages/users/users.metadata';
import { profileMetadata } from '@/pages/users/[user]/profile/profile.metadata';

import styles from '@/pages/users/users.module.less';

const { Table } = Main;

/**
 * @constant
 * @param props
 * @return {JSX.Element}
 */
const users = (props) => {
  const {
    t,
    authModel,
    userModel,
    loading,
    profiled = false,
    onQuery,
    onDeleteUser,
    onSignOutUser,
    onUnlockUser,
    onLockUser,
    onFieldsChange,
    onUpdateProfile,
    onFileRemove,
    onBeforeUpload
  } = props;

  const [formRef] = Form.useForm();
  const [disabled, setDisabled] = useState(true);

  let { user, previewUrl, fileList, entityForm, touched } = userModel;

  const { ability } = authModel;
  const component = 'userProfile';

  useEffect(() => {
    onQuery(profiled);
    ability && setDisabled(ability.cannot('update', component));
  }, [ability]);

  const tableProps = user ? profileMetadata({
    t,
    formRef,
    onFieldsChange,
    onUpdateProfile,
    onFileRemove,
    onBeforeUpload,
    previewUrl,
    fileList,
    entityForm,
    disabled,
    touched,
    loading,
    actionsHovered: false
  }) : { actionsHovered: false };

  const unifiedProps = {};

  const metadataProps = {
    t,
    data: userModel.users,
    list: !user,
    loading,
    currentUser: authModel.user,
    onDeleteUser,
    onSignOutUser
  };

  const subTitle = (
    <>
      <UserSwitchOutlined style={{ marginRight: 10 }} />
      {t('actions:manage', { type: t('auth:users') })}
    </>
  );

  return (
    <Page className={styles.users}
          component={component}
          spinEffects={['authModel/defineAbilities']}>
      <PageHeader ghost={false} subTitle={subTitle} />
      <div className={styles.grid}>
        <Table data={userModel.users}
               {...Object.assign(tableProps, unifiedProps)}
               {...metadata({ ...metadataProps })} />
      </div>
    </Page>
  );
};

export default connect(
  ({ authModel, userModel, loading }) => {
    return {
      authModel,
      userModel,
      loading
    };
  },
  (dispatch) => ({
    dispatch,
    onFieldsChange(changedFields, allFields) {
      dispatch({
        type: 'userModel/updateFields',
        payload: {
          changedFields,
          allFields,
          model: 'userModel'
        }
      });
    },
    onUpdateProfile(payload) {
      dispatch({ type: 'userModel/updateProfile', payload });
    },
    onFileRemove(file) {
      dispatch({
        type: 'userModel/handleRemoveFile',
        payload: { file, model: 'userModel' }
      });
    },
    onBeforeUpload(file) {
      dispatch({
        type: 'userModel/handleAddFile',
        payload: { file, model: 'userModel' }
      });
    },
    onQuery(profiled) {
      dispatch({ type: `userModel/query`, payload: { profiled } });
    },
    onDeleteUser(user) {
      dispatch({ type: `userModel/delete`, payload: { user } });
    },
    onSignOutUser(key) {
      dispatch({ type: `userModel/signOutUser`, payload: { key } });
    }
  })
)(withTranslation()(users));
