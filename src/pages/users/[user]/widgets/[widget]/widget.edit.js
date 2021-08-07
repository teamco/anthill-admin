import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { history, useParams } from 'umi';
import { withTranslation } from 'react-i18next';
import { Button, Dropdown, Form, InputNumber, Menu, Select } from 'antd';

import Page from '@/components/Page';
import Main from '@/components/Main';
import FormComponents, { unitFormatter, unitParser } from '@/components/Form';

import WidgetContent from '@/components/WidgetContent';
import WidgetFormProperties from '@/components/WidgetContent/properties/form.properties';

import { fromForm } from '@/utils/object';

import {
  DownOutlined,
  AppstoreOutlined,
  SettingOutlined,
  DeleteOutlined
} from '@ant-design/icons';

import { showConfirm } from '@/utils/modals';

import pageStyles from '@/components/Page/page.module.less';
import styles from '@/pages/users/[user]/widgets/widgets.module.less';

const { Option } = Select;
const { GenericPanel, EditableTags } = FormComponents;
const { GeneralPanel, Info } = Main;

const DEFAULT_DIMENSIONS = 300;

/**
 * @constant
 * @export
 * @param props
 * @return {JSX.Element}
 */
const widgetEdit = (props) => {
  const [formRef] = Form.useForm();

  const {
    t,
    loading,
    onEditWidget,
    onResetState,
    onSave,
    onClose,
    onDelete,
    onBeforeUpload,
    onFileRemove,
    onFieldsChange,
    onUpdateTags,
    widgetModel,
    authModel
  } = props;

  const {
    isEdit,
    fileList,
    previewUrl,
    entityForm,
    tags,
    timestamp = {},
    touched,
    selectedWidget
  } = widgetModel;

  const [disabled, setDisabled] = useState(true);

  /**
   * @type {{user, website}}
   */
  const { user, widget } = useParams();
  const { ability } = authModel;
  const { widgets, contentKey, contentKey1 } = widgetModel;

  const component = 'widget';

  useEffect(() => {
    if (ability) {
      setDisabled(ability.cannot('update', component));
    }
  }, [ability]);

  useEffect(() => {
    onEditWidget(user, widget);
    return onResetState;
  }, []);

  /**
   * @constant
   * @param formValues
   */
  const onFinish = (formValues) => {
    onSave(formValues);
  };

  const handleChangeClone = (value) => {
  };

  const width = fromForm(entityForm, 'width');
  const height = fromForm(entityForm, 'height');
  const name = fromForm(entityForm, 'name');

  const {
    createdBy,
    updatedBy,
    createdAt,
    updatedAt
  } = fromForm(entityForm, 'metadata') || {};

  const widgetProps = {
    content: name,
    offset: {
      x: 0,
      y: 0
    },
    dimensions: {
      width,
      height
    }
  };

  const menu = (
    <Menu>
      <Menu.Item key={'delete'}
                 danger
                 disabled={!isEdit}
                 icon={<DeleteOutlined />}
                 onClick={() => {
                   showConfirm({
                     className: pageStyles.deleteConfirm,
                     onOk: () => onDelete(widget),
                     okText: t('actions:delete'),
                     okType: 'danger',
                     instance: t('instance:widget'),
                     name: selectedWidget?.name
                   });
                 }}>
        {t('actions:delete')}
      </Menu.Item>
    </Menu>
  );

  const pageProps = {
    ability,
    touched,
    pageHeader: true,
    className: styles.widget,
    component,
    formRef,
    metadata: {
      title: (
        <>
          <AppstoreOutlined style={{ marginRight: 10 }} />
          {isEdit ?
            t('actions:edit', { type: t('instance:widget') }) :
            t('actions:addNew', { type: t('instance:widget') })
          }
        </>
      )
    },
    model: { isEdit },
    buttons: {
      closeBtn: {
        onClick: () => onClose(user),
        loading: loading.effects['widgetModel/save']
      },
      saveBtn: {
        loading: loading.effects['widgetModel/save']
      },
      extra: (
        <Dropdown overlay={menu}
                  disabled={!isEdit || disabled}
                  overlayClassName={pageStyles.customActionMenu}
                  key={'custom'}>
          <Button size={'small'}
                  icon={<SettingOutlined />}
                  className={pageStyles.customAction}>
            {t('actions:manage', { type: t('instance:widget') })} <DownOutlined />
          </Button>
        </Dropdown>
      )
    },
    spinEffects: [
      'authModel/defineAbilities',
      'widgetModel/prepareToEdit',
      'widgetModel/handleDelete',
      'widgetModel/save'
    ]
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

  return (
    <Page {...pageProps}>
      <div className={styles.widgetFormWrapper}>
        <Form layout={'vertical'}
              form={formRef}
              fields={entityForm}
              onFieldsChange={onFieldsChange}
              onFinish={onFinish}>
          <GeneralPanel isEdit={isEdit}
                        form={formRef}
                        header={t('panel:general')}
                        timestamp={timestamp}
                        upload={{
                          fileList,
                          previewUrl,
                          onFileRemove,
                          onBeforeUpload
                        }} />
          <GenericPanel header={t('panel:properties')}
                        name={'properties'}>
            <div>
              <InputNumber label={t('dimensions:defaultWidth')}
                           min={1}
                           formatter={(value) =>
                             unitFormatter(value, 'px', DEFAULT_DIMENSIONS)
                           }
                           parser={(value) => unitParser(value)}
                           name={'width'} />
              <InputNumber label={t('dimensions:defaultHeight')}
                           min={1}
                           formatter={(value) =>
                             unitFormatter(value, 'px', DEFAULT_DIMENSIONS)
                           }
                           parser={(value) => unitParser(value)}
                           name={'height'} />
            </div>
            <div>
              <EditableTags label={t('form:tags')}
                            onChange={onUpdateTags}
                            name={'tags'}
                            tags={tags} />
            </div>
          </GenericPanel>
          {isEdit ? (
            <GenericPanel header={t('panel:preview')}
                          name={'preview'}
                          className={styles.widgetPreview}>
              <div>
                <WidgetContent label={name}
                               contentKey={contentKey1}
                               updateForm={false}
                               widgetProps={widgetProps} />
              </div>
            </GenericPanel>
          ) : (
            <GenericPanel header={t('panel:clone')} name={'clone'}>
              <div>
                <Select label={t('form:cloneFrom', { instance: '$t(instance:widget)' })}
                        name={'clone'}
                        onChange={handleChangeClone}>
                  {widgets.map((widget, idx) => (
                    <Option key={idx} value={widget?.key}>
                      {widget?.name}
                    </Option>
                  ))}
                </Select>
                <div>widget</div>
              </div>
            </GenericPanel>
          )}
          <Info {...detailProps} />
        </Form>
        {isEdit && <WidgetFormProperties />}
      </div>
    </Page>
  );
};

export default connect(
  ({ authModel, widgetModel, loading }) => {
    return {
      authModel,
      widgetModel,
      loading
    };
  },
  (dispatch) => ({
    dispatch,
    onResetState() {
      dispatch({ type: 'websiteModel/resetState' });
    },
    onFieldsChange(changedFields, allFields) {
      dispatch({
        type: 'widgetModel/updateFields',
        payload: {
          changedFields,
          allFields,
          model: 'widgetModel'
        }
      });
    },
    onBeforeUpload(payload) {
      dispatch({
        type: 'widgetModel/handleAddFile',
        payload
      });
    },
    onFileRemove(payload) {
      dispatch({
        type: 'widgetModel/handleRemoveFile',
        payload
      });
    },
    onEditWidget(userKey, widgetKey) {
      dispatch({
        type: 'widgetModel/widgetHandleEdit',
        payload: { userKey, widgetKey }
      });
    },
    onSave(payload) {
      dispatch({ type: 'widgetModel/prepareToSave', payload });
    },
    onDelete() {
      dispatch({ type: 'widgetModel/handleDelete' });
    },
    onClose(userKey) {
      history.push(`/accounts/${userKey}/widgets`);
    },
    onUpdateTags(tags) {
      dispatch({ type: 'widgetModel/updateTags', payload: { tags } });
    }
  })
)(withTranslation()(widgetEdit));
