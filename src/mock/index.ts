import Mock from 'mockjs';
import { isSSR } from '@/utils/is';

import './user';
import './message-box';

if (process.env.REACT_APP_MOCK === 'true') {
  Mock.setup({
    timeout: '500-1500',
  });
} else {
  console.log('Mock is disabled');
}
