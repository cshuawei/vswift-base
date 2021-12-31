export namespace Util {
  export interface SelectOption {
    label: string
    value?: string | number
    options?: Array<SelectOption>
  }
  export type StorageType = 'local' | 'session'
  export type StorageAction = 'set' | 'get' | 'del'
  interface StorageOptions {
    expire: number
  }
  export type StorageArgs = [string?, StorageOptions?]
  export interface FindTreeObjOptions {
    id?: string
    children?: string
  }
  export interface FindTreeObj {
    id?: string
    children?: Array<FindTreeObj>
    [key: string]: any
  }
  export type FindTreeObjReturn = (items: Array<FindTreeObj>) => Util.FindTreeObj
  export interface MergeParamsOptions {
    retainKeys?: Array<string> | undefined
    deleteKyes?: Array<string> | undefined
  }
  export interface FindTreeIdsOptions {
    id?: string | number | undefined
    children?: string | undefined
  }
  export interface FindTreeIdsItem {
    id?: string | number | undefined
    children?: FindTreeIdsItem | undefined
    [key: string]: any
  }
  export type FindTreeIdsReturn = (items: Array<FindTreeIdsItem>, parentId?: string | number | undefined) => Array<string>
}

export interface Pattern {
  sum: RegExp,
  discount: RegExp,
  num: RegExp,
  numNoZero: RegExp,
  stock: RegExp,
  hour: RegExp,
  minute: RegExp,
  postCode: RegExp,
  email: RegExp,
  phone: RegExp,
  landline: RegExp,
  telephone: RegExp,
  nohanzi: RegExp,
  numbydot: RegExp,
  numEnbydot: RegExp,
  idCard: RegExp,
  bankCard: RegExp,
  noSpace: RegExp,
  password: RegExp,
  [key: string]: RegExp
}