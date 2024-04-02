const crypto = require('crypto');

const appKey = 'a_7618daf8574d40e5';

// const json_data = {
//   timestamp: new Date().getTime(),
//   noce_str: crypto.randomBytes(16).toString('hex'), 
// };
const json_data = {
    "timestamp": "1711464875515",
    "noce_str": "4760fdf0f1376e7de617a901181e94bb"
  }
const data = JSON.stringify(json_data).replace(/,/g, ',').replace(/:/g, ':');
const sign = crypto.createHmac('sha256', appKey).update(data).digest('hex');

console.debug(`🚀 nodetest.js[12] - sign=${sign}`);

// console.log(crypto.randomBytes(16).toString('utf-8'))

// 输出随机字符串, 位数为 16
console.log(crypto.randomBytes(16).toString('hex'));