import * as Koa from 'koa'
import serve_context from './context'

declare type ServeContext = typeof serve_context;

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
  legacy?: string,
  redirect?: string,
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

export interface Context extends ServeContext, Koa.Context {
  params: { [index: string]: string },
}

export interface Action {
  [path: string]: {
    options: ActionOptions,
    default (ctx: Context): Promise<void>;
  }
}

declare module 'koa' {
  interface Request {
    body?: any;
    rawBody: string;
  }
}





