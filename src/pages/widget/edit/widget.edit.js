import React, { useEffect } from 'react';
import { connect } from 'dva';
import { history } from 'umi';
import { withTranslation } from 'react-i18next';
import { Form, InputNumber, Select } from 'antd';

import Main from '@/components/Main';
import FormComponents, { unitFormatter, unitParser } from '@/components/Form';
import Widget from '@/components/Widget';
import FormProperties from '@/components/Widget/properties/form.properties';

import { fillFormEffect, fromForm } from '@/utils/object';
import { buttonsMetadata } from '@/utils/buttons';

import styles from '@/pages/widget/widget.module.less';

const { Option } = Select;
const { GenericPanel, EditableTags } = FormComponents;
const { GeneralPanel } = Main;

const DEFAULT_DIMENSIONS = 300;

/**
 * @constant
 * @export
 * @param props
 * @return {JSX.Element}
 */
const widgetEdit = (props) => {
  const formRef = React.createRef();

  const {
    t,
    onStoreForm,
    onSave,
    onBeforeUpload,
    onFileRemove,
    onFieldsChange,
    onUpdateTags,
    widgetModel,
  } = props;

  useEffect(() => {
    buttonsMetadata({
      model: 'widgetModel',
      props,
    });

    onStoreForm(formRef);

    fillFormEffect(widgetModel, formRef.current);
  }, [widgetModel]);

  const {
    isEdit,
    fileList,
    previewUrl,
    entityForm,
    tags,
    timestamp = {},
  } = widgetModel;

  /**
   * @constant
   * @param formValues
   */
  const onFinish = (formValues) => {
    onSave(formValues);
  };

  const handleChangeClone = (value) => {};

  const { width, height, name, description } = fromForm(entityForm);

  const widgetProps = {
    name,
    description,
    offset: {
      x: 0,
      y: 0,
    },
    dimensions: {
      width,
      height,
    },
  };

  return (
    <div>
      <Form
        layout={'vertical'}
        ref={formRef}
        fields={entityForm}
        onFieldsChange={onFieldsChange}
        onFinish={onFinish}
      >
        <GeneralPanel
          isEdit={isEdit}
          form={formRef}
          header={t('panel:general')}
          timestamp={timestamp}
          upload={{
            fileList,
            previewUrl,
            onFileRemove,
            onBeforeUpload,
          }}
        />
        <GenericPanel header={t('panel:properties')} name={'properties'}>
          <div>
            <InputNumber
              label={t('dimensions:defaultWidth')}
              min={1}
              formatter={(value) =>
                unitFormatter(value, 'px', DEFAULT_DIMENSIONS)
              }
              parser={(value) => unitParser(value)}
              name={'width'}
            />
            <InputNumber
              label={t('dimensions:defaultHeight')}
              min={1}
              formatter={(value) =>
                unitFormatter(value, 'px', DEFAULT_DIMENSIONS)
              }
              parser={(value) => unitParser(value)}
              name={'height'}
            />
          </div>
          <div>
            <EditableTags
              label={t('form:tags')}
              onChange={onUpdateTags}
              name={'tags'}
              tags={tags}
            />
          </div>
        </GenericPanel>
        {isEdit ? (
          <GenericPanel
            header={t('panel:preview')}
            name={'preview'}
            className={styles.widgetPreview}
          >
            <div>
              <Widget
                label={name}
                updateForm={false}
                widgetProps={widgetProps}
              />
            </div>
          </GenericPanel>
        ) : (
          <GenericPanel header={t('panel:clone')} name={'clone'}>
            <div>
              <Select
                label={t('form:cloneFrom', { instance: '$t(instance:widget)' })}
                name={'clone'}
                onChange={handleChangeClone}
              >
                {widgetModel.widgets.map((widget, idx) => (
                  <Option key={idx} value={widget.key}>
                    {widget.name}
                  </Option>
                ))}
              </Select>
              <div>widget</div>
            </div>
          </GenericPanel>
        )}
      </Form>
      {isEdit && <FormProperties />}
    </div>
  );
};

export default connect(
  ({ widgetModel, loading }) => {
    return {
      widgetModel,
      loading,
    };
  },
  (dispatch) => ({
    dispatch,
    onFieldsChange(changedFields, allFields) {
      dispatch({
        type: 'widgetModel/updateFields',
        payload: {
          changedFields,
          allFields,
          model: 'widgetModel',
        },
      });
    },
    onStoreForm(form) {
      dispatch({
        type: 'appModel/storeForm',
        payload: {
          form: { ...form },
          model: 'widgetModel',
        },
      });
    },
    onBeforeUpload(payload) {
      dispatch({
        type: 'widgetModel/handleAddFile',
        payload,
      });
    },
    onFileRemove(payload) {
      dispatch({
        type: 'widgetModel/handleRemoveFile',
        payload,
      });
    },
    onButtonsMetadata(payload) {
      dispatch({
        type: 'appModel/activeButtons',
        payload,
      });
    },
    onSave(payload) {
      dispatch({
        type: 'widgetModel/prepareToSave',
        payload,
      });
    },
    onDelete() {
      dispatch({ type: 'widgetModel/handleDelete' });
    },
    onClose() {
      dispatch(history.push(`/pages/widgets`));
    },
    onUpdateTags(tags) {
      dispatch({
        type: 'widgetModel/updateTags',
        payload: { tags },
      });
    },
  }),
)(withTranslation()(widgetEdit));
