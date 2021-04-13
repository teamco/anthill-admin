import React, {Component} from 'react';
import {Collapse, Form, Tooltip} from 'antd';
import {WarningTwoTone} from '@ant-design/icons';
import {withTranslation} from 'react-i18next';

import './form.less';

import Grid from '../Grid';

const {AntHillRow} = Grid;
const {Panel} = Collapse;

/**
 * @constant
 * @param _child
 * @param props
 * @return {*}
 * @private
 */
const _cleanProps = (_child, props = []) => {
  const _props = {..._child.props};
  props.forEach(prop => {
    delete _props[prop];
  });
  return _props;
};

class GenericPanel extends Component {
  render() {
    const {
      t,
      children,
      defaultActiveKey,
      header,
      name,
      inRow = true,
      className = ''
    } = this.props;

    /**
     * @constant
     * @param children
     * @return {*[]}
     * @private
     */
    const _getChildren = children => {
      let _children;
      if (Array.isArray(children)) {
        _children = children.filter(child => child);
      } else {
        _children = [children];
      }

      return _children;
    };

    /**
     * @constant
     * @param prop
     * @param defaultValue
     * @private
     * @return {*|null}
     */
    const _handleProps = (prop, defaultValue) => {
      if (typeof prop === 'undefined') {
        return defaultValue;
      }

      return prop ? prop : null;
    };

    /**
     * @constant
     * @param _rowChild
     * @param idx
     * @return {unknown[]}
     * @private
     */
    const _formItem = (_rowChild, idx) => {
      return _getChildren(_rowChild.props.children || []).map((_child, _key) => {
        const {
          label,
          name,
          placeholder,
          suffix,
          disabled,
          dependencies,
          config = {}
        } = _child.props;

        let {rules = [], valuePropName} = config;

        const _isRequired = rules.find(rule => rule.required);
        if (_isRequired && !_isRequired.message) {
          _isRequired.message = t('form:required', {field: label});
        }
        const _placeholder = label ?
            _handleProps(placeholder, t('form:placeholder', {field: label})) :
            null;

        const _props = _cleanProps(_child, ['config']);
        let rest = {};
        valuePropName && (rest.valuePropName = valuePropName);

        return (
            <Form.Item label={label}
                       name={name}
                       shouldUpdate
                       dependencies={dependencies}
                       key={`${idx}-${_key}`}
                       className={'anthill-form-item'}
                       rules={rules}
                       {...rest}>
              {_isRequired ?
                  React.cloneElement(_child, {
                    placeholder: _placeholder,
                    suffix: _handleProps(suffix, (
                        <Tooltip title={t('form:required', {field: label})}>
                          <WarningTwoTone twoToneColor="#ff4d4f"/>
                        </Tooltip>
                    )),
                    ..._props
                  }) :
                  React.cloneElement(_child, {
                    placeholder: disabled ? null : _placeholder,
                    ..._props
                  })
              }
            </Form.Item>
        );
      });
    };

    return (
        <Collapse accordion
                  className={'site-panel'}
                  defaultActiveKey={defaultActiveKey}>
          <Panel header={header}
                 key={name}
                 className={className}>
            {_getChildren(children).map((_rowChild, idx) => {
              return inRow ? (
                  <AntHillRow key={idx}>
                    {_formItem(_rowChild, idx)}
                  </AntHillRow>
              ) : (
                  <div key={idx}
                       style={{
                         display: 'flex',
                         padding: '8px 0',
                         flexFlow: 'wrap'
                       }}>
                    {_formItem(_rowChild, idx)}
                  </div>
              );
            })}
          </Panel>
        </Collapse>
    );
  }
}

export default withTranslation()(GenericPanel);
