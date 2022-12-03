import request from '@/utils/request'
const baseUrl = "/data/app";


// 重点人员管控信息 - 查询数据
export function keyPage(params) {
  return request({
    url: baseUrl + "/appKeyPersonnel/keyPage",
    method: "get",
    params,
  });
}

// 重点人员管控信息 - 获取密接人员
export function touch(params) {
  return request({
    url: baseUrl + "/appKeyPersonnel/touch",
    method: "get",
    params,
  });
}

// 重点人员管控信息 - 获取涉及场所
export function place(params) {
  return request({
    url: baseUrl + "/appKeyPersonnel/place",
    method: "get",
    params,
  });
}

// 重点人员管控信息 - 获取时空轨迹
export function track(params) {
  return request({
    url: baseUrl + "/appKeyPersonnel/track",
    method: "get",
    params,
  });
}

export const ReadFile = (file) => {
  return new Promise(resolve => {
    let reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = ev => {  resolve(ev.target.result); }
  })
}
