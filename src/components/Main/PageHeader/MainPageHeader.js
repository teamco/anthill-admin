import React from 'react';
import {Descriptions, PageHeader} from 'antd';
import {withTranslation} from 'react-i18next';

import {localeDateTimeString} from '@/utils/state';
import {closeBtn, deleteBtn, newBtn, saveBtn} from '@/utils/buttons';

class MainPageHeader extends React.Component {
  render() {
    const {metadata: {form = {}, buttons, model = {}}, t} = this.props;

    let _closeBtn, _deleteBtn, _saveBtn, _newBtn;

    if (buttons) {
      if ((form || {}).current) {
        _saveBtn = buttons.saveBtn && saveBtn(model.isEdit, form.current.submit, buttons.saveBtn.loading);
        _closeBtn = buttons.closeBtn && closeBtn(buttons.closeBtn.onClick, buttons.closeBtn.loading);
        if (model.isEdit) {
          _deleteBtn = buttons.deleteBtn && deleteBtn(
              buttons.deleteBtn.onClick,
              buttons.deleteBtn.loading,
              model.instance
          );
        }
      }
      _newBtn = buttons.newBtn && newBtn(buttons.newBtn.onClick, buttons.newBtn.loading);
    }

    const _buttons = form ? model.isEdit ? [
      _closeBtn,
      _deleteBtn,
      _saveBtn
    ] : [
      _closeBtn,
      _saveBtn
    ] : [
      _newBtn
    ];

    let title = model.title;

    if (typeof model.count !== 'undefined') {
      title += ` (${model.count})`;
    }

    return (
        <PageHeader ghost={false}
                    title={title}
                    className={'site-actions'}
                    extra={[_buttons]}>
          {model.isEdit && (
              <Descriptions size="small" column={2}>
                <Descriptions.Item label={t('form:createdBy')}>Lili Qu</Descriptions.Item>
                <Descriptions.Item label={t('form:updatedAt')}>
                  {localeDateTimeString(model.timestamp.updated_at)}
                </Descriptions.Item>
              </Descriptions>
          )}
        </PageHeader>
    );
  }
}

export default withTranslation()(MainPageHeader);
