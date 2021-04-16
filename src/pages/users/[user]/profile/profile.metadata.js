import React from 'react';
import { Col, Divider, Form, Row, Tag } from 'antd';
import {
  CalendarTwoTone,
  ControlTwoTone,
  EyeTwoTone,
  MailTwoTone,
  DashboardTwoTone
} from '@ant-design/icons';
import { tsToLocaleDateTime } from '@/utils/timestamp';
import { isAdmin, isModerator } from '@/services/user.service';
import Main from '@/components/Main';

import styles from '@/pages/users/users.module.less';
import SaveButton from '@/components/Buttons/save.button';

const { GeneralPanel } = Main;

/**
 * @export
 * @param t
 * @param onFieldsChange
 * @param onFinish
 * @param onFileRemove
 * @param onBeforeUpload
 * @param previewUrl
 * @param fileList
 * @param entityForm
 * @param disabled
 * @param formRef
 * @param touched
 * @return {*}
 */
export const profileMetadata = ({
  t,
  onFieldsChange,
  onUpdateProfile,
  onFileRemove,
  onBeforeUpload,
  previewUrl,
  fileList,
  entityForm,
  disabled,
  formRef,
  touched,
  loading
}) => {

  /**
   * Handle save button disable status
   * @type {boolean|RuleBuilder<AnyAbility>|boolean}
   */
  const saveDisabled = disabled ? disabled : !touched;

  return {
    pagination: false,
    expandable: {
      expandedRowRender(record) {
        const { profile, timestamp, roles, trackable } = record?.metadata;
        const { created_at, updated_at } = timestamp;
        const { gravatar_url, email } = profile;
        const {
          sign_in_count,
          current_sign_in_at,
          last_sign_in_at,
          current_sign_in_ip,
          last_sign_in_ip
        } = trackable;
        return (
          <div className={styles.profileExpand}>
            <div className={styles.profileActions}>
              <SaveButton key={'save'}
                          isEdit={true}
                          disabled={saveDisabled}
                          formRef={formRef}
                          loading={
                            loading.effects['userModel/updateProfile']
                          } />
            </div>
            <Form layout={'vertical'}
                  form={formRef}
                  fields={entityForm}
                  style={{ paddingRight: 10 }}
                  onFieldsChange={onFieldsChange}
                  onFinish={onUpdateProfile}>
              <GeneralPanel isEdit={true}
                            form={formRef}
                            disabled={disabled}
                            description={false}
                            header={t('panel:general')}
                            extraField={(
                              <div label={'Gravatar API'}
                                   className={styles.gravatar}>
                                <img src={gravatar_url}
                                     alt={'Gravatar'} />
                              </div>
                            )}
                            upload={{
                              fileList,
                              previewUrl,
                              onFileRemove,
                              onBeforeUpload
                            }} />
            </Form>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <div>
                  <MailTwoTone />
                  <strong>{t('auth:email')}</strong>
                </div>
                <div>{email || t('error:na')}</div>
              </Col>
              <Col span={8}>
                <div>
                  <CalendarTwoTone />
                  <strong>{t('form:createdAt')}</strong>
                </div>
                <div>{tsToLocaleDateTime(+new Date(created_at))}</div>
              </Col>
              <Col span={8}>
                <div>
                  <CalendarTwoTone />
                  <strong>{t('form:updatedAt')}</strong>
                </div>
                <div>{tsToLocaleDateTime(+new Date(updated_at))}</div>
              </Col>
            </Row>
            <Divider orientation={'left'}
                     plain
                     style={{paddingRight: 10}}>
              {t('users:monitoring')}
            </Divider>
            <Row gutter={[16, 16]} style={{ marginTop: 10 }}>
              <Col span={8}>
                <div>
                  <CalendarTwoTone />
                  <strong>{t('form:currentSignInAt')}</strong>
                </div>
                <div>{tsToLocaleDateTime(+new Date(current_sign_in_at))}</div>
              </Col>
              <Col span={8}>
                <div>
                  <CalendarTwoTone />
                  <strong>{t('form:lastSignInAt')}</strong>
                </div>
                <div>{tsToLocaleDateTime(+new Date(last_sign_in_at))}</div>
              </Col>
              <Col span={8}>
                <div>
                  <DashboardTwoTone />
                  <strong>{t('form:signInCount')}</strong>
                </div>
                <div>{sign_in_count}</div>
              </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginTop: 10 }}>
              <Col span={8}>
                <div>
                  <EyeTwoTone />
                  <strong>{t('form:currentSignInIP')}</strong>
                </div>
                <div>{current_sign_in_ip}</div>
              </Col>
              <Col span={8}>
                <div>
                  <EyeTwoTone />
                  <strong>{t('form:lastSignInIP')}</strong>
                </div>
                <div>{last_sign_in_ip}</div>
              </Col>
              <Col span={8} />
            </Row>
            <Divider orientation={'left'}
                     plain
                     style={{paddingRight: 10}}>
              {t('users:roles')}
            </Divider>
            <Row gutter={[16, 16]} style={{ marginTop: 10 }}>
              <Col span={8}>
                <div>
                  <ControlTwoTone />
                  <strong>{t('auth:roles')}</strong>
                </div>
                <div>
                  <Tag className={styles.rules}>
                    {isAdmin(roles) ? t('users:admin') :
                      isModerator(roles) ? t('users:moderator') :
                        t('users:consumer')}
                  </Tag>
                </div>
              </Col>
              <Col span={8} />
              <Col span={8} />
            </Row>
          </div>
        );
      },
rowExpandable: (record) => true
}
};
};
