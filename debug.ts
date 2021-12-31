import { $util } from './es'

const items = [
  {
    id: '111111',
    label: '父级',
    children: [
      {
        id: '222222',
        label: '子级1',
        children: [
          {
            id: '333333',
            label: '子级2'
          }
        ]
      }
    ]
  }
]
const find = $util.findTreeIds('222222')
console.log(find(items))