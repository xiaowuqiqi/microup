// import MasterDomItem from './MasterDomItem'
import DefaultOption from './DefaultOption'
import PackageInfo from './PackageInfo'
import ProjectConfig from './ProjectConfig'
import mkdirp from "mkdirp";
import warning from '../utils/warning';

export let context = null
export default class Store {
  // master
  // options
  // projectConfig
  // packageInfo
  // tmpDirPath
  // mode
  // isDev
  _defaultData = null

  constructor(params, mode, idDev) {
    const defaultOption = new DefaultOption({...params, mode}, idDev)
    const packageInfo = new PackageInfo({}, defaultOption.get().packagePath)
    const projectConfig = new ProjectConfig(defaultOption.get().config)
    this._defaultData = {
      option: defaultOption.get(), projectConfig: projectConfig.get(), packageInfo: packageInfo.get(),
    }
  }

  initContext() {
    if (context) {
      warning(false, '`context` had been initialized');
      return;
    }
    mkdirp.sync(this._defaultData.option.tmpDirPath); // 创建tmp
    context = this._defaultData // 合并数据到当前模块的exports上，其他模块引入时都可以获取 context 数值
    // 初始化 projectConfig.routes
    // ProjectConfig.handleCollectRoute(context);
  }
}
