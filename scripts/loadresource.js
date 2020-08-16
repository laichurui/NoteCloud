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
 * 加载 md 文件，并把内容填充进 .preview 元素
 *
 * @param {string}      url     文件路径
 * @param {HTMLElement} element 标签
 */
function loadMdFileToElement(url, element) {
    loadFile(url, req => fillMdToElement(req.responseText, element));
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
 * 把 notes 内容转化为 html 标签填入 fillTarget 中，注意：fillTarget原有的子标签不会被清除
 *
 * @param {HTMLCollection} notes nav.xml的标签
 * @param {HTMLElement} fillTarget 填充的目标标签，对应 html 页面中的标签
 * @see loadXmlToNavTree
 */
function fillNavTree(notes,
                     fillTarget = document.querySelector(".nav-tree-list")) {
    for (let n of notes) {
        let li = document.createElement("li");
        li.classList.add("nav-tree-item");

        let displayName = document.createElement("span");
        li.appendChild(displayName);

        if (n.tagName === "note") {
            displayName.classList.add("nav-tree-link");
            displayName.innerHTML = n.innerHTML;
            displayName.setAttribute("data-src", n.getAttribute("src"));

            //点击后进入选中状态
            displayName.addEventListener("click", () => {
                if (!displayName.classList.contains("_activate")) {
                    let curActivate = document.querySelector("._activate");
                    if (curActivate != null)
                        curActivate.classList.remove("_activate");
                    displayName.classList.add("_activate");
                }
                loadMdFileToElement(displayName.getAttribute("data-src"),
                    document.querySelector(".preview"));
            });

        } else if (n.tagName === "note-list") {
            li.classList.add("_branch");
            displayName.innerText = n.getAttribute("name");

            //添加展开/关闭标签
            let expander = document.createElement("div");
            expander.classList.add("nav-tree-item-expander");
            expander.addEventListener("click", () => {
                if (li.classList.contains("_opened")) { //分支标签已展开
                    li.classList.remove("_opened");
                } else {
                    li.classList.add("_opened");
                }
            });
            li.appendChild(expander);

            //编辑子列表
            let ul = document.createElement("ul");
            ul.classList.add("nav-tree-list");
            li.appendChild(ul);
            fillNavTree(n.children, ul);
        }
        fillTarget.appendChild(li);
    }
}

function loadXmlToNavTree() {
    loadFile("nav.xml", req => fillNavTree(req.responseXML.documentElement.children));
}

window.addEventListener("load", loadXmlToNavTree);
window.addEventListener("load", autoLoadMdFile);