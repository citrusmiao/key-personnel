import request from '@/utils/request'
const baseUrl = "/data/app";


// 核酸检测信息查询 - 查询数据
export function pcrPage(params) {
  return request({
    url: baseUrl + "/appPcrTest/pcrPage",
    method: "get",
    params,
  });
}
// 核酸检测信息查询 - 当天未检的分页记录
export function pcrPageForSd(params) {
  return request({
    url: baseUrl + "/appPcrTest/pcrPageForSd",
    method: "get",
    params,
  });
}
// 核酸检测信息查询 - 自定义导入名单查询的分页记录
export function pcrDataForIds(params){
  return request({
    url: baseUrl + "/appPcrTest/pcrDataForIds",
    method: "get",
    params,
  });
}
// 核酸检测信息查询 - 未1天1检的分页记录
export function pcrPageForOd(params) {
  return request({
    url: baseUrl + "/appPcrTest/pcrPageForOd",
    method: "get",
    params,
  });
}
// 核酸检测信息查询 - 未3天2检的分页记录
export function pcrPageForTd(params) {
  return request({
    url: baseUrl + "/appPcrTest/pcrPageForTd",
    method: "get",
    params,
  });
}
// 核酸检测信息查询 - 未7天3检的分页记录
export function pcrPageForSvd(params) {
  return request({
    url: baseUrl + "/appPcrTest/pcrPageForSvd",
    method: "get",
    params,
  });
}
// 核酸检测信息查询 - 个人核酸检测分页记录
export function pcrPageForTest(params) {
  return request({
    url: baseUrl + "/appPcrTest/pcrPageForTest",
    method: "get",
    params,
  });
}

// 核酸检测信息查询 - 获取检测人员信息
export function userList(params) {
  return request({
    url: baseUrl + "/appPcrTest/userList",
    method: "get",
    params,
  });
}

// 核酸检测信息查询 - 统计信息
export function census(params) {
  return request({
    url: baseUrl + "/appPcrTest/census",
    method: "get",
    params,
  });
}
// 核酸检测信息查询 - 个人核酸统计信息
export function pcrCensusForTest(params) {
  return request({
    url: baseUrl + "/appPcrTest/pcrCensusForTest",
    method: "get",
    params,
  });
}
// 核酸检测信息查询 - 重点人员统计信息
export function pcrCensusForKey(params) {
  return request({
    url: baseUrl + "/appPcrTest/pcrCensusForKey",
    method: "get",
    params,
  });
}
// 核酸检测信息查询 - 区域人员统计信息
export function pcrCensusForSource(params) {
  return request({
    url: baseUrl + "/appPcrTest/pcrCensusForSource",
    method: "get",
    params,
  });
}

