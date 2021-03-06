import React from 'react';
import { PageHeader } from 'antd';
import { withTranslation } from 'react-i18next';

import NewButton from '@/components/Buttons/new.button';
import SaveButton from '@/components/Buttons/save.button';
import CloseButton from '@/components/Buttons/close.button';
import DeleteButton from '@/components/Buttons/delete.button';

import styles from '@/components/Main/PageHeader/pageHeader.module.less';

class MainPageHeader extends React.Component {
  render() {

    /**
     * @type {{
     *  buttons:{newBtn, saveBtn, closeBtn, deleteBtn}
     * }}
     */
    const {
      component,
      ability,
      formRef,
      buttons,
      model,
      metadata,
      touched,
      ghost = false
    } = this.props;

    /**
     * @constant
     * @return {JSX.Element}
     */
    const newButton = () => {
      const disabled = ability.cannot('create', component);
      return buttons?.newBtn ? (
        <NewButton key={'new'}
                   disabled={disabled}
                   onClick={buttons?.newBtn.onClick}
                   loading={buttons?.newBtn.loading} />
      ) : null;
    };

    /**
     * @constant
     * @return {JSX.Element}
     */
    const saveButton = () => {
      let disabled = ability.cannot('update', component);
      disabled = disabled ? disabled : !touched;

      return buttons?.saveBtn ? (
        <SaveButton key={'save'}
                    isEdit={model?.isEdit}
                    disabled={disabled}
                    formRef={formRef}
                    loading={buttons?.saveBtn.loading} />
      ) : null;
    };

    /**
     * @constant
     * @return {JSX.Element}
     */
    const closeButton = () => {
      return buttons?.closeBtn ? (
        <CloseButton key={'close'}
                     disabled={false}
                     onClick={buttons?.closeBtn.onClick}
                     loading={buttons?.closeBtn.loading} />
      ) : null;
    };

    /**
     * @constant
     * @return {JSX.Element}
     */
    const deleteButton = () => {
      const disabled = ability.cannot('delete', component);
      return buttons?.deleteBtn ? (
        <DeleteButton key={'delete'}
                      disabled={disabled}
                      onClick={buttons?.deleteBtn.onClick}
                      loading={buttons?.deleteBtn.loading} />
      ) : null;
    };

    let _buttons = (formRef ? model?.isEdit ? [
      closeButton(),
      deleteButton(),
      saveButton()
    ] : [
      closeButton(),
      saveButton()
    ] : [
      newButton()
    ]).filter(button => button);

    buttons?.extra && _buttons.push(buttons.extra);

    if (!_buttons?.length) {
      _buttons = null;
    }

    return (
      <PageHeader ghost={ghost}
                  subTitle={metadata?.title}
                  className={styles.siteActions}
                  extra={_buttons} />
    );
  }
}

export default withTranslation()(MainPageHeader);
