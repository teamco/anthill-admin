import React from 'react';
import { Col, Divider, Row, Tag } from 'antd';
import {
  CalendarTwoTone,
  ControlTwoTone,
  EyeOutlined,
  MailTwoTone
} from '@ant-design/icons';
import { tsToLocaleDateTime } from '@/utils/timestamp';
import { isAdmin, isModerator } from '@/services/user.service';

import styles from '@/pages/users/users.module.less';

/**
 * @export
 * @param t
 * @return {*}
 */
export const profileMetadata = (t) => ({
  pagination: false,
  expandable: {
    expandedRowRender(record) {
      const { profile, timestamp, roles, trackable } = record?.metadata;
      const { created_at, updated_at } = timestamp;
      const {
        sign_in_count,
        current_sign_in_at,
        last_sign_in_at,
        current_sign_in_ip,
        last_sign_in_ip
      } = trackable;
      return (
        <div className={styles.profileExpand}>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <div>
                <MailTwoTone />
                <strong>{t('auth:email')}</strong>
              </div>
              <div>{profile?.email || t('error:na')}</div>
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
          <Divider orientation={'left'} plain>{t('users:monitoring')}</Divider>
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
                <CalendarTwoTone />
                <strong>{t('form:signInCount')}</strong>
              </div>
              <div>{sign_in_count}</div>
            </Col>
          </Row>
          <Row gutter={[16, 16]} style={{ marginTop: 10 }}>
            <Col span={8}>
              <div>
                <EyeOutlined />
                <strong>{t('form:currentSignInIP')}</strong>
              </div>
              <div>{current_sign_in_ip}</div>
            </Col>
            <Col span={8}>
              <div>
                <EyeOutlined />
                <strong>{t('form:lastSignInIP')}</strong>
              </div>
              <div>{last_sign_in_ip}</div>
            </Col>
            <Col span={8} />
          </Row>
          <Divider orientation={'left'} plain>{t('users:roles')}</Divider>
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
});
