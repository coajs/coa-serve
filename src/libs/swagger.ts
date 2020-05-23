import { _ } from 'coa-helper'

// 参数文档：https://swagger.io/docs/specification/2-0/basic-structure/

function get_schema (data: any) {
  let schema = { type: 'object', properties: {} as any, required: [] as string[] }
  _.forEach(data, (v: any, k: string) => {
    schema.properties[k] = {
      description: v.desc || v.description,
      type: typeof v.example,
      example: v.example,
    }
    if (v.data) {
      const subSchema = get_schema(v.data)
      schema.properties[k] = _.extend(schema.properties[k], _.isArray(v.example) ? { type: 'array', items: subSchema } : subSchema)
      delete schema.properties[k].example
    }
    v.required && schema.required.push(k)
  })
  return schema
}

export default function (path: string, method: string, opt: any) {

  opt = _.defaults(opt, {
    name: '',
    desc: '',
    group: '',
    path: {},
    query: {},
    body: {},
    param: {},
    result: {},
    delete: false,
    access: true,
  })

  // 预处理
  const doc = {
    summary: opt.name,
    description: opt.desc,
    tags: [opt.group],
    parameters: [] as object[],
    requestBody: {
      content: {
        'application/json': {}
      }
    },
    responses: {
      default: {
        description: 'OK',
        content: {
          'application/json': {}
        }
      },
    },
    deprecated: opt.delete,
    security: <any[]>[]
  }

  // 处理param参数
  if (!_.isEmpty(opt.param)) {
    if (method === 'get')
      opt.query = _.extend(opt.param, opt.query)
    else
      opt.body = _.extend(opt.param, opt.body)
  }
  if (!opt.path['id'] && path.endsWith(':id')) {
    opt.path['id'] = { required: true, description: 'ID', example: '' }
  }

  // 处理path
  _.forEach(opt.path, (v: any, k: string) => {
    doc.parameters.push({
      in: 'path',
      name: v.name || k,
      required: !!v.required,
      description: v.desc || v.description || '',
      example: v.example || '',
      schema: { type: v.type || typeof v.example, }
    })
  })

  // 处理query参数
  _.forEach(opt.query, (v: any, k: string) => {
    doc.parameters.push({
      in: 'query',
      name: v.name || k,
      required: !!v.required,
      description: v.desc || v.description || '',
      example: v.example || '',
      schema: { type: v.type || typeof v.example, }
    })
  })

  // 处理body参数
  if (method !== 'get' && !_.isEmpty(opt.body)) {
    doc.requestBody.content['application/json'] = { schema: get_schema(opt.body) }
  } else {
    delete doc.requestBody
  }

  // 处理responses参数
  if (!_.isEmpty(opt.result)) {
    doc.responses.default.content['application/json'] = { schema: get_schema(opt.result) }
  }

  // 处理Access
  if (opt.access) {
    doc.security = [opt.access ? { userAccess: [], managerAccess: [] } : { [opt.access + 'Access']: [] }]
  }

  return doc
}