import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { useParams, history } from 'umi';
import { withTranslation } from 'react-i18next';
import { Form, PageHeader, Menu, Button, Dropdown } from 'antd';

import Page from '@/components/Page';
import { fromForm } from '@/utils/object';
import FormComponents from '@/components/Form';
import Main from '@/components/Main';

import styles from '@/pages/users/[user]/websites/website.module.less';

import {
  DeleteOutlined,
  DownOutlined,
  PauseCircleOutlined,
  SettingOutlined,
  GlobalOutlined
} from '@ant-design/icons';

const { GenericPanel, EditableTags } = FormComponents;
const { GeneralPanel, Info } = Main;

/**
 * @constant
 * @export
 * @param props
 * @return {JSX.Element}
 */
const websiteEdit = (props) => {
  const [formRef] = Form.useForm();

  const {
    t,
    onEditWebsite,
    onDeleteWebsite,
    onHoldWebsite,
    onSave,
    onClose,
    onBeforeUpload,
    onFileRemove,
    onFieldsChange,
    onUpdateTags,
    websiteModel,
    authModel,
    loading
  } = props;

  /**
   * @type {{user, website}}
   */
  const { user, website } = useParams();

  const component = 'website';

  const [disabled, setDisabled] = useState(true);

  const { ability, currentUser } = authModel;

  useEffect(() => {
    if (ability) {
      setDisabled(ability.cannot('update', component));
    }
  }, [ability]);

  useEffect(() => {
    onEditWebsite(user, website);
  }, []);

  const {
    isEdit,
    fileList,
    previewUrl,
    entityForm,
    tags,
    touched
  } = websiteModel;

  const {
    createdBy,
    updatedBy,
    createdAt,
    updatedAt
  } = fromForm(entityForm, 'metadata') || {};

  /**
   * @constant
   * @param formValues
   */
  const onFinish = (formValues) => {
    onSave(formValues);
  };

  const detailProps = {
    t,
    isEdit,
    info: {
      createdBy,
      updatedBy,
      createdAt,
      updatedAt
    }
  };

  const menu = (
    <Menu>
      <Menu.Item key={'hold'}
                 disabled={!isEdit}
                 icon={<PauseCircleOutlined />}
                 onClick={() => onHoldWebsite(website)}>
        {t('actions:hold')}
      </Menu.Item>
      <Menu.Item key={'delete'}
                 danger
                 disabled={!isEdit}
                 icon={<DeleteOutlined />}
                 onClick={() => onDeleteWebsite(website)}>
        {t('actions:delete')}
      </Menu.Item>
    </Menu>
  );

  const pageProps = {
    ability,
    touched,
    pageHeader: true,
    className: styles.website,
    component,
    formRef,
    metadata: {
      title: (
        <>
          <GlobalOutlined style={{ marginRight: 10 }} />
          {isEdit ?
            t('actions:edit', { type: t('instance:website') }) :
            t('actions:addNew', { type: t('instance:website') })
          }
        </>
      )
    },
    model: { isEdit },
    buttons: {
      closeBtn: {
        onClick: () => onClose(user),
        loading: loading.effects['websiteModel/save']
      },
      saveBtn: {
        loading: loading.effects['websiteModel/save']
      },
      extra: (
        <Dropdown overlay={menu}
                  disabled={!isEdit || disabled}
                  overlayClassName={styles.customActionMenu}
                  key={'custom'}>
          <Button size={'small'}
                  icon={<SettingOutlined />}
                  className={styles.customAction}>
            {t('actions:manage', { type: t('instance:website') })} <DownOutlined />
          </Button>
        </Dropdown>
      )
    },
    spinEffects: [
      'authModel/defineAbilities',
      'websiteModel/prepareToEdit',
      'websiteModel/save'
    ]
  };

  return (
    <Page {...pageProps}>
      <div className={styles.websiteFormWrapper}>
        <Form layout={'vertical'}
              form={formRef}
              fields={entityForm}
              onFieldsChange={onFieldsChange}
              onFinish={onFinish}>
          <GeneralPanel isEdit={isEdit}
                        form={formRef}
                        disabled={disabled}
                        header={t('panel:general')}
                        upload={{
                          fileList,
                          previewUrl,
                          onFileRemove,
                          onBeforeUpload
                        }} />
          <GenericPanel header={t('panel:properties')}
                        name={'properties'}
                        defaultActiveKey={['properties']}>
            <div>
              <EditableTags label={t('form:tags')}
                            name={'tags'}
                            onChange={onUpdateTags}
                            tags={tags} />
            </div>
          </GenericPanel>
          <Info {...detailProps} />
        </Form>
      </div>
    </Page>
  );
};

export default connect(
  ({ authModel, websiteModel, loading }) => {
    return {
      authModel,
      websiteModel,
      loading
    };
  },
  (dispatch) => ({
    dispatch,
    onFieldsChange(changedFields, allFields) {
      dispatch({
        type: 'websiteModel/updateFields',
        payload: {
          changedFields,
          allFields,
          model: 'websiteModel'
        }
      });
    },
    onEditWebsite(userKey, websiteKey) {
      dispatch({
        type: 'websiteModel/websitesHandleEdit',
        payload: { userKey, websiteKey }
      });
    },
    onBeforeUpload(file) {
      dispatch({
        type: 'websiteModel/handleAddFile',
        payload: { file, model: 'websiteModel' }
      });
    },
    onFileRemove(file) {
      dispatch({
        type: 'websiteModel/handleRemoveFile',
        payload: { file, model: 'websiteModel' }
      });
    },
    onSave(payload) {
      dispatch({ type: 'websiteModel/prepareToSave', payload });
    },
    onDelete() {
      dispatch({ type: 'websiteModel/handleDelete' });
    },
    onClose(userKey) {
      history.push(`/accounts/${userKey}/websites`);
    },
    onUpdateTags(tags) {
      dispatch({
        type: 'websiteModel/updateTags',
        payload: { tags }
      });
    }
  })
)(withTranslation()(websiteEdit));
