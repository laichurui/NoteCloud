# markdown简易入门

markdown是一种易读易写的纯文本格式的文档，使用简单的标记来代替html标签。对于排版需求不高的文本，使用markdown编写是一种不错的选择。markdown文档中也可以直接使用html标签实现更复杂的排版。

本指南以GFM(GitHub Flavored Markdown)格式为主来介绍markdown的**部分标签**，更多语法详情请到其他专门的网站学习。

- [GitHub Flavored Markdown](https://github.github.com/gfm/)
- [markdown中文文档](https://markdown-zh.readthedocs.io/en/latest/)
- [markdown作者的网站](https://daringfireball.net/projects/markdown/)

## 语法

md文档实际上是文本内容，通过一些简单的标记可以应用不同格式。**特别提醒：** 有些格式可以用不同的语法实现，后续章节不会提及所有用法。

### 段落
由一个或多个空行分隔，或者在行尾加入两个及以上的空格

> **注意**
>
> 如果直接在下一行开头写入内容，其实际预览的效果是没有换行的

### 常用标记

|md语法|对应的html标签|示例|效果|说明|
|-|-|-|-|-|
|#{1,6} 标题|h1-h6|### 三级标题|<h3 class="notitle">三级标题</h3>|1-6个'#'+空格+标题|
|\*文本\*|em|\*斜体\*|*斜体*||
|\*\*文本\*\*|strong|\*\*粗体\*\*|**粗体**||
|> 块元素|blockquote|> aa|<blockquote>aa</blockquote>|可以多行，每行都要以">"开头|
|- 无序列表|ul|- hello<br>- hi|<ul><li>hello</li><li>hi</li></ul>|'-'号也可以替换为'+'、'*'|
|1. 有序列表|ol|1. hello<br>2. hi|<ol><li>hello</li><li>hi</li></ol>||
|-{3,}|hr|---|<hr/>|水平线<br>一行中只有3个(或更多) '-' 号<br>星号或下划线也可以|
|\[显示文本\](url地址 "title属性")|a|\[百度\](https://www.baidu.com "test")|[百度](https://www.baidu.com "test")|超链接，title属性可以不设置|
|!\[alt属性文本\](url "标题")|img|!\[错误文本\](https://static.hdslb.com/<br>images/favicon.ico "说明文本")|![错误文本](https://static.hdslb.com/images/favicon.ico "说明文本")|图片|
|\特殊符号||\\*|\*|转义，显示特殊符号|

### 代码块

单行代码可以用 **\<code\>** 标签或 **`** 包裹。

多行代码使用三个 **`** ，写法如下：

<pre>```python
def func():
    pass
```</pre>

效果：

```python
def func():
    pass
```
