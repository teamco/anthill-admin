import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { withTranslation } from 'react-i18next';
import { Form, Modal } from 'antd';
import {
  AuditOutlined,
  ExclamationCircleOutlined,
  InteractionOutlined,
  ProfileOutlined
} from '@ant-design/icons';

import FormComponents from '@/components/Form';

import { mainProperties } from '@/components/WidgetContent/properties/main.properties';
import { interactionProperties } from '@/components/WidgetContent/properties/interaction.properties';

import styles from '@/components/WidgetContent/widgetContent.module.less';

const { GenericTabs, GenericPanel } = FormComponents;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
const WidgetFormProperties = props => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  const {
    t,
    widgetContentModel,
    onSetting,
    onTransferFormRef,
    onFieldsChange,
    onFinish,
    onResetWidget,
    onWidgetStick,
    onWidgetUnstick
  } = props;

  const {
    entityForm,
    targetModel,
    updateForm,
    modalWidth,
    activeContent,
    settingModalVisible
  } = widgetContentModel;

  const tabs = [
    (
      <span>
        <AuditOutlined />
        {t('instance:widget')}
      </span>
    ), (
      <span>
        <InteractionOutlined />
        {t('instance:behavior')}
      </span>
    ), (
      <span>
        <ProfileOutlined />
        {activeContent?.widgetName}
      </span>
    )
  ];

  const _main = mainProperties({
    onChange(type) {
    }
  });

  const _behavior = interactionProperties({
    onChange(type) {
      if (type.match(/widgetStickTo/)) {
        onWidgetUnstick(false);
        onWidgetStick(type);
      } else if (type.match(/widgetUnstick/)) {
        onWidgetUnstick(true);
      }
    }
  });

  const handleOk = () => {
    setSaving(true);
    form.validateFields().then(values => {
      form.resetFields();
      debugger
    }).catch(e => {
      setSaving(false);
    });
  };

  return (
    <Modal title={t('panel:properties')}
           icon={<ExclamationCircleOutlined />}
           visible={settingModalVisible && activeContent}
           className={styles.modalProperties}
           width={modalWidth}
           forceRender={true}
           destroyOnClose={true}
           centered={true}
           onOk={handleOk}
           okButtonProps={{ disabled: !updateForm || saving }}
           onCancel={onSetting}>
      <Form layout={'vertical'}
            form={form}
            fields={entityForm}
            onFieldsChange={onFieldsChange}
            onFinish={onFinish}>
        <GenericTabs tabs={tabs}
                     defaultActiveKey={'0'}>
          <div style={{ marginTop: 10 }}>
            <GenericPanel header={t('panel:widgetProps')}
                          name={'widgetGeneral'}
                          defaultActiveKey={['widgetGeneral']}>
              {_main.main.map((prop, idx) => (
                <div key={idx}>{prop}</div>
              ))}
            </GenericPanel>
            <GenericPanel header={t('panel:widgetPropsAdvanced')}
                          name={'widgetAdvanced'}>
              {_main.advanced.map((prop, idx) => (
                <div key={idx}>{prop}</div>
              ))}
            </GenericPanel>
          </div>
          <div>
            <GenericPanel header={t('panel:interactions')}
                          name={'widgetInteractions'}
                          defaultActiveKey={['widgetInteractions']}>
              {_behavior.interactions.map((prop, idx) => (
                <div key={idx}>{prop}</div>
              ))}
            </GenericPanel>
            <GenericPanel header={t('panel:dimensions')}
                          name={'widgetDimensions'}>
              {_behavior.dimensions.map((prop, idx) => (
                <div key={idx}>{prop}</div>
              ))}
            </GenericPanel>
          </div>
          <div className={styles.content}>
            {activeContent?.configComponent}
          </div>
        </GenericTabs>
      </Form>
    </Modal>
  );
};

export default connect(({
    widgetContentModel,
    loading
  }) => {
    return {
      widgetContentModel,
      loading
    };
  },
  dispatch => ({
    dispatch,
    onFieldsChange(changedFields, allFields) {
      dispatch({
        type: 'widgetContentModel/updateFields',
        payload: {
          changedFields,
          allFields,
          model: 'widgetContentModel'
        }
      });
    },
    onTransferFormRef(form) {
      dispatch({
        type: 'widgetContentModel/transferFormRef',
        payload: { form }
      });
    },
    onWidgetUnstick(unstick) {
      dispatch({
        type: 'widgetContentModel/widgetUnstick',
        payload: { unstick }
      });
    },
    onWidgetStick(stickTo) {
      dispatch({
        type: 'widgetContentModel/widgetStick',
        payload: { stickTo }
      });
    },
    onFinish() {
    },
    onSetting() {
      dispatch({
        type: 'widgetContentModel/handleSettingModal',
        payload: { visible: false }
      });
    }
  })
)(withTranslation()(WidgetFormProperties));
