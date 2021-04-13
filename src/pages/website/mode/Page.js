import React from 'react';
import {connect} from 'dva';
import {withTranslation} from 'react-i18next';
import {useDrop} from 'react-dnd';
import classnames from 'classnames';

import {itemTypes} from '@/pages/website/mode/development/itemTypes';
import styles from './mode.module.less';
import {isDevelopment} from '@/services/common.service';
import {fromForm} from '@/utils/state';

/**
 * @export
 * @param props
 * @return {JSX.Element|{name: string}}
 * @constructor
 */
const Page = props => {
  const {pageModel, children, style, className, onWidgetPosition} = props;

  const [{canDrop, isOver}, drop] = useDrop({
    accept: itemTypes.WIDGET,
    drop(item, monitor) {
      onWidgetPosition(monitor.getDifferenceFromInitialOffset(), pageModel.widget);
      return {name: 'Page'};
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });

  const isActive = canDrop && isOver;
  const _formValues = fromForm(pageModel.entityForm);

  const rules = {
    position: 'relative',
    width: _formValues.pageWidth,
    height: _formValues.pageHeight
  };

  const _alignment = styles[`${_formValues.pageAlignment}Alignment`];
  const _className = isDevelopment() ?
      classnames(styles.rules, _alignment) : _alignment;

  return (
      <div style={{...style}}
           className={classnames(className, isActive ? styles.activePage : '')}>
        <div>
          <div ref={drop}
               className={classnames(_className, styles.pageContent)}
               style={{...rules}}>
            {children}
          </div>
        </div>
      </div>
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
      onWidgetPosition(offset, widget) {
        dispatch({
          type: 'pageModel/setWidgetPosition',
          payload: {
            offset,
            widget
          }
        });
      }
    })
)(withTranslation()(Page));
