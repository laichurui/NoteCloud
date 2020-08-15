/**
 * 切换页面状态<br>
 * default: 显示导航栏和预览栏<br>
 * only-preview: 只显示预览栏
 */
function switchState() {
    /** @type {HTMLElement} */
    let wrapper = document.querySelector(".wrapper[data-state]");
    /** @type {string} */
    let state = wrapper.getAttribute("data-state");
    wrapper.setAttribute("data-state",
        state === "default" ? "only-preview" : "default");
}

/**
 * 为导航目录的分支标签添加 展开/关闭 标签
 */
function addExpanderForAllBranch() {
    document.querySelectorAll(".nav-tree-item._branch").forEach(
        (element) => {
            /** @type {HTMLDivElement} */
            let expander = document.createElement("div");
            expander.classList.add("nav-tree-item-expander");

            expander.addEventListener("click", () => {
                if (element.classList.contains("_opened")) { //分支标签已展开
                    element.classList.remove("_opened");
                } else {
                    element.classList.add("_opened");
                }
            });
            element.prepend(expander);
        }
    );
}

window.addEventListener("load", addExpanderForAllBranch);