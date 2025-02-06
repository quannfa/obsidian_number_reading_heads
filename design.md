# 程序框架

## 介绍
这是一个Obsidian插件，自动为标题添加编号。本插件具有以下特点：
- 支持多级标题，自动为每个标题添加编号
- 支持自定义编号格式，如1.1、1.1.1、1.1.1.1等
- 支持自定义编号分隔符，如.、-等
- 仅在渲染时添加编号，不改写原始文档内容，不影响原始文档的编辑

## 技术路线

### 程序逻辑
首先，我们需要了解如何在渲染时修改markdown文档。在Obsidian中，渲染是通过markdown-it这个库来实现的。我们可以通过Obsidian提供的API，获取到markdown-it的实例，然后修改其渲染规则，实现我们的功能。

1. 获取markdown-it实例：在插件的onload函数中，我们可以通过app.workspace.getActiveViewOfType(MarkdownView)获取到当前激活的MarkdownView，然后通过MarkdownView的getMode函数获取到当前视图的模式，如果是渲染模式，我们就可以获取到markdown-it的实例。
2. 获取标题级别：在markdown-it的实例中，我们可以通过getData函数获取到当前文档的标题级别，然后根据标题级别来确定需要添加的数字。
3. 修改渲染规则：我们可以通过markdown-it的实例的renderer.rules.heading函数来修改标题的渲染规则，实现我们的功能。

插件的程序代码被写入了'src/main.ts'文件中。

### 数据流
1. **获取标题**: 从文档中提取所有标题。
2. **添加编号**: 使用 `addNumbering` 函数为标题添加编号。
3. **渲染标题**: 将带编号的标题渲染到文档中。

### 接口
- **getTitles**: 从文档中获取标题列表。
- **renderTitles**: 将处理后的标题列表渲染到文档中。

### 错误处理
- **无标题**: 如果文档中没有标题，插件应当处理这种情况并给出提示。
- **编号冲突**: 如果标题已经有编号，插件应当检测并避免重复编号。

## 合理性分析

### 优点
1. **模块化设计**: 通过将功能分解为多个模块，代码更易于维护和扩展。
2. **使用现有库**: 利用markdown-it库进行渲染，减少了重复造轮子的工作，提高了开发效率。
3. **非侵入性**: 仅在渲染时添加编号，不改写原始文档内容，确保了文档的完整性和可编辑性。

### 潜在问题
1. **性能问题**: 在处理大型文档时，可能会出现性能瓶颈，需要进行性能优化。
2. **兼容性问题**: 需要确保插件在不同版本的Obsidian中都能正常工作。
3. **用户自定义需求**: 需要提供足够的配置选项，以满足不同用户的需求。

## 用户配置选项

为了满足不同用户的需求，插件应当提供以下配置选项：
1. **编号格式**: 用户可以自定义编号格式，如1.1、1.1.1、1.1.1.1等。
2. **编号分隔符**: 用户可以自定义编号分隔符，如.、-等。
3. **启用/禁用编号**: 用户可以选择是否启用自动编号功能。
4. **标题级别**: 用户可以选择需要编号的标题级别，如只为h1和h2添加编号。

这些配置选项可以通过插件的设置界面进行配置，具体实现可以参考Obsidian插件开发文档。

## CSS 实现
可以使用如下CSS，为不同级别的标题自动添加编号：

```css
/* CSS 样式 */
h1 {
    counter-reset: h2counter; /* 重置 h2 计数器 */
}
h2 {
    counter-reset: h3counter; /* 重置 h3 计数器 */
}
h3 {
    counter-reset: h4counter; /* 重置 h4 计数器 */
}
h4 {
    counter-reset: h5counter; /* 重置 h5 计数器 */
}
h5 {
    counter-reset: h6counter; /* 重置 h6 计数器 */
}
h6 {
    counter-reset: none; /* 不重置计数器 */
}

h1:before {
    counter-increment: h1counter;
    content: counter(h1counter) ". ";
}
h2:before {
    counter-increment: h2counter;
    content: counter(h1counter) "." counter(h2counter) ". ";
}
h3:before {
    counter-increment: h3counter;
    content: counter(h1counter) "." counter(h2counter) "." counter(h3counter) ". ";
}
h4:before {
    counter-increment: h4counter;
    content: counter(h1counter) "." counter(h2counter) "." counter(h3counter) "." counter(h4counter) ". ";
}
h5:before {
    counter-increment: h5counter;
    content: counter(h1counter) "." counter(h2counter) "." counter(h3counter) "." counter(h4counter) "." counter(h5counter) ". ";
}
h6:before {
    counter-increment: h6counter;
    content: counter(h1counter) "." counter(h2counter) "." counter(h3counter) "." counter(h4counter) "." counter(h5counter) "." counter(h6counter) ". ";
}
```

### 编译打包
插件的代码需要进行编译和打包，以便在Obsidian中使用。以下是编译和打包的步骤：

1. **安装依赖**: 在项目根目录下运行 `npm install` 安装所有依赖包。
2. **编译代码**: 运行 `npm run build` 编译TypeScript代码，生成JavaScript文件。
3. **打包插件**: 将编译后的文件和其他必要的资源打包到一个文件夹中，确保Obsidian能够识别和加载插件。

编译和打包完成后，可以在Obsidian中加载插件进行测试和使用。

