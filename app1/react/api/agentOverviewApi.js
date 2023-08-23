import ApiFactory from './apiFactory';

class AgentOverviewApi extends ApiFactory {
  get prefix() {
    return `intelligent/v1/${this.getTenantId()}`;
  }

  constructor(AppState) {
    super(AppState);
  }

  pustOffLine({ userId }) {
    // Put: /v1/{tenantId}/agent-group-users/{user_id}/forceOffline  强制下线接口
    return this.request({
      method: 'PUT',
      url: `${this.prefix}/agent-group-users/${userId}/forceOffline`,
    });
  }
}

const createAgentOverviewApi = (AppState) => new AgentOverviewApi(AppState);
export { createAgentOverviewApi, AgentOverviewApi };
