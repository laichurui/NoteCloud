/**
 * 切换页面状态<br>
 */
function switchState() {
    /** @type {HTMLElement} */
    let wrapper = document.querySelector(".wrapper");
    /** @type {string} */
    let state = wrapper.getAttribute("data-state");
    wrapper.setAttribute(
        "data-state",
        state == null || state === "default" ? "fit" : "default"
    );
}


/**
 * 鼠标按下事件
 */
function resizeBarDown() {
    this.classList.add("_clicked");

    //取消过渡动画
    let wrapper = document.querySelector(".wrapper")
    wrapper.classList.add("no-transition");
}

/**
 * 鼠标抬起事件
 */
function resizeBarUp() {
    this.classList.remove("_clicked");

    //显示过渡动画
    let wrapper = document.querySelector(".wrapper")
    wrapper.classList.remove("no-transition");
}

/**
 * 鼠标移动事件
 * @param event 鼠标事件
 */
function resizeBarMove(event) {
    if (this.classList.contains("_clicked")) {
        document.documentElement.style.setProperty(
            "--sidebar-width", `${event.clientX}px`
        );
    }
}

/**
 * 注册所有事件
 */
function registerEvent() {
    /** @type {HTMLElement} */
    let test = document.getElementById("test");
    test.addEventListener("click", switchState);

    document.querySelector(".btn-show-catalogue").addEventListener(
        "click", () => {
            document.querySelector(".sidebar").setAttribute(
                "data-visible", "catalogue");
        }
    );

    document.querySelector(".btn-show-notes").addEventListener(
        "click", () => {
            document.querySelector(".sidebar").setAttribute(
                "data-visible", "notes");
        }
    );

    /** @type {HTMLElement} */
    let resizeBar = document.querySelector(".resize-bar");
    resizeBar.addEventListener("mousedown", resizeBarDown);
    resizeBar.addEventListener("mouseup", resizeBarUp);
    resizeBar.addEventListener("mousemove", resizeBarMove);
}

window.addEventListener("load", registerEvent);