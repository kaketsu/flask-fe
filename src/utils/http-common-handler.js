import axios from 'axios';

axios.interceptors.response.use((response) => {
  if (response.config.url.startsWith('/api/')) {
    if (response.status === 200 || response.status === 201) {
      let {data} = response;
      // if (data && data.code === 0) {
      if (data) {
        return Promise.resolve(data);
      } else {
        data = {msg: '接口异常，请刷新重试或联系管理员！', ...data};
        return Promise.reject(data);
      }
    } else {
      return Promise.reject(new Error(`${response.config.url}请求失败`));
    }
  } else {
    return Promise.resolve(response.data);
  }
}, () => {
//   const {response = {}} = error;
//   const unAuthorizedMsg = response.status === 401 && response.data;
//   const reject = {
//     code: response.status,
//     msg: unAuthorizedMsg || (response.data && response.data.message) || response.statusText,
//   };
//   if (response.status === 401) {
//     const currentUrl = window.location.href;
//     Message({type: 'info', message: '尝试获取SSO授权...', duration: 0});
//     window.location.href =
//     `/oauth2/login?platform=bytedance&returnUrl=${encodeURIComponent(
//         currentUrl
//     )}`;
//   }
  return Promise.reject();
});
