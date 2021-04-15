import { echo } from 'coa-echo'
import { CoaEnv } from 'coa-env'
import { _ } from 'coa-helper'
import * as fg from 'fast-glob'
import auth from './bin/auth'
import docs from './bin/docs'
import route from './bin/route'
import { ServeCycle } from './libs/ServeCycle'
import html from './libs/swagger-html'
import { Action, Apps } from './typings'

// 添加action文件
const doEachActions = (base: string, sep: string) => {

  const getValidPath = (path: string) => {
    if (sep !== '.') path = path.replace(/\./g, sep)
    if (path.startsWith(sep)) path = path.substr(1)
    return base + path
  }

  // const mods = Object.keys(env.mods).join('|')
  // const files = fg.sync(mods ? `apps-(${mods}|-)/**/action*.js` : 'apps*/**/action*.js', { cwd: process.env.NODE_PATH })

  const cwd = process.env.NODE_PATH?.split(':')[0]
  const files = fg.sync('apps*/**/action*.js', { cwd })

  _.forEach(files, filename => {

    const file = require(filename).default as Action

    const fileInfo = filename.match(/apps-?(.*?)\/(.*?)\/.*/) || []

    const group1 = _.startCase(fileInfo[1]) || 'Main'
    const group2 = _.startCase(fileInfo[2]) || 'Main'

    // 遍历当前action下所有的路由
    _.forEach(file, (v, path) => {

      // 处理path
      path = getValidPath(path)

      const options = v.options || {}
      const handle = v.default
      const method = _.toLower(options.method || '')

      // 如果控制器和名称不存，则直接返回
      if (!options.name || !handle) return

      // 将当前控制器加入到分组
      options.group = group2

      // 兼容旧版本
      options.legacy && route.append(getValidPath(options.legacy), method, handle)
      // 兼容跳转
      options.redirect && route.router.redirect(getValidPath(options.redirect), path)

      route.append(path, method, handle)
      docs.append(path, method, options, group1)

    })
  })
}

// 添加action文件
const doDocAction = (base: string, sep: string, apps: Apps, cycle: ServeCycle, env: CoaEnv) => {

  // 遍历apps分组
  docs.tags(apps)

  const groups = _.keys(docs.infos)
  const doc_url = base + (env.isOnline ? 'sdoc' : 'doc')

  // 版本信息
  route.router.get(base + 'version', ctx => {
    ctx.body = env.version
  })
  // 时钟调用
  route.router.get(base + 'timer', ctx => {
    cycle.onTimer().then().catch(e => echo.error(e.toString()))
    ctx.body = 'OK'
  })
  // 文档UI
  route.router.get(doc_url, (ctx: any) => {
    // 判断链接地址
    if (ctx.path === doc_url)
      return ctx.redirect(doc_url + '/')
    // 线上环境判断是否有权限
    if (env.isOnline) {
      const authed = auth.checkPass(ctx, 'aex', 'yangtao')
      if (!authed) return
    }
    const origin = ctx.realOrigin
    const urls = groups.map(k => ({ url: `${origin}${doc_url}${sep}${k}.json`, name: _.upperFirst(k) }))
    ctx.body = html(base, sep, urls)
  })
  // 文档内容
  route.router.get(doc_url + sep + ':group.json', (ctx: any) => {
    const group = ctx.params.group || 'main'
    docs.infos[group].servers[0].url = ctx.realOrigin
    ctx.body = docs.infos[group]
  })
}

export default function (base: string, sep: string, apps: Apps, cycle: ServeCycle, env: CoaEnv) {

  base = `/${base}/`.replace(/\/\/+/g, '/').replace(/\/$/, '')
  if (!base.endsWith(sep)) base = base + sep

  // 处理doc的额外路由
  doDocAction(base, sep, apps, cycle, env)

  // 处理每个action路由
  doEachActions(base, sep)

  return route.router.routes()
}
