import React from 'react';
import { withTranslation } from 'react-i18next';

import Form from '@/components/Form';
import { scratchProperties } from '@/vendors/widgets/Scratch/config/scratch.properties';

const { GenericPanel } = Form;

/**
 * @export
 * @default
 * @param props
 * @return {JSX.Element}
 */
const scratchConfig = props => {
  const { t } = props;

  return (
    <div>
      <GenericPanel header={t('panel:contentProperties')}
                    name={'widget-content-properties'}
                    defaultActiveKey={['widget-content-properties']}>
        {scratchProperties().map((prop, idx) => (
          <div key={idx}>{prop}</div>
        ))}
      </GenericPanel>
    </div>
  );
};

export default withTranslation()(scratchConfig);
