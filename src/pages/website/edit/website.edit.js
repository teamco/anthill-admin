import React, { useEffect } from 'react';
import { connect } from 'dva';
import { history } from 'umi';
import { withTranslation } from 'react-i18next';
import { Form } from 'antd';

import { fillFormEffect } from '@/utils/object';
import FormComponents from '@/components/Form';
import Main from '@/components/Main';
import { buttonsMetadata } from '@/utils/buttons';

const { GenericPanel, EditableTags } = FormComponents;
const { GeneralPanel } = Main;

/**
 * @constant
 * @export
 * @param props
 * @return {JSX.Element}
 */
const websiteEdit = (props) => {
  const formRef = React.createRef();

  const {
    t,
    onStoreForm,
    onSave,
    onBeforeUpload,
    onFileRemove,
    onFieldsChange,
    onUpdateTags,
    websiteModel,
  } = props;

  useEffect(() => {
    buttonsMetadata({
      model: 'websiteModel',
      props,
    });

    onStoreForm(formRef);

    fillFormEffect(websiteModel, formRef.current);
  }, [websiteModel]);

  const {
    isEdit,
    fileList,
    previewUrl,
    entityForm,
    tags,
    timestamp = {},
  } = websiteModel;

  /**
   * @constant
   * @param formValues
   */
  const onFinish = (formValues) => {
    onSave(formValues);
  };

  return (
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
      <GenericPanel
        header={t('panel:properties')}
        name={'properties'}
        defaultActiveKey={['properties']}
      >
        <div>
          <EditableTags
            label={t('form:tags')}
            name={'tags'}
            onChange={onUpdateTags}
            tags={tags}
          />
        </div>
      </GenericPanel>
    </Form>
  );
};

export default connect(
  ({ websiteModel, loading }) => {
    return {
      websiteModel,
      loading,
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
          model: 'websiteModel',
        },
      });
    },
    onStoreForm(form) {
      dispatch({
        type: 'appModel/storeForm',
        payload: {
          form: { ...form },
          model: 'websiteModel',
        },
      });
    },
    onBeforeUpload(payload) {
      dispatch({
        type: 'websiteModel/handleAddFile',
        payload,
      });
    },
    onFileRemove(payload) {
      dispatch({
        type: 'websiteModel/handleRemoveFile',
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
        type: 'websiteModel/prepareToSave',
        payload,
      });
    },
    onDelete() {
      dispatch({ type: 'websiteModel/handleDelete' });
    },
    onClose() {
      history.push(`/pages/websites`);
    },
    onUpdateTags(tags) {
      dispatch({
        type: 'websiteModel/updateTags',
        payload: { tags },
      });
    },
  }),
)(withTranslation()(websiteEdit));
