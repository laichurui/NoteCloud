/**
 * @callback itemClickCallback
 * @param {HTMLSpanElement} this 指向触发事件的标签
 * @param {MouseEvent} event 鼠标事件
 */

/**
 * 导航树
 * @param {HTMLElement} treeRoot 根元素
 * @constructor
 */
function NavTree(treeRoot) {

    /**
     * 仅为了解决命名冲突，没有其他特殊含义
     * @type {NavTree}
     */
    const thisOfNavTree = this;

    /**
     * 根元素
     * @type {HTMLElement}
     */
    this.treeRoot = (function () {
        treeRoot.classList.add("nav-tree");
        return treeRoot;
    }());

    /**
     * 所有导航项目和列表都要在它下面，作为直接或间接子标签
     * @type {HTMLUListElement}
     */
    this.container = (function () {
        /** @type {HTMLUListElement} */
        let ul = document.createElement("ul");
        ul.classList.add("nav-tree-list");
        this.treeRoot.appendChild(ul);
        return ul;
    }.bind(this)());

    /**
     * 替身标签，不要直接使用，
     * 调用 {@link summonAvatar 召唤}、{@link hiddenAvatar 隐藏} 方法来实现对应效果
     * @type {HTMLSpanElement}
     * @see summonAvatar
     * @see hiddenAvatar
     */
    const avatar = (function () {
        let avatar = document.createElement("span");
        avatar.classList.add("avatar");
        this.treeRoot.prepend(avatar);

        return avatar;
    }.bind(this)());

    /**
     * 召唤替身标签，在 `baseElement` 的位置显示替身标签并且内容相同
     *
     * 效果：当 `baseElement` 的内容因父标签宽度不足而隐藏时，替身标签可以代为显示内容
     * @see hiddenAvatar
     */
    function summonAvatar() {
        let p = this.parentElement;
        avatar.style.left = `${p.getBoundingClientRect().left}px`;
        avatar.style.top = `${p.getBoundingClientRect().top}px`;

        avatar.style.color =
            document.defaultView.getComputedStyle(this).color;

        avatar.innerHTML = this.innerHTML;
    }

    /**
     * 隐藏替身标签
     * @see summonAvatar
     */
    function hiddenAvatar() {
        avatar.innerHTML = null;
    }

    /**
     * 项目被点击时进入激活状态，绑定到 click 事件
     */
    function onItemClick() {
        //这里的 this 指向触发事件的元素
        //使用 thisOfNavTree 访问 NavTree 的属性
        if (!this.classList.contains("_activate")) {
            let curActivate = thisOfNavTree.treeRoot.querySelector(".nav-tree-link._activate");
            if (curActivate != null)
                curActivate.classList.remove("_activate");
            this.classList.add("_activate");
        }
    }

    /**
     * 创建展开/关闭标签
     * @param {HTMLElement} parentElement 父标签
     * @return {HTMLDivElement} 创建的 展开/关闭 标签
     */
    function createExpander(parentElement) {
        let expander = document.createElement("div");
        expander.classList.add("nav-tree-item-expander");
        expander.addEventListener("click", () => {
            //切换展开/关闭状态
            if (parentElement.classList.contains("_opened"))
                parentElement.classList.remove("_opened");
            else
                parentElement.classList.add("_opened");
        });
        parentElement.prepend(expander);
        return expander;
    }

    /**
     * 创建导航项目
     * @param {string} displayContent 显示的文本
     * @param {itemClickCallback} clickCallback 标签点击事件
     * @param {HTMLElement} parentElement
     * @return {HTMLLIElement}
     */
    NavTree.prototype.createNavItem = function (displayContent,
                                                clickCallback = null,
                                                parentElement = this.container) {
        /** @type {HTMLLIElement} */
        let item = document.createElement("li");
        item.classList.add("nav-tree-item");
        parentElement.appendChild(item);

        /** @type {HTMLSpanElement} */
        let displayName = document.createElement("span");
        displayName.classList.add("nav-tree-item-content");
        displayName.innerText = displayContent;
        displayName.title = displayName.innerText;

        displayName.addEventListener("mouseenter", summonAvatar);
        displayName.addEventListener("mouseout", hiddenAvatar);
        if (clickCallback != null) {
            displayName.classList.add("nav-tree-link");
            displayName.addEventListener("click", onItemClick);
            displayName.addEventListener("click", clickCallback);
        }
        item.appendChild(displayName);

        return item;
    };

    /**
     * 创建导航列表，可以包含多个导航项目
     * @param {string} displayContent 显示的文本
     * @param {HTMLElement} parentElement 父标签
     * @return {HTMLUListElement} 用于填充导航项目的标签
     */
    NavTree.prototype.createNavList = function (displayContent, parentElement = this.container) {
        /** @type {HTMLLIElement} */
        let item = this.createNavItem(displayContent, null, parentElement);
        item.classList.add("_branch");

        createExpander(item);

        /** @type {HTMLUListElement} */
        let ul = document.createElement("ul");
        ul.classList.add("nav-tree-list");
        item.appendChild(ul);

        return ul;
    };
}

/**
 * 创建笔记导航树
 * @param treeRoot 树根，导航树的父标签
 * @param notes nav.xml中的notes节点
 * @param {itemClickCallback} callback 导航项目被点击时的回调
 */
function createNotesNavTree(treeRoot, notes, callback) {
    const tree = new NavTree(treeRoot);

    // 递归创建树
    (function buildTree(tag, parent) {
        if (tag.tagName === "notes") {
            for (let child of tag.children)
                buildTree(child, parent);

        } else if (tag.tagName === "note") {
            let item = tree.createNavItem(tag.innerHTML, callback, parent);
            item.querySelector(".nav-tree-item-content").setAttribute(
                "data-src", tag.getAttribute("src"));

        } else if (tag.tagName === "note-list") {
            let itemList = tree.createNavList(tag.getAttribute("name"), parent);
            for (let child of tag.children) {
                buildTree(child, itemList);
            }
        }
    }(notes, tree.container));
}
