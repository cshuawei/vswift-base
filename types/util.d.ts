export interface SelectOption {
  label: string
  value?: string | number
  options?: Array<SelectOption>
}

export namespace Storage {
  export type Type = 'local' | 'session'
  export type Action = 'set' | 'get' | 'del'
  export interface Options {
    expire: number
  }
  export type Args = [string?, Options?]
}

export namespace MergeParams {
  export interface Options {
    retainKeys?: Array<string> | undefined
    deleteKyes?: Array<string> | undefined
  }
}

export namespace TransChar {
  export type Keys = 'lt' | 'le' | 'gt' | 'ge'
  export type Targets = Array<Keys>
  export type Extras = any[]
}

export namespace FindTreeObj {
  export interface Options {
    id?: string
    children?: string | Options[]
    [key: string]: any
  }
  export type Return = (items: Array<Options>) => Options
}

export namespace FindTreeIds {
  export interface Options {
    id?: string | number | undefined
    children?: string | undefined
  }
  export interface Item {
    id?: string | number | undefined
    children?: Item | undefined
    [key: string]: any
  }
  export type Return = (items: Array<Item>, parentId?: string | number | undefined) => Array<string>
}