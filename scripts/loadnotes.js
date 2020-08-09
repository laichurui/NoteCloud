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
 * @param url {String} 文件的路径
 * @param elementId {String} 用于展示文件内容的元素id
 * @return any
 * @see loadSuccess
 */
function loadMdFile(url, elementId) {
    /** @type {XMLHttpRequest} */
    let request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.send();

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status === 200) {
                loadSuccess(request.responseText, elementId);
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
 * 解析后的内容通过 `elementId` 对应的标签展示
 *
 * @param content {String} 原始文件内容
 * @param elementId {String} html标签元素的id
 * @see loadMdFile
 */
function loadSuccess(content, elementId) {
    document.getElementById(elementId).innerHTML = marked(content);
    document.querySelectorAll("pre code").forEach(
        (block) => hljs.highlightBlock(block)
    );
}