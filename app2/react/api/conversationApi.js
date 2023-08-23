import { message } from 'choerodon-ui/pro';
import ApiFactory from './apiFactory';

class ConversationApi extends ApiFactory {
  get prefix() {
    return `intelligent/v1/${this.getTenantId()}`;
  }

  get prefixLc() {
    return `lc/v1/${this.getTenantId()}`;
  }

  // eslint-disable-next-line no-useless-constructor
  constructor(AppState) {
    super(AppState);
  }

  getConversation() {
    return this.request({
      method: 'GET',
      // intelligent/v1/${tenantId}/conversion
      url: `${this.prefix}/conversion`,
    }).then(res => {
      try {
        return (res || []);
      } catch (e) {
        return [];
      }
    });
  }

  // 生成知识，标签查询接口
  async getKBTags() {
    // /v1/{{tenant_id}}/tag_group/code/{{code}}
    const data = await this.request({
      method: 'GET',
      // intelligent/v1/${tenantId}/conversion
      url: `${this.prefixLc}/tag_group/code/KNOWLEDGE_DEFAULT`,
    });
    if (!data?.id) return message.error('未找到标签组对应id');
    this.params({
      page: 0,
      size: 9999,
    });
    // https://api.dev.microup.com/lc/v1/240796050221273088/tag/324257237965131776?page=0&size=10
    return this.request({
      method: 'GET',
      url: `${this.prefixLc}/tag/${data.id}`,
    });
  }

  async getEngineQuery() {
    // search_common_phrases
    return this.request({
      method: 'GET',
      // https://api.sit.microup.com/intelligent/v1/207965165382135808/agentCommonPhrases?page=0&size=20
      url: `${this.prefix}/agentCommonPhrases?page=0&size=20`,
    });
  }
}

const createConversationApi = (AppState) => new ConversationApi(AppState);
export { createConversationApi, ConversationApi };
