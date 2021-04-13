import { createLogger } from 'redux-logger';
import { message } from 'antd';

export const dva = {
  config: {
    onAction: createLogger(),
    onError(e) {
      message.error(e.message, 3).then(() => {});
    },
  },
};
