/**
 * 常用公共方法
 */
import * as fp from 'lodash/fp'
import type {
  SelectOption,
  Storage,
  MergeParams,
  TransChar,
  FindTreeObj,
  FindTreeIds
} from '../types/util'

const $util = {
  /**
    * storage方法简写
    * @param type 存储类型
    * @param action 执行动作
    * @param key 键名称
    * @param value 键值
    */
  storage (type: Storage.Type, action: Storage.Action, key: string, ...args: Storage.Args) {
    const [value] = args
    if (type === 'local') {
      if (action === 'set') {
        window.localStorage.setItem(key, value || '')
      } else if (action === 'del') {
        window.localStorage.removeItem(key)
      } else if (action === 'get') {
        return window.localStorage.getItem(key)
      }
    } else if (type === 'session') {
      if (action === 'set') {
        window.sessionStorage.setItem(key, value || '')
      } else if (action === 'del') {
        window.sessionStorage.removeItem(key)
      } else if (action === 'get') {
        return window.sessionStorage.getItem(key)
      }
    }
  },
  /**
    * 简易倒计时
    * @param sec 倒计时总秒数
    * @param changeFun 每秒变化时的回调
    * @param doneFun 倒计时完成时的回调
    */
  countDown (sec: number, changeFun: (sec: number) => void, doneFun?: () => void) {
    const timer = setInterval(() => {
      if (sec--) {
        changeFun(sec)
      } else {
        if (doneFun) {
          doneFun()
        }
        clearInterval(timer)
      }
    }, 1000)
  },
  /**
    * 信息脱敏处理
    * @param str 需要脱敏的源数据，如果是number类型则会被转为string类型
    * @param startLen 起始长度
    * @param endLen 结束长度
    */
  desen (str: string | number, startLen: number, endLen: number) {
    const toStr = str + ''
    let len = toStr.length - startLen - endLen
    let xin = ''
    while (len > 0) {
      xin += '*'
      len--
    }
    return `${toStr.substring(0, startLen)}${xin}${toStr.substring(toStr.length - endLen)}`
  },
  /**
    * 根据value值获取label名称
    * @param value - 目标值
    * @param items - 查找的目标数据
    * @returns label名称
    */
  getLabelByValue (value: string | number, items: Array<SelectOption>) {
    const find = items.find(e => e.value === value)
    return find?.label || '--'
  },
  /**
    * 合并params，主要应用场景为搜索查询
    * @param {Object} targetParams - 目标params，即最终和接口交互传入的params
    * @param {Object} sourceParams - 需要合并的params，一般为搜索条件的params
    * @param {Object} options - 用于配置目标params中不参与合并的属性
    * @param {string[]} options.retainKeys - 用于配置目标params中不参与合并的属性
    * @param {string[]} options.deleteKyes - 最终需要删除的多余属性
    */
  mergeParams <T> (targetParams: T, sourceParams: T, options?: MergeParams.Options) {
    const retainKeys = options?.retainKeys || ['current', 'size']
    const deleteKyes = options?.deleteKyes || []
    for (const key in sourceParams) {
      targetParams[key] = sourceParams[key]
    }
    for (const key in targetParams) {
      if (!retainKeys.includes(key)) {
        sourceParams[key] ? targetParams[key] = sourceParams[key] : delete targetParams[key]
      }
    }
    if (deleteKyes.length) {
      deleteKyes.forEach(key => {
        delete targetParams[key]
      })
    }
    return targetParams
  },
  /**
   * 转译特殊字符，需使用lodash/fp模块
   * @param targets 需要转译的特殊字符代号数组 ['lt', 'le', 'gt', 'ge',[...]]
   * @param extras 默认支持转译不满足的情况下可以自行补充转译函数数组 [fp.replace(/</g, '&lt;')]
   * @returns (str: string) => string
   */
  transChar (targets: TransChar.Targets, extras?: TransChar.Extras): (str: string) => string {
    const lt = fp.replace(/</g, '&lt;')
    const le = fp.replace(/≤/g, '&le;')
    const gt = fp.replace(/>/g, '&gt;')
    const ge = fp.replace(/≥/g, '&ge;')
    const transArr: Array<[TransChar.Keys, any]> = [
      ['lt', lt],
      ['le', le],
      ['gt', gt],
      ['ge', ge],
    ]
    const _extras: TransChar.Extras = extras || []
    const replacers = targets.map(key => {
      const find = transArr.find(e => e[0] === key)
      if (find) return find[1]
    })
    const transFlow = fp.flowRight(...replacers.concat(_extras))
    return function (str: string) {
      return transFlow(str)
    }
  },
  /**
   * 首字母大写
   * @param str 需要转的字符串
   * @returns string
   */
  capitalize (str: string) {
    return str.toLowerCase().replace(/( |^)[a-z]/g, l => l.toUpperCase())
  },
  /**
    * 从多层级数组中找到目标ID所在的对象
    * @param {string} targetId - 目标ID
    * @param {Object} options - 可选参数
    * @param {string} options.id - id别名
    * @param {string} options.children - The employee's department.
    * @example
    * ```js
    * const items = [
    *   {
    *     id: '123',
    *     name: 'aaa',
    *     children: [
    *        {
    *          id: '456',
    *          name: 'bbb'
    *        }
    *     ]
    *   }
    * ]
    * const finder = $util.findTreeObj('123')
    * console.log(finder(items))
    * ```
    */
  findTreeObj (targetId: string, options?: FindTreeObj.Options): FindTreeObj.Return {
    let findObj: FindTreeObj.Options
    const idkey = options?.id || 'id'
    const childrenKey = (options?.children || 'children') as string
    return function finder (items: Array<FindTreeObj.Options>) {
      for (const item of items) {
        if (item[idkey] === targetId) {
          findObj = JSON.parse(JSON.stringify(item))
          break
        }
        if (item[childrenKey] && item[childrenKey].length) {
          finder(item[childrenKey])
        }
      }
      return findObj
    }
  },
  /**
    * 搜索目标ID的所有父级ID
    * @param {string} targetId - 目标ID
    * @param {Array} items - 要执行搜索的数组，数据格式示例：[{id: '111111', label: '父级', children: [{id: '222222', label: '子级1', children: [{ id: '333333', label: '子级2' }]}]}]
    * @param {Object} options - 可选参数，设置id和children的别名
    * @param {string} options.parentId - 父级的id，用以累加
    * @returns {Array} 返回包含目标ID及其所有父级ID的数组集合
    * @example
    * ```js
    * const items = [
    *   {
    *     id: '1',
    *     name: '父级',
    *     children: [
    *        {
    *          id: '2',
    *          name: '子级-1'
    *        }
    *     ]
    *   }
    * ]
    * const finder = $util.findTreeIds('2')
    * console.log(finder(items))
    * ```
    */
  findTreeIds (targetId: string | number, options?: FindTreeIds.Options): FindTreeIds.Return {
    let findIds: string | undefined
    const idkey = options?.id || 'id'
    const childrenKey = options?.children || 'children'
    return function finder (items: Array<FindTreeIds.Item>, parentId?: string | number | undefined) {
      for (const item of items) {
        item[idkey] += parentId ? `,${parentId}` : ''
        if (item[idkey].includes(targetId)) {
          findIds = item[idkey]
          break
        }
        if (item[childrenKey] && item[childrenKey].length) {
          finder(item[childrenKey], item[idkey])
        }
      }
      const findIdsArr = findIds?.split(',') || []
      return findIdsArr.reverse()
    }
  },
}

export default $util
