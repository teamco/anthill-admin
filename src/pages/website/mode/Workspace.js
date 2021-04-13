import React from 'react';
import {connect} from 'dva';
import {withTranslation} from 'react-i18next';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import classnames from 'classnames';

import styles from '@/pages/website/mode/mode.module.less';

import Widget from '@/components/Widget';
import Page from './Page';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
const Workspace = props => {

  const {
    pages,
    navigateTo,
    onResize,
    onResizeStop,
    workspaceModel
  } = props;

  const {mode} = workspaceModel;

  return (
      <DndProvider backend={HTML5Backend}>
        <div className={classnames(styles.pages, styles[mode])}
             style={{
               width: `${pages.length * 100}%`,
               left: navigateTo
             }}>
          {pages.map((page, idx) => (
              <Page key={idx}
                    style={{
                      left: `${idx * 100 / pages.length}%`,
                      width: `${100 / pages.length}%`
                    }}
                    className={styles.page}>
                {page.widgets.map((widget, w_idx) => (
                    <Widget key={w_idx}
                            updateForm={true}
                            onResize={onResize}
                            onResizeStop={onResizeStop}
                            widgetProps={widget}/>
                ))}
              </Page>
          ))}
        </div>
      </DndProvider>
  );
};

export default connect(({
      workspaceModel,
      loading
    }) => {
      return {
        workspaceModel,
        loading
      };
    },
    dispatch => ({
      dispatch,
      onResize(data, widget) {
        dispatch({
          type: 'pageModel/resizeTo',
          payload: {
            dimensions: data.size,
            widget
          }
        });
      },
      onResizeStop(data, widget) {
        dispatch({
          type: 'pageModel/resizeTo',
          payload: {
            dimensions: data.size,
            widget,
            store: true
          }
        });
      }
    })
)(withTranslation()(Workspace));
