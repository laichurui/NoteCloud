// 页面加载后注册标签事件
window.addEventListener("load", function () {

    // 打开或关闭侧边栏
    document.getElementById("btn_switch_wrapper_state").addEventListener("click", () => {
        let wrapper = document.querySelector(".wrapper");
        let state = wrapper.getAttribute("data-state");
        wrapper.setAttribute(
            "data-state",
            state == null || state === "default" ? "fit" : "default"
        );
    });

    // 设置目录/笔记导航是否显示
    function changeVisible() {
        document.querySelector(".sidebar").setAttribute(
            "data-visible",
            this.getAttribute("data-arg"));
    }
    // 侧边栏显示目录
    let c = document.querySelector(".btn-show-catalogue");
    c.addEventListener("click", changeVisible);
    c.addEventListener("mouseover", changeVisible);
    // 侧边栏显示笔记导航
    c=document.querySelector(".btn-show-notes");
    c.addEventListener("click", changeVisible);
    c.addEventListener("mouseover", changeVisible);

    // 拖拽调整侧边栏大小
    /** @type {HTMLElement} */
    let resizeBar = document.querySelector(".resize-bar");
    resizeBar.addEventListener("mousedown", function () {
        this.classList.add("_clicked");
        //取消过渡动画
        document.querySelector(".wrapper").classList.add("no-transition");
    });
    resizeBar.addEventListener("mouseup", function () {
        this.classList.remove("_clicked");
        //显示过渡动画
        document.querySelector(".wrapper").classList.remove("no-transition");
    });
    resizeBar.addEventListener("mousemove", function (event) {
        if (this.classList.contains("_clicked")) {
            document.documentElement.style.setProperty(
                "--sidebar-width", `${event.clientX}px`
            );
        }
    });

});