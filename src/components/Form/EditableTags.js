import React from 'react';
import {Input, Tag, Tooltip} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {withTranslation} from 'react-i18next';

import './form.less';

class EditableTags extends React.Component {
  state = {
    inputVisible: false,
    inputValue: '',
    editInputIndex: -1,
    editInputValue: ''
  };

  handleClose = removedTag => {
    let {onChange, tags} = this.props;
    onChange(tags.filter(tag => tag !== removedTag));
  };

  showInput = () => {
    this.setState({inputVisible: true}, () => this.input.focus());
  };

  handleInputChange = e => {
    this.setState({inputValue: e.target.value});
  };

  handleInputConfirm = () => {
    let {onChange, tags} = this.props;
    const {inputValue} = this.state;

    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }

    onChange(tags);

    this.setState({
      inputVisible: false,
      inputValue: ''
    });
  };

  handleEditInputChange = e => {
    this.setState({editInputValue: e.target.value});
  };

  handleEditInputConfirm = () => {
    const {tags, onChange} = this.props;

    this.setState(({editInputIndex, editInputValue}) => {
      const newTags = [...tags];
      newTags[editInputIndex] = editInputValue;

      onChange(newTags);

      return {
        editInputIndex: -1,
        editInputValue: ''
      };
    });
  };

  saveInputRef = input => {
    this.input = input;
  };

  saveEditInputRef = input => {
    this.editInput = input;
  };

  render() {
    const {inputVisible, inputValue, editInputIndex, editInputValue} = this.state;
    const {t, tags} = this.props;

    return (
        <div>
          {(tags || []).map((tag, index) => {
            if (editInputIndex === index) {
              return (
                  <Input ref={this.saveEditInputRef}
                         key={tag}
                         size="small"
                         className="tag-input"
                         value={editInputValue}
                         onChange={this.handleEditInputChange}
                         onBlur={this.handleEditInputConfirm}
                         onPressEnter={this.handleEditInputConfirm}/>
              );
            }

            const isLongTag = tag.length > 20;

            const tagElem = (
                <Tag className="edit-tag"
                     key={tag}
                     closable={true}
                     onClose={() => this.handleClose(tag)}>
                  <span onDoubleClick={e => {
                    this.setState({
                      editInputIndex: index,
                      editInputValue: tag
                    }, () => {
                      this.editInput.focus();
                    });
                    e.preventDefault();
                  }}>
                    {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                  </span>
                </Tag>
            );
            return isLongTag ? (
                <Tooltip title={tag} key={tag}>
                  {tagElem}
                </Tooltip>
            ) : (
                tagElem
            );
          })}
          {inputVisible && (
              <Input ref={this.saveInputRef}
                     type="text"
                     size="small"
                     className="tag-input"
                     value={inputValue}
                     onChange={this.handleInputChange}
                     onBlur={this.handleInputConfirm}
                     onPressEnter={this.handleInputConfirm}/>
          )}
          {!inputVisible && (
              <Tag className="site-tag-plus" onClick={this.showInput}>
                <PlusOutlined/> {t('actions:newTag')}
              </Tag>
          )}
        </div>
    );
  }
}

export default withTranslation()(EditableTags);