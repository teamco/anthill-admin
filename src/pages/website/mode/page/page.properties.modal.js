import React, {useEffect, useState} from 'react';
import {connect} from 'dva';
import {withTranslation} from 'react-i18next';
import {Form, Input, InputNumber, Modal, Select} from 'antd';
import {AuditOutlined, ExclamationCircleOutlined, LayoutOutlined} from '@ant-design/icons';
import {merge} from 'lodash';

import {fillFormEffect} from '@/utils/state';
import FormComponents from '@/components/Form';
import Main from '@/components/Main';

const {GenericTabs, EditableTags, GenericPanel} = FormComponents;
const {GeneralPanel} = Main;
const {Option} = Select;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
const PagePropertiesModal = props => {

  const {
    t,
    page,
    pageModel,
    showPageModal,
    onFieldsChange,
    onUpdateTags,
    onUpdateColumnCellWidth,
    onUpdatePageHeight,
    onUpdatePageWidthCellWidth,
    onCancel,
    onResetPage,
    onOk
  } = props;

  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (showPageModal) {
      form.resetFields();
      fillFormEffect(pageModel, form);
    }

    setSaving(false);
  }, [showPageModal]);

  const {
    entityForm,
    timestamp,
    modalWidth
  } = pageModel;

  const tags = page ? pageModel.tags : [];

  const title = page ?
      t('model:edit', {instance: t('instance:page')}) :
      t('model:create', {instance: t('instance:page')});

  const okText = page ? t('actions:update') : t('actions:save');

  const tabs = [
    (
        <span>
          <AuditOutlined/>
          {t('instance:page')}
        </span>
    )
  ];

  let initialValues = {};

  if (page) {
    tabs.push((
        <span>
          <LayoutOutlined/>
          {t('instance:layout')}
        </span>
    ));

    initialValues = merge({}, initialValues, {});
  }

  const alignmentData = [
    {
      key: 'left',
      value: t('layout:alignmentLeft')
    },
    {
      key: 'center',
      value: t('layout:alignmentCenter')
    },
    {
      key: 'right',
      value: t('layout:alignmentRight')
    }
  ];

  const layoutModes = page ? page.layout.config.modes : {};
  const organize = page ? page.layout.config.organize : {};

  return (
      <Modal visible={showPageModal}
             icon={<ExclamationCircleOutlined/>}
             title={title}
             width={modalWidth}
             forceRender={true}
             destroyOnClose={true}
             centered={true}
             okButtonProps={{disabled: saving}}
             cancelText={t('actions:cancel')}
             onCancel={() => {
               onCancel('showPageModal');
               onResetPage(page);
             }}
             okText={okText}
             onOk={() => {
               setSaving(true);
               form.validateFields().then(values => {
                 form.resetFields();
                 onOk(values, page);
               }).catch(e => {
                 setSaving(false);
               });
             }}>
        <Form form={form}
              fields={entityForm}
              initialValues={initialValues}
              onFieldsChange={onFieldsChange}
              layout={'vertical'}>
          <GenericTabs tabs={tabs}
                       defaultActiveKey={'0'}>
            <div style={{marginTop: 10}}>
              <GeneralPanel isEdit={!!page}
                            form={form}
                            header={t('panel:general')}
                            timestamp={timestamp}/>
              <GenericPanel header={t('panel:properties')}
                            name={'properties'}>
                <div>
                  <EditableTags label={t('form:tags')}
                                onChange={onUpdateTags}
                                name={'tags'}
                                tags={tags}/>
                </div>
              </GenericPanel>
            </div>
            {page && (
                <div style={{marginTop: 10}}>
                  <GenericPanel header={t('panel:configuration')}
                                defaultActiveKey={['configuration']}
                                name={'configuration'}>
                    <div>
                      <Input label={t('layout:pageWidth')}
                             onChange={onUpdatePageWidthCellWidth}
                             name={'pageWidth'}/>
                      <Input label={t('layout:pageHeight')}
                             onChange={onUpdatePageHeight}
                             style={{textTransform: 'capitalize'}}
                             name={'pageHeight'}/>
                    </div>
                    <div>
                      <InputNumber label={t('layout:columns')}
                                   style={{width: '100%'}}
                                   min={20}
                                   max={400}
                                   onChange={onUpdateColumnCellWidth}
                                   name={'gridColumns'}/>
                      <Input label={t('layout:cellWidth')}
                             disabled={true}
                             name={'cellWidth'}/>
                    </div>
                    <div>
                      <Select label={t('layout:pageAlignment')}
                              name={'pageAlignment'}>
                        {alignmentData.map(alignment => (
                            <Option key={alignment.key}
                                    value={alignment.key}>
                              {alignment.value}
                            </Option>
                        ))}
                      </Select>
                      <Select label={t('layout:mode')}
                              name={'layoutMode'}>
                        {Object.keys(layoutModes).map((mode, idx) => (
                            <Option key={idx} value={mode}>
                              {layoutModes[mode].name}
                            </Option>
                        ))}
                      </Select>
                    </div>
                    <div>
                      <Select label={t('layout:organizeBy')}
                              name={'layoutOrganize'}>
                        {organize.organizeBy.map((organize, idx) => (
                            <Option key={idx} value={organize.key}>
                              {organize.name}
                            </Option>
                        ))}
                      </Select>
                      <Select label={t('layout:emptySpacesBy')}
                              name={'layoutEmptySpaces'}>
                        {organize.emptySpacesBy.map((emptySpace, idx) => (
                            <Option key={idx} value={emptySpace.key}>
                              {emptySpace.name}
                            </Option>
                        ))}
                      </Select>
                    </div>
                  </GenericPanel>
                </div>
            )}
          </GenericTabs>
        </Form>
      </Modal>
  );
};

export default connect(({
      pageModel,
      loading
    }) => {
      return {
        pageModel,
        loading
      };
    },
    dispatch => ({
      dispatch,
      onFieldsChange(changedFields, allFields) {
        dispatch({
          type: 'pageModel/updateFields',
          payload: {
            changedFields,
            allFields,
            model: 'pageModel'
          }
        });
      },
      onUpdateTags(tags) {
        dispatch({
          type: 'pageModel/updateTags',
          payload: {tags}
        });
      },
      onResetPage(page) {
        dispatch({
          type: 'workspaceModel/resetPage',
          page
        });
      },
      onUpdateColumnCellWidth(columns) {
        dispatch({
          type: 'pageModel/updateColumnCellWidth',
          payload: {columns}
        });
      },
      onUpdatePageWidthCellWidth(e) {
        dispatch({
          type: 'pageModel/updatePageWidthCellWidth',
          payload: {width: e.target.value}
        });
      },
      onUpdatePageHeight(e) {
        dispatch({
          type: 'pageModel/updatePageHeight',
          payload: {height: e.target.value}
        });
      }
    })
)(withTranslation()(PagePropertiesModal));
