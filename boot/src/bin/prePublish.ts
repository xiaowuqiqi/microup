import fs from 'fs';
import moment from 'moment';
import Store, {context} from '@/store';


export default function prePublish(program) {
  const store = new Store(program, 'build',false)
  store.initContext()
  const {option: {packagePath}} = context;
  const pack: any = fs.readFileSync(packagePath);
  const packageJSON = JSON.parse(pack);
  // 例如：判断 >=1.17.0-release-1.17.0.0 <1.17.0-release-1.17.1 实际案例 1.0.0-release-1.0.0.20221227141813
  // packageJSON.version += `-${process.env.CI_COMMIT_REF_NAME}.${moment().format('YYYYMMDDHHmmss')}`;
  const curVersionNum = String(packageJSON.version||'').match(/([\d]+[.]){2}[\d]+/g)?.[0]
  packageJSON.version = `${curVersionNum}-${process.env.CI_COMMIT_REF_NAME||'dev'}-${curVersionNum}.${moment().format('YYYYMMDDHHmmss')}`;
  // 同步写入package.json文件
  fs.writeFileSync(packagePath, JSON.stringify(packageJSON, null, 2));
}
