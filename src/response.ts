import { Context } from './typings'

const koaSend = require('koa-send')

export default () => async (ctx: Context, next: () => Promise<void>) => {
  try {
    await next()
    // 如果内容为空，且上级应用没有接管respond，只能判断respond !== false
    if (ctx.respond !== false && !ctx.response.body) {
      // 判断是否是下载文件
      const download_filename = ctx.state['aac-file-down-name']
      if (download_filename) {
        try {
          ctx.attachment(download_filename)
          await koaSend(ctx, download_filename)
        } catch (e) {
          ctx.jsonFail(e.toString())
        }
      }
      // 判断是不是路由不存在
      else if (ctx.response.status === 404)
        ctx.jsonFail('Not Found: ' + ctx.request.url, 404)
      // 其他未知错误
      else
        ctx.jsonFail('Unknown Server Error', 500)
    }
  } catch (e) {
    ctx.jsonAnyFail(e)
  }
}
