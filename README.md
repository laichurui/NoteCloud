# 笔记云

使用方法：
- 编辑 markdown 格式的文件，存放到 notes 文件夹下
- 在 nav.xml 中添加笔记的导航

## 笔记格式

笔记都是 markdown 文件，参考 [markdown指南](?article=notes/markdown指南.md) 学习如何编辑笔记。

网页会自动识别笔记内的标题，同时添加到目录栏中。在编辑笔记内容时要注意标题的使用。

> **更多信息**  
> md文件是通过 marked.js 解析的  
> 代码使用 highlight.js 进行高亮处理

## nav.xml说明

网页根据 nav.xml 的内容生成笔记导航。nav.xml 中包含三种标签：notes, note-list, note。

|标签|功能|
|---|---|
|notes|根标签|
|note-list|笔记列表，包含多个 note 标签<br/>子标签会作为导航树的下级节点，放入列表中<br/><br/>属性说明：<br/>name：列表名称|
|note|笔记链接，标签内的文本作为链接的名称显示出来<br/><br/>属性说明：<br/>src：笔记的url地址|