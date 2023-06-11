document.querySelectorAll(".sidebar .sortable-list .item").forEach(item => {
    item.addEventListener("click", () => {
        let activeItem = item.parentElement.querySelector(".item.selected");
        if (activeItem && activeItem !== item)
            activeItem.classList.remove("selected");
        item.classList.toggle("selected");

        // 更新目录中的高亮节点
        if (item.matches(".selected[data-ref=catalogue-panel]")) {
            document.querySelector(".preview").dispatchEvent(new CustomEvent("scroll"));
        }
    });
    item.addEventListener("movetonewlist", e => {
        if (item.matches(".selected")) {
            let i = e.detail.querySelector(".item.selected");
            if (i) i.classList.remove("selected");
        }
        e.detail.parentElement.appendChild(document.getElementById(item.dataset.ref));
    });
});

document.querySelectorAll(".sidebar .resize-bar").forEach(resizeBar => {
    // 拖拽调整侧边栏大小

    resizeBar.addEventListener("mousedown", function (event) {
        event.preventDefault();
        this.classList.add("_clicked");
    });
    resizeBar.addEventListener("mouseup", function (event) {
        event.preventDefault();
        this.classList.remove("_clicked");
    });
    resizeBar.addEventListener("mousemove", function (event) {
        event.preventDefault();
        if (this.classList.contains("_clicked")) {
            if (this.parentElement.matches(".left")) {
                let slw = parseInt(
                    getComputedStyle(document.documentElement)
                        .getPropertyValue("--sortable-list-width")
                        .slice(0, -2));
                let rpw = parseInt(
                    getComputedStyle(document.documentElement)
                        .getPropertyValue("--right-panel-width")
                        .slice(0, -2));
                let max = document.body.clientWidth - slw - rpw;
                if (event.clientX < max)
                    document.documentElement.style.setProperty(
                        "--left-panel-width",
                        `${event.clientX - slw}px`);
            } else {
                let slw = parseInt(
                    getComputedStyle(document.documentElement)
                        .getPropertyValue("--sortable-list-width")
                        .slice(0, -2));
                let lpw = parseInt(
                    getComputedStyle(document.documentElement)
                        .getPropertyValue("--left-panel-width")
                        .slice(0, -2));
                let min = slw + lpw;
                if (event.clientX > min)
                    document.documentElement.style.setProperty(
                        "--right-panel-width",
                        `${document.body.clientWidth - event.clientX - slw}px`);
            }
        }
    });
});

function onResize() {
    if (window.innerWidth < 769) {
        let lBar = document.querySelector(".sidebar.left");
        let rBar = document.querySelector(".sidebar.right");
        rBar.querySelectorAll(".sortable-list .item").forEach(item => {
            lBar.querySelector(".sortable-list").appendChild(item);
            lBar.appendChild(document.getElementById(item.dataset.ref));
        });
        lBar.querySelectorAll(".sortable-list .item.selected").forEach(item => {
            item.classList.remove("selected");
        });
    }
}

window.addEventListener("resize", onResize);
onResize();