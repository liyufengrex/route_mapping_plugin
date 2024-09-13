import { readFileSync } from "fs"
import ts from "typescript";
import { AnalyzerResult, Annotation } from "./plugin-config";
import { isNotEmpty, logger, loggerNode } from "./tool"

const annotation = new Annotation()

export class Analyzer {
  //扫描到的ets文件路径
  private readonly filePath: string = ""
  results: Array<AnalyzerResult> = []
  result: AnalyzerResult = new AnalyzerResult()

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  start() {
    logger('Analyzer filePath: ', this.filePath)
    // 读取文件内容
    const sourceCode = readFileSync(this.filePath, "utf-8");
    loggerNode('Analyzer sourceCode: ', sourceCode)
    // 解析文件内容，生成节点树信息
    const sourceFile = ts.createSourceFile(this.filePath, sourceCode, ts.ScriptTarget.ES2021, false);
    logger('Analyzer sourceFile: ', sourceFile)
    // 遍历节点信息
    ts.forEachChild(sourceFile, (node: ts.Node) => {
      // 解析节点
      try {
        this.resolveNode(node);
      } catch (e) {
        console.error('forEachChild error: ', e);
      }
    });
  }

  private resolveNode(node: ts.Node) {
    logger('resolveNode: ', node.kind, ' ---start')
    loggerNode('resolveNode node: ', node)
    switch (node.kind) {
      // 装饰器节点
      case ts.SyntaxKind.ExportAssignment:
      case ts.SyntaxKind.MissingDeclaration:
        logger("resolveNode progress....", node.kind)
        const child = node as ts.ParameterDeclaration
        const modifiers = child.modifiers
        loggerNode('resolveNode modifiers: ', modifiers)
        // @Component  + @Route
        if (modifiers && modifiers.length >= 2) {
          modifiers.forEach((item) => {
            try {
              this.resolveDecoration(item);
            } catch (e) {
              console.error('resolveNode error: ', e)
            }
          })
        }
        break;
      // 表达式节点 结构体内容
      case ts.SyntaxKind.ExpressionStatement:
        this.resolveExpression(node);
        break;
      default:
        break
    }
    if (isNotEmpty(this.result.pageName) && this.isExistAnnotation()) {
      const item = this.results.find((item) => item.name === this.result.name)
      if (!item) {
        let r = JSON.parse(JSON.stringify(this.result))
        this.results.push(r)
        this.result.reset()
        logger('analyzerResult: ', JSON.stringify(r), JSON.stringify(this.result))
      }
    }
    logger('resolveNode: ', node.kind, ' ---end')
  }


  // 解析结构体
  private resolveExpression(node: ts.Node) {
    let args = node as ts.ExpressionStatement;
    logger('resolveExpression identifier: ', args)
    if (args.expression?.kind == ts.SyntaxKind.Identifier) {
      const identifier = args.expression as ts.Identifier;
      logger('resolveExpression: ', identifier.escapedText)
      if (identifier.escapedText !== 'struct' && this.isExistAnnotation()) {
        this.result.pageName = identifier.escapedText.toString()
      }
    }
  }

  private isExistAnnotation(): boolean {
    return isNotEmpty(this.result.name)
  }


  // 解析装饰器 @Route
  private resolveDecoration(node: ts.Node) {
    // 转换为装饰器节点类型
    let decorator = node as ts.Decorator;
    logger('resolveDecoration kind: ' + decorator?.kind)
    // 判断表达式是否是函数调用
    if (decorator.expression?.kind === ts.SyntaxKind.CallExpression) {
      const callExpression = decorator.expression as ts.CallExpression;
      // 表达式类型是否是标识符
      if (callExpression.expression?.kind === ts.SyntaxKind.Identifier) {
        const identifier = callExpression.expression as ts.Identifier;
        // 标识符是否是自定义的装饰器
        logger(`resolveDecoration text: ${identifier.text}`)
        const args = callExpression.arguments
        if (identifier.text === annotation.annotationName && args && args.length > 0) {
          const arg = args[0];
          this.result = new AnalyzerResult()
          loggerNode(`resolveDecoration arg: `, JSON.stringify(arg))
          // 调用方法的第一个参数是否是表达式
          if (arg?.kind === ts.SyntaxKind.ObjectLiteralExpression) {
            const properties = (arg as ts.ObjectLiteralExpression).properties;
            logger(`resolveDecoration properties length: ${properties.length}`)
            // 遍历装饰器中的所有参数
            properties?.forEach((propertie) => {
              loggerNode(`resolveDecoration properties item: `, JSON.stringify(propertie))
              if (propertie?.kind === ts.SyntaxKind.PropertyAssignment) {
                // 参数是否是自定义装饰器中的变量名
                if ((propertie.name as ts.Identifier).escapedText === annotation.name) {
                  // 将装饰器中的变量的值赋值给解析结果中的变量
                  this.result.name = (propertie.initializer as ts.StringLiteral).text;
                }
              }
            })
          }
        }
      }
    }
  }
}