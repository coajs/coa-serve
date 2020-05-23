import { _ } from 'coa-helper'
import * as KoaRouter from 'koa-router'

const route = new KoaRouter()

export default new class {

  router = route

  append (path: string, method: string, action: (ctx: any) => Promise<any>) {

    method = _.toLower(method)

    switch (method) {
      case 'get':
        route.get(path, action)
        break
      case 'post':
        route.post(path, action)
        break
      case 'put':
        route.put(path, action)
        break
      case 'delete':
        route.delete(path, action)
        break
    }
  }
}