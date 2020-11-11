import { _ } from 'coa-helper'
import swagger from '../libs/swagger'
import { Apps, Dic } from '../typings'

const docs = {
  openapi: '3.0.0',
  paths: {} as Dic<any>,
  tags: [] as any[],
  info: {} as any,
  definitions: {},
  // externalDocs: {
  //   description: '→ 点击此处，查看其他类型相关文档',
  //   url        : '/docs/#/'
  // },
  servers: [{
    description: 'Backend Interface',
    url: ''
  }],
  components: {
    securitySchemes: {
      userAccess: { type: 'apiKey', in: 'header', name: 'access' },
      managerAccess: { type: 'apiKey', in: 'header', name: 'passport' },
    }
  },
}

const infos = {} as Dic<typeof docs>

export default new class {

  infos = infos

  tags (tags: Apps) {
    _.defaultsDeep(docs, {
      filter: false,
      expansion: 'list',
      info: {
        title: '平台接口文档',
        version: '',
        description: '平台接口文档，包含用户端和管理端',
      }
    })
    _.forEach(tags, (content1, key1) => {
      key1 = key1.toLowerCase()
      // if (!env.mods[''] && !env.mods[key1]) return
      if (!infos[key1]) infos[key1] = _.cloneDeep(docs)
      _.forEach(content1, (content2, key2) => {
        infos[key1].tags.push({ name: _.startCase(key2), description: content2 })
      })
    })
  }

  append (path: string, method: string, options: any, group1: string) {
    group1 = group1.toLowerCase()
    if (!infos[group1]) infos[group1] = _.cloneDeep(docs)
    if (!infos[group1].paths[path]) infos[group1].paths[path] = {}
    infos[group1].paths[path][method] = swagger(path, method, options)
  }

}
