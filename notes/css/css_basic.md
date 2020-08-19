# css基础入门

## 样式切换
思路：利用属性选择器实现，根据属性的值来应用新样式

代码示例：
```css
/* 默认样式 */
.target {
    width: 100px;
    transition: width .3s ease 0s; /* 过渡动画 */
    ...
}
/* 属性值为 larger 时的样式 */
.target[data-state=larger] {
    width: 200px; /* 覆盖原来的 width 属性 */
}
```

使用 javascript 更改 data-state 的值就可以改变样式，效果如下：
<iframe srcdoc='
<style type="text/css">
    .target {
    width: 100px;
    height: 100px;
    background-color: blue;
    /*
    使用transition添加属性的过渡动画
    属性值变化时有动画效果
    */
    transition: width .3s ease 0s;
    }
    .target[data-state=larger] {
        width: 200px;
    }
</style>
<div class="target" data-state="default"></div>
<button onclick="switchStyle()">切换样式</button>
<script>
    function switchStyle() {
        let tag = document.querySelector(".target");
        let state = tag.getAttribute("data-state");
        tag.setAttribute("data-state",
            (state == null || state === "default") ? "larger" : "default"
        );
    }
</script>'></iframe>

## 标签显示超出父标签
在父标签设置 *overflow* 属性为 *visible*，子标签就可以超出父标签

效果：
<iframe srcdoc='
<style type="text/css">
    .container {
        width: 100px;
        overflow: visible;
        background-color: lightgray;
    }
    .text, .long-text {
        width: 100%;
        white-space: nowrap;
    }
    .text {
        overflow: hidden;
    }
</style>
<div class="container">
    <div class="text">
        hello world, hello world
    </div>
    <div class="long-text">
        这是一段超出父标签宽度文字
    </div>
</div>'></iframe>

## 文本垂直居中
曲线救国，设置 *line-height* 属性

```css
<style type="text/css">
    .text {
        height: 200px;
        line-height: 200px;
        background-color: gray;
    }
</style>
```

效果：
<iframe srcdoc='
<style type="text/css">
    .text {
        height: 100px;
        line-height: 100px;
        background-color: gray;
    }
</style>
<div>
    <div class="text">
        hello world
    </div>
</div>'></iframe>