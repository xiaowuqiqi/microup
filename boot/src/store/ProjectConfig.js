import fs from 'fs';
import path from "path";
import webpack from "webpack";
import Item from "./Item";
import getWebpackCommonConfig from "../bin/common/config/getWebpackCommonConfig";
const {EProjectConfig} = require("../default.config")

export default class ProjectConfig extends Item {

  constructor(configFileName) {
    ///////////// 根据名字获取文件内容
    let customizedConfig = {}
    if (configFileName) {
      const configFilePath = path.resolve(configFileName);
      customizedConfig = fs.existsSync(configFilePath) ? require(configFilePath) : {};
    }
    //////////// theme
    const theme = {
      ...(EProjectConfig.theme || {}),
      ...(customizedConfig.theme || {})
    }
    //////////// 构建，赋值 _data
    super({
      ...EProjectConfig,
      ...customizedConfig,
      theme
    });
  }

  /////////////////
  static getRoute(context) {
    const {projectConfig: {routes}} = context;
    const originRouteKey = Object.keys(routes)[0]
    // 例如 {intelligent:'./react/index.js'}
    return {[originRouteKey]: path.resolve(routes[originRouteKey])}
  }

  static getRouteKey(context) {
    const {projectConfig: {routes}} = context;
    if (!Object.keys(routes).length) return null
    return Object.keys(routes)[0]
  }

  static getRouteVal(context) {
    const {projectConfig: {routes}} = context;
    if (!Object.keys(routes).length) return null
    const originRouteKey = Object.keys(routes)[0]
    return path.resolve(routes[originRouteKey])
  }

  static getRoutes(context) {
    const {projectConfig: {routes}} = context;
    if (!Object.keys(routes).length) return {}
    return Object.keys(routes).reduce((obj, key) => {
      // 例如 {intelligent:'./react/index.js'}
      return Object.assign(obj, {[key]: path.resolve(routes[key])})
    }, routes || {});
  }

  // 获取webpack配置
  static generateWebpackConfig(context) {
    const {projectConfig} = context;
    const webpackConfig = getWebpackCommonConfig();

    return projectConfig.webpackConfig(webpackConfig, webpack);
  }
}


