import { _ } from 'coa-helper'

export class JsonState {

  private data = { storage: [] as any[], store: [] as any[] }

  storage (name: string, data: any, ms = 0) {
    let value = ['set', name, data] as any[]
    if (data === null || data === undefined) value = ['remove', name]
    if (ms > 0) value.push(ms)
    this.data.storage.push(value)
    return this
  }

  store (name: string, data: any, ms = 0) {
    let value = ['set', name, data] as any[]
    if (data === null || data === undefined) value = ['remove', name]
    if (ms > 0) value.push(ms)
    this.data.store.push(value)
    return this
  }

  extend (data: any) {
    _.extend(this.data, data)
    return this
  }

  value () {
    this.data.storage.length === 0 && delete (this.data as any).storage
    this.data.store.length === 0 && delete (this.data as any).store
    return this.data
  }
}