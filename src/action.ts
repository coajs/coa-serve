import { echo } from 'coa-echo'
import { env } from 'coa-env'
import { _ } from 'coa-helper'
import * as fg from 'fast-glob'
import docs from './bin/docs'
import route from './bin/route'
import { ServeCycle } from './libs/ServeCycle'
import html from './libs/swagger-html'
import { Action, Apps } from './typings'

// 添加action文件
const doEachActions = (base: string, sep: string) => {

  const mods = Object.keys(env.mods).join('|')

  const files = fg.sync(mods ? `apps-(${mods})/**/action.js` : 'apps*/**/action.js', { cwd: process.env.NODE_PATH })

  _.forEach(files, filename => {

    const file = require(filename).default as Action

    const fileInfo = filename.match(/apps-?(.*?)\/(.*?)\/.*/) || []

    const group1 = _.startCase(fileInfo[1]) || 'Main'
    const group2 = _.startCase(fileInfo[2]) || 'Main'

    // 遍历当前action下所有的路由
    _.forEach(file, (v, path) => {

      // 处理path
      if (sep !== '.') path = path.replace(/\./g, sep)
      if (path.startsWith(sep)) path = path.substr(1)
      path = base + path

      const options = v.options || {}
      const handle = v.default
      const method = _.toLower(options.method || '')

      // 如果控制器和名称不存，则直接返回
      if (!options.name || !handle) return

      // 将当前控制器加入到分组
      options.group = group1 + ' ' + group2

      route.append(path, method, handle)
      docs.append(path, method, options, group1)

    })
  })
}

// 添加action文件
const doDocAction = (base: string, sep: string, apps: Apps, cycle: ServeCycle) => {

  // 遍历apps分组
  docs.tags(apps)

  const docPath = env.docs.path.replace(/\/$/, '')
  const groups = _.keys(docs.infos)

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
  route.router.get(docPath, (ctx: any) => {
    if (ctx.path === docPath) return ctx.redirect(docPath + '/')
    const origin = ctx.realOrigin
    const urls = groups.map(k => ({ url: `${origin}${docPath}/${k}.json`, name: _.upperFirst(k) }))
    ctx.body = html(base, sep, urls)
  })
  // 文档内容
  route.router.get(docPath + '/:group.json', (ctx: any) => {
    const group = ctx.params.group || 'main'
    docs.infos[group].servers[0].url = ctx.realOrigin
    ctx.body = docs.infos[group]
  })
}

export default function (base: string, sep: string, apps: Apps, cycle: ServeCycle) {

  if (!base.startsWith('/')) base = '/' + base
  if (!base.endsWith(sep)) base = base + sep

  // 处理doc的额外路由
  doDocAction(base, sep, apps, cycle)

  // 处理每个action路由
  doEachActions(base, sep)

  return route.router.routes()
}
