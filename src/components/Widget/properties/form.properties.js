import React, {useEffect, useState} from 'react';
import {connect} from 'dva';
import {withTranslation} from 'react-i18next';
import {Form, Modal} from 'antd';
import {
  AuditOutlined,
  ExclamationCircleOutlined,
  InteractionOutlined,
  ProfileOutlined
} from '@ant-design/icons';

import styles from '@/components/Widget/widget.module.less';
import FormComponents from '@/components/Form';

import {mainProperties} from '@/components/Widget/properties/main.properties';
import {interactionProperties} from '@/components/Widget/properties/interaction.properties';
import {fillFormEffect} from '@/utils/state';

const {GenericTabs, GenericPanel} = FormComponents;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
const FormProperties = props => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  const {
    t,
    contentModel,
    onPropertiesModalVisibility,
    onTransferFormRef,
    onFieldsChange,
    onFinish,
    onResetWidget,
    onWidgetStick,
    onWidgetUnstick
  } = props;

  const {
    targetModel,
    updateForm,
    modalWidth,
    widgetProps = {},
    contentProperties,
    propertiesModalVisible
  } = contentModel;

  useEffect(() => {
    if (propertiesModalVisible) {
      onTransferFormRef(form);
      fillFormEffect(contentModel, form);
      setSaving(false);
    }
  }, [contentModel]);

  const tabs = [
    (
        <span>
          <AuditOutlined/>
          {t('instance:widget')}
        </span>
    ), (
        <span>
          <InteractionOutlined/>
          {t('instance:behavior')}
        </span>
    ), (
        <span>
          <ProfileOutlined/>
          {widgetProps.name}
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
             icon={<ExclamationCircleOutlined/>}
             visible={propertiesModalVisible}
             className={styles.modalProperties}
             width={modalWidth}
             forceRender={true}
             destroyOnClose={true}
             centered={true}
             onOk={handleOk}
             okButtonProps={{disabled: !updateForm || saving}}
             onCancel={() => {
               onResetWidget(targetModel);
               onPropertiesModalVisibility(false);
             }}>
        <Form layout={'vertical'}
              form={form}
              onFieldsChange={onFieldsChange}
              onFinish={onFinish}>
          <GenericTabs tabs={tabs}
                       defaultActiveKey={'0'}>
            <div style={{marginTop: 10}}>
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
            <div>
              {contentProperties}
            </div>
          </GenericTabs>
        </Form>
      </Modal>
  );
};

export default connect(({
      contentModel,
      loading
    }) => {
      return {
        contentModel,
        loading
      };
    },
    dispatch => ({
      dispatch,
      // onFieldsChange(changedFields, allFields) {
      //   dispatch({
      //     type: 'contentModel/updateFields',
      //     payload: {
      //       changedFields,
      //       allFields,
      //       model: 'contentModel'
      //     }
      //   });
      // },
      onTransferFormRef(form) {
        dispatch({
          type: 'contentModel/transferFormRef',
          payload: {form}
        });
      },
      onWidgetUnstick(unstick) {
        dispatch({
          type: 'contentModel/widgetUnstick',
          payload: {unstick}
        });
      },
      onWidgetStick(stickTo) {
        dispatch({
          type: 'contentModel/widgetStick',
          payload: {stickTo}
        });
      },
      onResetWidget(model) {
        dispatch({
          type: 'contentModel/revertFormValues',
          payload: {model}
        });
      },
      onFinish() {
      },
      onPropertiesModalVisibility(visible, widgetProps) {
        dispatch({
          type: 'contentModel/propertiesModalVisibility',
          payload: {
            visible,
            widgetProps
          }
        });
      }
    })
)(withTranslation()(FormProperties));
