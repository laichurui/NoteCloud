/**
 * 加载笔记
 *
 * 需要导入 highlight.pack.js 和 marked.min.js
 */

import "./lib/marked.js";
import hljs from "./lib/highlight.js";

/**
 * 使用 ajax 从服务器加载 markdown 文件
 *
 * - 加载成功调用 {@link loadSuccess} 展示文件内容
 * - 加载失败弹出错误码提示窗口
 *
 * @param url {String} 文件的路径
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
 * @param content {String} 原始文件内容
 * @param element {Element} html标签元素
 * @see loadMdFile
 */
function loadSuccess(content, element) {
    element.innerHTML = marked(content);
    document.querySelectorAll("pre code").forEach(
        (block) => hljs.highlightBlock(block)
    );
}

/**
 * 自动加载 md 文件<br>
 * 适用标签：`class` 属性中包含 `md-file-preview`，并且设置了 `data-md-url` 属性
 *
 * @see loadMdFile
 */
function autoLoadMdFile() {
    document.querySelectorAll(".md-file-preview").forEach(
        (element) => {
            /** @type string */
            let url = element.getAttribute("data-md-url");
            if (url == null) return;
            loadMdFile(url, element);
        }
    );
}

window.onload = autoLoadMdFile;