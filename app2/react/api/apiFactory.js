import JSONBig from 'json-bigint';
import { message } from 'choerodon-ui/pro';
import { axios } from '@microup/apps-master';

const JSONBigString = JSONBig({ storeAsString: true });

export function transformJSONBig(data) {
  try {
    return JSONBigString.parse(data);
  } catch (error) {
    try {
      return JSON.parse(data);
    } catch (e) {
      return data;
    }
  }
}

function handleFailedError(res) {
  if (res?.failed) {
    message.error(res?.message);
    return res;
  }
  return res;
}

// function transformResponseDataPage(data: any) {
//   if (data && has(data, 'content') && has(data, 'totalElements')) {
//     Object.assign(data, {
//       total: data.totalElements,
//       pageSize: data.size,
//       pageNum: data.number + 1,
//       hasNextPage: data.totalElements > 0 && data.totalElements / data.size > data.number + 1,
//       isFirstPage: data.number === 0,
//     });
//   }
//   return data;
// }

class ApiFactory {
  /**
   * 默认前缀
   */
  get prefix() {
    return `intelligent/v1/${this.getTenantId()}`;
  }

  defaultGet() {
    return '';
  }

  AppState

  constructor(AppState) {
    this.AppState = AppState;
  }

  getUserInfo() {
    return this.AppState?.getUserInfo;
  }

  getTenantId() {
    return this.AppState?.currentMenuType?.tenantId || this.AppState?.menuType?.tenantId;
  }

  getOrganizationId() {
    return this.AppState?.menuType?.organizationId || this.AppState?.currentMenuType?.organizationId;
  }

  getUseId() {
    return this.AppState?.userInfo?.id;
  }

  getLanguage() {
    return this.AppState?.currentLanguage?.language;
  }

  getNickName() {
    return this.getUserInfo()?.person?.realName || this.getUserInfo()?.realName;
  }

  getRealName = this.getNickName;

  getImageUrl() {
    return this.getUserInfo()?.person?.imageUrl || this.getUserInfo()?.imageUrl;
  }

  getPersonId() {
    return this.getUserInfo()?.personId || this.getUserInfo()?.person?.id;
  }

  isSite() {
    return this.AppState?.currentMenuType?.type === 'site';
  }

  async request(AxiosConfig) {
    AxiosConfig = { ...AxiosConfig };
    const paramAssign = (a, b) => {
      if (a || b) {
        return { ...a || {}, ...b || {} };
      }
      return undefined;
    };
    AxiosConfig.params = paramAssign(this._params, AxiosConfig.params);
    AxiosConfig.data = paramAssign(this._data, AxiosConfig.data);

    if (this._messageErrorFlag) {
      return axios(AxiosConfig).then(res => handleFailedError(res));
    } else {
      return axios(AxiosConfig);
    }
  }

  /**
   * 目的：达到api.project(2).getList()中getList获取的projectId为2，而不是当前projectId
   * @param Property 要覆盖的key
   * @param value 要覆盖的值
   */
  overwrite(Property, value) {
    // 以当前this为模板，创建一个新对象
    const temp = Object.create(this);
    // 不直接temp[Property] = value;的原因是，如果这个属性只有getter，会报错
    Object.defineProperty(temp, Property, {
      get() {
        return value;
      },
    });
    // 返回新对象
    return temp;
  }

  // overwriteObject(Property, value) {
  //   // 以当前this为模板，创建一个新对象
  //   const temp = Object.create(this);
  //   // 不直接temp[Property] = value;的原因是，如果这个属性只有getter，会报错
  //   temp[Property] = value;
  //   return temp;
  // }
  // 拦截报错，并提示出来
  messageError() {
    return this.overwrite('_messageErrorFlag', true);
  }

  params(params) {
    if (params) {
      return this.overwrite('_params', params || null);
    }
    return this;
  }

  data(data) {
    if (data) {
      return this.overwrite('_data', data || null);
    }
    return this;
  }

  setTenantId(tenantId) {
    if (tenantId) {
      return this.overwrite('tenantId', tenantId);
    }
    return this;
  }

  setOrganizationId(organizationId) {
    if (organizationId) {
      return this.overwrite('organizationId', organizationId);
    }
    return this;
  }
}

export default ApiFactory;
