import * as Koa from 'koa'
import contextExtend from './context'

declare type ContextExtend = typeof contextExtend;

interface ActionOptions {
  name?: string,
  desc?: string,
  router?: any,
  group?: string,
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE',
  param?: { [i: string]: any },
  query?: { [i: string]: any },
  body?: { [i: string]: any },
  result?: { [i: string]: any },
  note?: { [i: string]: any },
  delete?: boolean,
}

// 对外
export interface Dic<T> {
  [index: string]: T
}

export interface DocsEnv {
  path: string,
  filter: boolean,
  expansion: 'none' | 'full' | 'list',
  info: {
    title: string,
    description: string
  },
}

export type Apps = Dic<Dic<string>>
export type Session = Dic<string | string[]>

export interface Context extends ContextExtend, Koa.Context {
  params: { [index: string]: string },
}

export interface Action {
  [path: string]: {
    options: ActionOptions,
    default (ctx: Context): Promise<void>;
  }
}

// 扩展类库
declare module 'coa-env' {
  interface Env {
    docs: DocsEnv
  }
}
declare module 'koa' {
  interface Request {
    body?: any;
    rawBody: string;
  }
}





