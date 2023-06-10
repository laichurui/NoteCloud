/**
 * 加载资源文件，包括笔记和导航目录
 *
 * 需要导入 highlight.pack.js 和 marked.min.js
 */


/**
 * md 文件加载成功的回调
 * @callback successCallback
 */

/**
 * 把 markdown 文件的内容填充进 element 元素
 *
 * @param {string}      content markdown文件的内容
 * @param {HTMLElement} element 用于显示内容的标签
 */
function fillMdToElement(content, element) {
    element.innerHTML = marked(content);
    element.querySelectorAll("code").forEach(
        (codeBlock) => {
            if (!codeBlock.classList.contains("hljs"))
                codeBlock.classList.add("hljs");
            hljs.highlightBlock(codeBlock);

            // 在 "pre code" 标签中添加行号
            if (codeBlock.parentElement != null &&
                codeBlock.parentElement.tagName.toLowerCase() === "pre") {

                /**
                 * 代码块按换行符切割得到的数组
                 * @type {string[]}
                 */
                let allLines = codeBlock.innerHTML.split("\n");
                /**
                 * 最大的行号宽度
                 * @type {string|null}
                 */
                let maxNumWidth = null;
                codeBlock.innerHTML = ""; // 先清空原来的内容
                let i = allLines.length;
                do {
                    /**
                     * 行号标签
                     * @type {HTMLSpanElement}
                     */
                    let num = document.createElement("span");
                    num.classList.add("line-number");
                    num.innerText = i;

                    /**
                     * 代码内容标签
                     * @type {HTMLSpanElement}
                     */
                    let code = document.createElement("span");
                    code.innerHTML = allLines[i - 1];

                    /**
                     * 代表一行代码，由行号标签和代码内容标签组成
                     * @type {HTMLDivElement}
                     */
                    let codeLine = document.createElement("div");
                    codeLine.classList.add("code-line");
                    codeLine.appendChild(num);
                    codeLine.appendChild(code);

                    codeBlock.prepend(codeLine);

                    // 设置行号标签的宽度
                    if (!maxNumWidth)
                        maxNumWidth = `${num.getBoundingClientRect().width}px`;
                    num.style.flexBasis = maxNumWidth;

                    i--;
                } while (i >= 1);
            }
        }
    );
}

/**
 * 获取 element 相对于 offsetParent 的 offsetTop
 * @param {HTMLElement} element
 * @param {HTMLElement} offsetElement
 * @returns {number} offsetTop的值
 */
function getOffsetTop(element, offsetElement) {
    let offsetTop = 0;
    do {
        if (!isNaN(element.offsetTop))
            offsetTop += element.offsetTop;
        element = element.offsetParent;
    } while (element && element !== offsetElement) ;
    return offsetTop;
}

/**
 * 判断 scrollableElement 的子元素 element 是否在可视窗口中
 * @param {HTMLElement} element
 * @param {HTMLElement} scrollableElement
 * @returns {boolean} 是否在可视窗口中
 */
function isInViewPort(element, scrollableElement) {
    // 获取可视窗口的高度。
    // let screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    let distance = getOffsetTop(element, scrollableElement) - scrollableElement.scrollTop;
    // 判断标签是否在可视窗口
    return distance >= -element.clientHeight && distance <= scrollableElement.clientHeight - 10;
}

/**
 * 加载 md 文件，并把内容填充进 element 元素
 *
 * 加载后根据文件内容自动创建目录
 *
 * @param {string}      url     文件路径
 * @param {HTMLElement} element 标签
 * @param {HTMLElement} catalogueRoot 目录的根标签
 * @param {successCallback} success 笔记导航树的链接
 */
function loadMdFileToElement(url, element, catalogueRoot, success) {
    if (!url.endsWith("md")) { // 非 markdown 文件直接打开链接
        window.open(url, "_blank");
        return;
    }

    fetch(url)
        .then(req => {
            if (req.ok)
                return req.text();
            else
                throw new Error(`HTTP ERROR\n    error code: ${req.status}\n    url: ${url}`);
        })
        .then(data => {
            fillMdToElement(data, element);

            let e = document.querySelector(".url-display");
            if (e) {
                e.innerHTML = url;
                e.setAttribute("title", "打印 " + url);
            }

            createCatalogue(catalogueRoot, element, true);

            // 第一个目录链接高亮
            document.querySelector(".preview").dispatchEvent(new CustomEvent("scroll"));

            success && success();
        });
}