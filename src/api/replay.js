import axios from 'axios';

export function getReplayList() {
  return axios.get('/api/replay/list');
}

export function submitDiagnoseReport(timeDay, params) {
  return axios({
    url: `/api/replay`,
    method: 'post',
    data: {
      timeDay,
      params,
    },
  });
}

export function getUserRatak(rootName) {
  return axios.get('/api/user/ratak', {
    params: {
      resourceKey: rootName,
    },
  });
}

export function createNewReplay(params) {
  return axios({
    url: `/api/replay`,
    method: 'post',
    data: params,
  });
}

// date
export function getReplayByDate(date) {
  return axios({
    url: `/api/replay`,
    params: {
      date,
    },
    method: 'get',
  });
}

export function getReplays(params) {
  return axios({
    url: `/api/replays`,
    params: params,
    method: 'get',
  });
}

export function getReplaySectorFevers(params) {
  return axios({
    url: `/api/replay/fevers`,
    params: params,
    method: 'get',
  });
}
// // 提交板块热度
// export function createReplayFever(params) {
//   return axios({
//     url: `/api/replay/fevers`,
//     method: 'post',
//     data: params,
//   });
// }


// 创建新板块
export function createNewSector(params) {
  return axios({
    url: `/api/sector`,
    method: 'post',
    data: params,
  });
}

export function getSectorList() {
  return axios({
    url: `/api/sectors`,
    method: 'get',
  });
}

export function getSector(id) {
  return axios({
    url: `/api/sector/${id}`,
    method: 'get',
  });
}


// 创建关注股票列表

export function createNewStockRecall(params) {
  return axios({
    url: `/api/replay`,
    method: 'post',
    data: params,
  });
}


// 模型
export function createNewModel(params) {
  return axios({
    url: `/api/model`,
    method: 'post',
    data: params,
  });
}

export function getModels(params) {
  return axios({
    url: `/api/models`,
    params: params,
    method: 'get',
  });
}

export function getModel(id) {
  return axios({
    url: `/api/model/${id}`,
    method: 'get',
  });
}
