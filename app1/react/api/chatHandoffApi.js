import ApiFactory from './apiFactory';

class ChatHandoffApi extends ApiFactory {
  get prefix() {
    return `intelligent/v1/${this.getTenantId()}`;
  }

  constructor(AppState) {
    super(AppState);
  }

  getList2() {
    return this.request({
      method: 'GET',
      url: `${this.prefix}/agent-group-users/list2`,
    });
  }

  getSearchHistory() {
    return this.request({
      method: 'GET',
      url: `${this.prefix}/searchHistory`,
    });
  }

  // 删除历史查询记录
  deleteSearchHistory() {
    return this.request({
      method: 'DELETE',
      url: `${this.prefix}/searchHistory`,
    });
  }

  getQueryChat() {
    return this.request({
      method: 'GET',
      url: `${this.prefix}/conversion/search`,
    });
  }

  // 查询历史聊天记录分页信息
  postQueryChat() {
    return this.request({
      method: 'POST',
      // /conversion/index?pageSize=20
      url: `${this.prefix}/conversion/index`,
    });
  }

  // 查询排队数据
  getQueue() {
    return this.request({
      method: 'GET',
      // /conversion/index?pageSize=20
      url: `${this.prefix}/agent-group-users/queue`,
    });
  }

  // 强制签入排队的人
  postForceCheckIn() {
    const { handoffId } = this._params || {};
    return this.request({
      method: 'POST',
      url: `${this.prefix}/agent-group-users/${handoffId}/forceCheckIn`,
    });
  }
}

const creatChatHandoffApi = (AppState) => new ChatHandoffApi(AppState);
export { creatChatHandoffApi, ChatHandoffApi };
