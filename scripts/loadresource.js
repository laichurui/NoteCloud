/**
 * 加载资源文件，包括笔记和导航目录
 *
 * 需要导入 highlight.pack.js 和 marked.min.js
 */


/**
 * ajax 请求的回调函数类型
 * @callback requestCallback
 * @param {XMLHttpRequest} request 请求对象，通过其 responseText、responseXML 获取回应内容
 */

/**
 * 使用 ajax 加载文件，加载成功后调用回调函数
 *
 * @param {string}          url     文件路径
 * @param {requestCallback} success 成功加载的回调
 */
function loadFile(url, success) {
    /** @type {XMLHttpRequest} */
    let request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.send();

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status === 200) {
                success(request);
            } else {
                alert(`error code: ${request.status} \n url: ${url}`);
            }
        }
    };
}

/**
 * 把 markdown 文件的内容填充进 element 元素
 *
 * @param {string}      content markdown文件的内容
 * @param {HTMLElement} element 用于显示内容的标签
 */
function fillMdToElement(content, element) {
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
 * 加载 md 文件，并把内容填充进 element 元素
 *
 * @param {string}      url     文件路径
 * @param {HTMLElement} element 标签
 */
function loadMdFileToElement(url, element) {
    loadFile(url, req => {
        fillMdToElement(req.responseText, element);
        let e = document.querySelector(".url-display");
        if (e)
            e.innerHTML = url;

        createCatalogue(
            document.querySelector(".catalogue-nav"),
            document.querySelector(".article"),
            true);
    });
}

/**
 * 自动加载 md 文件<br/>
 * 适用标签：设置了 `data-md-url` 属性的标签
 *
 * @see loadMdFileToElement
 */
function autoLoadMdFile() {
    document.querySelectorAll("[data-md-url]").forEach(
        (element) => {
            /** @type string */
            let url = element.getAttribute("data-md-url");
            loadMdFileToElement(url, element);
        }
    );
}

/**
 * 加载 nav.xml 文件，根据文件内容生成笔记导航树
 */
function loadXmlToNavTree() {

    /**
     * 定义导航项目被点击的事件
     */
    function itemClick() {
        loadMdFileToElement(
            this.getAttribute("data-src"),
            document.querySelector(".article")
        );
    }

    //加载文件，成功后创建目录树
    loadFile("nav.xml",
        req => createNotesNavTree(
            document.querySelector(".notes-nav"),
            req.responseXML.documentElement,
            itemClick
        )
    );
}

window.addEventListener("load", loadXmlToNavTree);
window.addEventListener("load", autoLoadMdFile);