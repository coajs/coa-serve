import { env } from 'coa-env'
import * as Koa from 'koa'
import action from './action'
import helper from './bin/helper'
import context from './context'
import { ServeLife } from './libs/ServeLife'
import response from './response'
import { Apps } from './typings'

type ServeOptions = { apps: Apps, context: any, base?: string, sep?: string }

export default async (options: ServeOptions, life: ServeLife) => {

  helper.showBootInfo()

  const option = Object.assign({ base: 'cgi', sep: '.' }, options)

  await life.onCreated()

  // 初始化路由
  const actions = action(option.base, option.sep, option.apps, life)

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
    await life.onStarted()
    env.set({ started: true })
  })

};
