export class PluginConfig {
  /**
   * 扫描的目录
   * src/main/ets/
   */
  scanDir: string = ''
  /**
     * builder函数注册代码生成的目录
     * src/main/ets/_generated/
     */
  generatedDir: string = ''
  /**
   * Index.ets目录
   * 模块下目录下
   */
  indexDir: string = ''
  /**
   * module.json5文件路径
   * src/main/ets/module.json5
   */
  moduleJsonPath: string = ''
  /**
   * 路由表路径
   * src/main/ets/resources/base/profile/route_map.json
   */
  routerMapPath: string = ''
}


export class PageInfo {
  pageName?: string;
  importPath?: string;
  absolutePath: string = ''
  buildFunctionName: string = ''
  buildFileName: string = ''
}


export class RouteMap {
  routerMap: Array<RouteInfo> = []
}

export class RouteInfo {
  name?: string = ''
  /**
   * builder函数注册路径，是相对于模块的路径
   */
  pageSourceFile?: string = ''
  buildFunction?: string = ''
}


export class AnalyzerResult {
  // 路由名称(route装饰器的name，也是对应route_map路由表的name)
  name: string = ''
  // 路由描述(route装饰器的description，也是对应route_map路由表的description)
  description: string = ''
  // 页面名称
  pageName: string = '';

  reset() {
    this.name = ""
    this.pageName = ""
  }
}

export class Annotation {
  annotationName: string = 'Route'
  name: string = 'name'
}