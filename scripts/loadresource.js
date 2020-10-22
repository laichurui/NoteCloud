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
                alert(`HTTP ERROR\n    error code: ${request.status}\n    url: ${url}`);
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
        (codeBlock) => {
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
 * 加载 md 文件，并把内容填充进 element 元素
 *
 * 加载后根据文件内容自动创建目录
 *
 * @param {string}      url     文件路径
 * @param {HTMLElement} element 标签
 * @param {HTMLElement} catalogueRoot 目录的根标签
 */
function loadMdFileToElement(url, element, catalogueRoot) {
    loadFile(url, req => {
        fillMdToElement(req.responseText, element);
        let e = document.querySelector(".url-display");
        if (e) {
            e.innerHTML = url;
            e.setAttribute("title", "打印 " + url);
        }

        createCatalogue(catalogueRoot, element, true);
    });
}