export const getStr = (expression: string, idMap: Map<string, string>): string => {
  if (!expression) {
    return ''
  }
  if (!expression.includes('[')) {
    return expression
  }
  let attrId = ''
  let str = ''
  let startFlag = false
  for (const i of expression) {
    if (i === '[') {
      startFlag = true
      attrId = ''
      continue
    }
    if (i === ']') {
      startFlag = false
      const name = idMap.get(attrId)
      if (name) {
        str = `${str}[${name}]`
      }
      else {
        str = `${str}[${attrId}]`
      }
      continue
    }
    if (!startFlag) {
      str = `${str}${i}`
    }
    else {
      attrId = `${attrId}${i}`
    }
  }
  return str
}
export const logicOpt: Array<string> = ['==', '!=', '>', '<', '>=', '<=']
export const logicRelationOpt: Array<string> = ['&&', '||']
export const getExpression = (expression: string): any[] => {
  if (!expression) {
    return []
  }
  const array = new Array<any>()
  let itemStr = ''

  for (const i of expression) {
    if (i === '[') {
      if (itemStr.length > 0) {
        const item = {
          type: 'input',
          value: itemStr,
        }
        array.push(item)
      }
      itemStr = ''
      continue
    }
    if (i === ']') {
      if (itemStr.length > 0) {
        const item = {
          type: 'select',
          value: itemStr,
        }
        array.push(item)
      }
      itemStr = ''
      continue
    }
    itemStr = `${itemStr}${i}`
  }
  return array
}

