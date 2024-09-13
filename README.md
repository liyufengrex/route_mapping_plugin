
## Route-mapping-plugin

示例如何使用 ts 开发 hvigor 构建任务， 本示例演示通过 注解 + 构建任务 自动生成系统路由注册表。

+ 自动生成和配置 `route_map.json` 文件
+ 自动生成和配置 `每个页面对应的 Builder 函数`
+ 最后可通过 `pushPathByName` 等路由接口进行页面跳转


## 插件开发步骤

### 1. 初始化一个npm项目
`npm init （生成 package.json）`


### 2. 初始化typeScript配置文件
`tsc --init （生成 tsconfig.json）`


### 3. 添加依赖声明
```ts
// 打开package.json添加devDependencies配置

"devDependencies": {
    "@ohos/hvigor": "5.2.2"
}
```

### 4. 安装依赖
`npm install`


### 5. 编写插件代码
```ts
// 创建custom-plugin.ts文件，编写插件代码

import { HvigorNode, HvigorPlugin } from '@ohos/hvigor';

export function customPlugin(): HvigorPlugin {
    return {
        pluginId: 'customPlugin',
        apply(node: HvigorNode) {

            // 构建任务测试打印 hello
            console.log('hello customPlugin!');
        }
    }
}
```

### 6. 导出插件
```ts
// 创建index.ts文件，并在该文件中声明插件方法的导出

export { customPlugin } from './src/custom-plugin';
```

### 7. 使用插件
```ts
// 第一步：在鸿蒙工程创建一个文件夹（script），将上面的ts项目代码复制到文件夹内

// 第二步：在鸿蒙工程下hvigor/hvigor-config.json5中添加自定义插件依赖，依赖项支持离线插件配置

"dependencies": {
    "route-mapping-plugin": "1.0.0"   // 如果已发布
    "route-mapping-plugin": "file:../script/route_mapping_plugin"  //本地依赖
  }
```

### 8. 安装依赖

+ 方式1：执行编辑区右上角Install Now或执行菜单File -> Sync and Refresh Project进行工程Sync后，DevEco Studio将会根据hvigor-config.json5中的依赖配置自动安装。

+ 方式2：使用hvigorw命令行工具执行任一命令，命令行工具会自动执行安装构建依赖

```ts
hvigorw --sync
```

根据插件编写时基于的node节点，确定导入的节点所在的hvigorfile.ts文件，在hvigorfile.ts中导入插件

```ts
import { customPlugin } from 'route-mapping-pluginn'; // route-mapping-plugin 对应的是 config 中导入时设置的别名
```

将自定义插件添加到export default的plugins中

```ts
export default {
    system: appTasks,
    plugins:[
        customPlugin()  // 应用自定义插件
    ]
}
```

详细参考： https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V5/ide-hvigor-plugin-V5

## 插件使用方式

1. 已在 `hvigor-config.json5` 文件添加本插件依赖
```ts
"dependencies": {
    "route-mapping-plugin": "1.0.0"   // 如果已发布
    "route-mapping-plugin": "file:../script/route_mapping_plugin"  //本地依赖
  }
```
2. 已在 `` 文件添加并导入
```ts
import { harTasks } from '@ohos/hvigor-ohos-plugin';
import { RouteMappingPlugin, PluginConfig } from 'route-mapping-plugin'

const config: PluginConfig = {
    scanDir: "src/main/ets/pages"
}

export default {
    system: harTasks,  
    plugins:[
        RouteMappingPlugin(config)
    ]   
}
```
3. 在页面文件使用 Route 注解修饰器，即可自动生成系统路由表文件

例如：
新建一个 Route.ets 作为修饰器
```ts
export function Route(param: Param) {
  return Object
}

export interface Param {
  name: string,
}
```
使用修饰器对页面进行注解
```ts
@Route({ name: 'BuilderNodeExample' })
@Component
export struct BuilderNodeExample {
  ... 省略
}
```

执行 `File -> Sync and Refresh Project进行工程Sync`

自动生成文件如下：

![image.png](https://upload-images.jianshu.io/upload_images/25776880-579e1693f52f6a64.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

route_map.json 内容如下：
```ts
{
  "routerMap": [
    {
      "name": "AttributeModifierExample",
      "pageSourceFile": "src/main/ets/_generated/REXAttributeModifierExample.ets",
      "buildFunction": "feature_homeAttributeModifierExampleBuilder"
    }
  ]
}
```

RexAttributeModifierExample.ets 内容如下：
```ts

import { AttributeModifierExample } from "../pages/AttributeModifierExample";

@Builder
function feature_homeAttributeModifierExampleBuilder() {
  AttributeModifierExample()
}

```