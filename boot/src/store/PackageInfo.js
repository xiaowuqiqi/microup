import path from 'path';
import Item from "./Item";

export default class PackageInfo extends Item {
  static requirePackageInfo = (packagePath = '.') => {
    packagePath = packagePath.replace('package.json', '')
    return require(packagePath.startsWith('.') ?
      path.resolve(packagePath, 'package.json') : require.resolve(`${packagePath}/package.json`)
    );
  }

  constructor(packageInfo = {}, packagePath) {
    super({
      ...PackageInfo.requirePackageInfo(packagePath),
      ...packageInfo
    });
  }

  static compilePath(context) {
    const {packageInfo, option: {lib, src}} = context;
    return packageInfo.main.replace(new RegExp(src), lib);
  }

  // static getRouteName({routeName, name}) {
  //   return routeName || name;
  // }
  //
  // static getRouteIndex({routeIndex, main}) {
  //   return routeIndex || main;
  // }


}

