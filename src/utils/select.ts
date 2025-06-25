export default function selectLabel(key: any, list: any[], fun?: { getKeyFun: (item: any) => any; getValueFun: (item: any) => any }): any {
  const isFun = typeof fun != 'undefined'
  for (const item of list) {
    if (isFun) {
      if (fun.getKeyFun(item) === key) {
        return fun.getValueFun(item)
      }
    }
    else if (item.value === key) {
      return item.label
    }
  }
  return ''
}
