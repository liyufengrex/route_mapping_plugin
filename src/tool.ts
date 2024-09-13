export function loggerNode(...args: any[]) {
  try {
    logger(...args)
  } catch (e) {
    // 暂无处理
  }
}

export function logger(...args: any[]): void {
  console.log('logger-> ', ...args)
}

export function isEmpty(obj: string | undefined | null) {
  return obj === undefined || obj === null || obj.trim().length === 0
}

export function isNotEmpty(obj: string | null | undefined) {
  return !isEmpty(obj)
}