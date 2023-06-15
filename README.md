# 笔记云

弹窗消息提醒参考来源：https://learnku.com/f2e/t/29779

添加笔记的方法：
1. 在笔记目录中新建 .md 文件
2. 运行 GenerateNavJson，生成 笔记.json 文件

推荐使用 chrome 浏览器。

Firefox 浏览器需要打开 has 选择器支持，具体操作：地址栏输入 about:config，搜索 layout.css.has-selector.enabled 并设置为 true。

## 笔记格式

笔记都是 markdown 文件，参考 [markdown指南](?article=笔记/markdown指南.md) 学习如何编辑md文件。

在笔记加载完后，网页会把h1-h6标签提取出来，作为章节标题放入目录栏中。用户只要点击目录栏的章节索引就能跳转到对应章节。如果**需要使用标题，但又不希望被提取成章节索引**，此时设置class属性为**notitle**即可:

    <h1 class=notitle>hello</h1>

> **更多信息**
>
> md文件是通过 marked.js 解析的  
> 代码使用 highlight.js 进行高亮处理

## 笔记.json说明

网页根据 笔记.json 的内容生成笔记导航。

效果图:

![示例](images/example.jpg)