import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'dva';
import { Form } from 'antd';

import {
  UserSwitchOutlined
} from '@ant-design/icons';

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
    onFieldsChange,
    onUpdateProfile,
    onFileRemove,
    onBeforeUpload
  } = props;

  const [formRef] = Form.useForm();
  const [disabled, setDisabled] = useState(true);

  let { selectedUser, previewUrl, fileList, entityForm, touched } = userModel;

  const { ability, currentUser } = authModel;
  const component = 'userProfile';

  useEffect(() => {
    onQuery(profiled);
  }, []);

  useEffect(() => {
    ability && setDisabled(ability.cannot('update', component));
  }, [ability]);

  const tableProps = selectedUser ? profileMetadata({
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
    list: !selectedUser,
    loading,
    currentUser,
    onDeleteUser,
    onSignOutUser
  };

  const pageProps = {
    ability,
    touched,
    pageHeader: true,
    className: styles.users,
    component,
    metadata: {
      title: (
        <>
          <UserSwitchOutlined style={{ marginRight: 10 }} />
          {t('actions:manage', { type: t('auth:users') })} ({userModel.users?.length || 0})
        </>
      )
    },
    spinEffects: [
      'authModel/defineAbilities',
      'userModel/query'
    ]
  };

  return (
    <Page {...pageProps}>
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
