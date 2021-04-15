import React, { useEffect } from 'react';
import { connect } from 'dva';
import { useParams, history } from 'umi';
import { withTranslation } from 'react-i18next';
import { Form, PageHeader, Menu, Button, Dropdown } from 'antd';

import Page from '@/components/Page';
import { fromForm } from '@/utils/object';
import FormComponents from '@/components/Form';
import Main from '@/components/Main';
import SaveButton from '@/components/Buttons/save.button';

import styles from '@/pages/websites/website.module.less';

import {
  DeleteOutlined,
  DownOutlined,
  PauseCircleOutlined,
  SettingOutlined,
  TrademarkOutlined
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
  const params = useParams();

  const { ability } = authModel;
  const component = 'website';
  const disabled = ability.cannot('update', component);

  const update = ability.can('update', component);

  useEffect(() => {
    if (update) {
      onEditWebsite(params);
    }
  }, [
    authModel.user,
    update
  ]);

  const {
    isEdit,
    fileList,
    previewUrl,
    entityForm,
    tags
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

  const subTitle = (
    <>
      <TrademarkOutlined style={{ marginRight: 10 }} />
      {isEdit ?
        t('actions:edit', { type: t('business') }) :
        t('actions:addNew', { type: t('business') })
      }
    </>
  );

  const menu = (
    <Menu>
      <Menu.Item key={'hold'}
                 loading={loading.effects['websiteModel/holdBusiness']}
                 disabled={!isEdit}
                 icon={<PauseCircleOutlined />}
                 onClick={() => onHoldWebsite(params.business)}>
        {t('actions:hold')}
      </Menu.Item>
      <Menu.Item key={'delete'}
                 danger
                 loading={loading.effects['websiteModel/prepareToSave']}
                 disabled={!isEdit}
                 icon={<DeleteOutlined />}
                 onClick={() => onDeleteWebsite(params.business)}>
        {t('actions:delete')}
      </Menu.Item>
    </Menu>
  );

  return (
    <Page className={styles.website}
          component={component}
          spinEffects={[
            'websiteModel/websitesHandleEdit',
            'websiteModel/prepareToSave'
          ]}>
      <div className={styles.websiteFormWrapper}>
        <PageHeader ghost={false}
                    subTitle={subTitle}
                    extra={[
                      <Button key={'close'}
                              size={'small'}
                              loading={loading.effects['websiteModel/prepareToSave']}
                              onClick={() => onClose(params.user)}>
                        {t('actions:close')}
                      </Button>,
                      <SaveButton key={'save'}
                                  isEdit={isEdit}
                                  disabled={disabled}
                                  formRef={formRef}
                                  loading={
                                    loading.effects['websiteModel/prepareToSave']
                                  } />,
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
                    ]} />
        <Form layout={'vertical'}
              form={formRef}
              fields={entityForm}
              onFieldsChange={onFieldsChange}
              onFinish={onFinish}>
          <GeneralPanel isEdit={isEdit}
                        form={formRef}
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
    onStoreForm(form) {
      dispatch({
        type: 'appModel/storeForm',
        payload: {
          form: { ...form },
          model: 'websiteModel'
        }
      });
    },
    onEditWebsite(params) {
      dispatch({ type: 'websiteModel/websitesHandleEdit', payload: { params } });
    },
    onBeforeUpload(payload) {
      dispatch({ type: 'websiteModel/handleAddFile', payload });
    },
    onFileRemove(payload) {
      dispatch({
        type: 'websiteModel/handleRemoveFile',
        payload
      });
    },
    onButtonsMetadata(payload) {
      dispatch({
        type: 'appModel/activeButtons',
        payload
      });
    },
    onSave(payload) {
      dispatch({
        type: 'websiteModel/prepareToSave',
        payload
      });
    },
    onDelete() {
      dispatch({ type: 'websiteModel/handleDelete' });
    },
    onClose() {
      history.push(`/websites`);
    },
    onUpdateTags(tags) {
      dispatch({
        type: 'websiteModel/updateTags',
        payload: { tags }
      });
    }
  })
)(withTranslation()(websiteEdit));
