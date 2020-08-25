import { env } from 'coa-env'
import * as Koa from 'koa'
import action from './action'
import helper from './bin/helper'
import context from './context'
import { ServeCycle } from './libs/ServeCycle'
import response from './response'
import { Apps } from './typings'

type ServeOptions = { apps: Apps, context: any, sep?: string }

export default async (options: ServeOptions, cycle: ServeCycle) => {

  helper.showBootInfo()

  const option = Object.assign({ sep: '.' }, options)

  await cycle.onCreated()

  // 初始化路由
  const actions = action(process.env.RUN_BASE || 'cgi', option.sep, option.apps, cycle)

  // 初始化koa中间件
  const koa = new Koa()
  koa.proxy = true
  koa.use(require('koa-static')('static'))
  koa.use(require('koa-morgan')(env.isProd ? 'short' : 'dev'))
  koa.use(require('koa-bodyparser')({ enableTypes: ['json', 'form', 'text'], extendTypes: { text: ['text/xml'] } }))

  koa.use(response())
  koa.use(actions)

  // 扩展context
  helper.extend(koa.context, context, options.context)

  const port = parseInt(process.env.PORT as string) || 8000
  koa.listen(port, async () => {
    helper.showBootInfo(port)
    await cycle.onStarted()
    env.set({ started: true })
  })

};
