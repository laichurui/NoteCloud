/**
 * 加载笔记
 *
 * 需要导入 highlight.pack.js 和 marked.min.js
 */

/**
 * 使用 ajax 从服务器加载 markdown 文件
 *
 * - 加载成功调用 {@link loadSuccess} 展示文件内容
 * - 加载失败弹出错误码提示窗口
 *
 * @param url {string} 文件的路径
 * @param element {Element} 用于展示文件内容的元素
 * @return any
 * @see loadSuccess
 */
function loadMdFile(url, element) {
    /** @type {XMLHttpRequest} */
    let request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.send();

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status === 200) {
                loadSuccess(request.responseText, element);
            } else {
                alert("error code: " + request.status);
            }
        }
    };
}

/**
 * 成功加载文件后执行
 *
 * `content` 按 markdown 语法解析为对应的 html 语句，
 * 解析后的内容通过 `element` 展示
 *
 * @param content {string} 原始文件内容
 * @param element {Element} html标签元素
 * @see loadMdFile
 */
function loadSuccess(content, element) {
    element.innerHTML = marked(content);
    element.querySelectorAll("code").forEach(
        (block) => {
            hljs.highlightBlock(block);

            // 在 "pre code" 标签中添加行号
            if (block.parentElement != null &&
                block.parentElement.tagName.toLowerCase() === "pre") {

                /** @type {HTMLSpanElement} */
                let lineNumbers = document.createElement("span");
                lineNumbers.classList.add("line-number-rows");

                /** @type {int} */
                let line_count = block.innerHTML.split("\n").length;
                for (let i = 1; i <= line_count; i++) {
                    /** @type {HTMLSpanElement} */
                    let num = document.createElement("span");
                    num.classList.add("line-number");
                    lineNumbers.appendChild(num);
                }
                block.prepend(lineNumbers);
            }
        }
    );
}

/**
 * 自动加载 md 文件<br>
 * 适用标签：设置了 `data-md-url` 属性的标签
 *
 * @see loadMdFile
 */
function autoLoadMdFile() {
    document.querySelectorAll("[data-md-url]").forEach(
        (element) => {
            /** @type string */
            let url = element.getAttribute("data-md-url");
            loadMdFile(url, element);
        }
    );
}

window.onload = autoLoadMdFile;

//TODO 删除
function btn_click() {
    /** @type {HTMLElement} */
    let sidebar = document.getElementById("sidebar");
    /** @type {HTMLElement} */
    let preview = document.getElementById("preview");

    if (isclosed) {
        replaceOrAddClass(sidebar, "anim-close", "anim-close-reverse");
        replaceOrAddClass(preview, "anim-expand", "anim-expand-reverse");
    } else {
        replaceOrAddClass(sidebar, "anim-close-reverse", "anim-close");
        replaceOrAddClass(preview, "anim-expand-reverse", "anim-expand");
    }
    isclosed = !isclosed;
}

/**
 * 替换或添加 `class` 属性
 *
 * - 如果 `new_class` 存在，不执行任何操作
 * - 如果 `old_class` 存在，则替换为 `new_class`
 * - 如果 `old_class` 不存在，直接添加 `new_class`
 * @param element {HTMLElement} html 标签
 * @param old_class {string} 旧类
 * @param new_class {string} 新类
 */
function replaceOrAddClass(element, old_class, new_class) {
    if (element.classList.contains(new_class))
        return;

    if (element.classList.contains(old_class)) {
        element.classList.replace(old_class, new_class);
    } else {
        element.classList.add(new_class);
    }
}

var isclosed = false;