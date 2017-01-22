# tf-react-cpn
常用react组件

## 说明
目前此组件的样式依赖于amazeui，若有需要可自行修改。

## 日志更新

### v1.1.0
- 添加分页组件Pagination。
- 添加DateInput组件定位属性，使其支持absolute和fixed定位。
- 添加DateInput组件disabled属性。
- 添加className和style属性到SearchSelect组件和DateInput组件。

### v1.0.4
- 修复DateInput默认值为空串时会显示undefined的问题。
- 调整SearchSelect部分样式问题。

### v1.0.3
- 添加SearchSelect的value类型验证。
- 修改Modal的title属性类型为node，即允许多类型。

### v1.0.2
- 添加examples测试页面。
- 修复DateInput组件清空时没有回调的问题。
- 修复严格模式下因调用arguments.callee而产生的问题。

### v1.0.1
- 修改工具模块引用为tf-utils。
- 调整项目结构，使用babel编译。

### v1.0.0
- 创建。