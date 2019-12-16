import React from 'react';

import { message } from 'antd';

export const flashSuccess = (msg) => {
  message.success(msg);
};

export const flashError = (msg) => {
  message.error(msg);
};

export const flashWarning = (msg) => {
  message.warning(msg);
};

export const flashInfo = (msg) => {
  message.info(msg);
};
