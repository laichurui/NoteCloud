# 笔记云

使用方法：
- 编辑 markdown 格式的文件，存放到 notes 文件夹下
- 在 nav.xml 中添加笔记的导航(可以借助我写的小工具)

## 笔记格式

笔记都是 markdown 文件，参考 [markdown指南](?article=notes/markdown指南.md) 学习如何编辑md文件。

在笔记加载完后，js代码会把h1-h6标签提取出来，作为章节标题放入目录栏中。用户只要点击目录栏的章节索引就能跳转到对应章节。如果**需要使用标题，但又不希望被提取成章节索引**，此时设置class属性为**notitle**即可:

    <h1 class=notitle>hello</h1>

> **更多信息**
>
> md文件是通过 marked.js 解析的  
> 代码使用 highlight.js 进行高亮处理

## nav.xml说明

网页根据 nav.xml 的内容生成笔记导航。nav.xml 中包含三种标签：notes, note-list, note。

|标签|功能|
|---|---|
|notes|根标签|
|note-list|笔记列表，包含多个 note 标签，可以嵌套使用。<br/>子标签在网页中作为下级节点出现。<br/><br/>属性说明：<br/>name：列表名称|
|note|笔记链接，标签内的文本作为链接的名称显示出来<br/><br/>属性说明：<br/>src：笔记的url地址|

示例:
~~~xml
<?xml version="1.0" encoding="utf-8"?>
<notes>
    <note-list name="example">
        <note-list name="css">
            <note src="notes\css\css_basic.md">css_basic.md</note>
        </note-list>
        <note src="notes\js\highlight_guide.md">highlight_guide.md</note>
        <note src="notes\js\marked_guide.md">marked_guide.md</note>
    </note-list>
    <note src="notes\markdown简易入门.md">markdown简易入门.md</note>
</notes>
~~~

效果图:

![示例](images/example.jpg)