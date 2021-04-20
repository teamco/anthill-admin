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
    const {
      component,
      ability,
      formRef,
      buttons,
      model,
      metadata,
      ghost = false
    } = this.props;

    /**
     * @constant
     * @return {JSX.Element}
     */
    const newButton = () => {
      const disabled = ability.cannot('create', component);
      const { onClick, loading } = buttons.newBtn;
      return (
        <NewButton key={'new'}
                   disabled={disabled}
                   onClick={onClick}
                   loading={loading} />
      );
    };

    /**
     * @constant
     * @return {JSX.Element}
     */
    const saveButton = () => {
      const disabled = ability.cannot('update', component);
      const { loading } = buttons.saveBtn;
      return (
        <SaveButton key={'save'}
                    isEdit={model?.isEdit}
                    disabled={disabled}
                    formRef={formRef}
                    loading={loading} />
      );
    };

    /**
     * @constant
     * @return {JSX.Element}
     */
    const closeButton = () => {
      const { onClick, loading } = buttons.closeBtn;
      return (
        <CloseButton key={'close'}
                     disabled={false}
                     onClick={onClick}
                     loading={loading} />
      );
    };

    /**
     * @constant
     * @return {JSX.Element}
     */
    const deleteButton = () => {
      const disabled = ability.cannot('delete', component);
      const { onClick, loading } = buttons.deleteBtn;
      return (
        <DeleteButton key={'delete'}
                      disabled={disabled}
                      onClick={onClick}
                      loading={loading} />
      );
    };

    const _buttons = formRef?.current ? model?.isEdit ? [
      closeButton(),
      deleteButton(),
      saveButton()
    ] : [
      closeButton(),
      saveButton()
    ] : [
      newButton()
    ];

    return (
      <PageHeader ghost={ghost}
                  subTitle={metadata?.title}
                  className={styles.siteActions}
                  extra={[_buttons]} />
    );
  }
}

export default withTranslation()(MainPageHeader);
