import React from 'react';
import { Link } from 'umi';

import FormComponents from '@/components/Form';
import {localeDateTimeString} from '@/utils/state';

const { GenericPanel } = FormComponents;

export default class MainInfo extends React.Component {

  render() {
    const {
      t,
      isEdit = false,
      info: {
        createdBy = {},
        createdAt,
        updatedAt
      }
    } = this.props;

    return isEdit && (
      <GenericPanel header={t('form:entityInfo', { entity: t('panel:details') })}
                    name={'entityInfo'}>
        <div>
          <div label={t('form:createdBy')}>
            <Link to={`/accounts/${createdBy.key}`}>{createdBy.displayName}</Link>
          </div>
        </div>
        <div>
          <div label={t('form:createdAt')}>{localeDateTimeString(createdAt)}</div>
          <div label={t('form:updatedAt')}>{localeDateTimeString(updatedAt)}</div>
        </div>
      </GenericPanel>
    );
  }
}
