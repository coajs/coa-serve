import { echo } from 'coa-echo'
import { die } from 'coa-error'
import { _ } from 'coa-helper'

export default {
  // 扩展属性
  extend (target: object, ...extend: object[]) {
    extend.forEach(ext => Object.defineProperties(target, Object.getOwnPropertyDescriptors(ext)))
  },
  // 显示启动信息
  showBootInfo (port?: number) {
    const consoleTime = '[server] Startup successful in '
    if (!port) {
      // 开始
      console.time(consoleTime)
      echo.info('')
      echo.info('[server] Booting...')
    } else {
      // 结束
      echo.info('[server] Listening on port %d', port)
      console.timeEnd(consoleTime)
    }
  },
  // 校验并返回处理后的参数
  checkParam<T> (id: string, value: T, data: any, required: boolean, title?: string) {

    required && !data && die.hint(`缺少${title || id}参数`)
    const invalid = () => required ? die.hint(`参数${title || id}有误`) : value

    const type = typeof value as string
    if (type === 'string') {
      data = _.toString(data) || invalid()
    } else if (type === 'number' || type === 'bigint') {
      data = _.toNumber(data) || invalid()
    } else if (type === 'boolean') {
      data = _.isBoolean(data) ? !!data : invalid()
    } else if (type === 'object') {
      if (_.isArray(value)) {
        data = _.isArray(data) ? data : (data ? [data] : invalid())
      } else {
        data = _.isObject(data) ? data : invalid()
      }
    }
    return data as T
  }
}