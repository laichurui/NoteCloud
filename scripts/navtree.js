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
        treeRoot.addEventListener("scroll", hiddenAvatar, false);
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
        this.container.prepend(avatar);

        return avatar;
    }.bind(this)());

    /**
     * 召唤替身标签，在 `baseElement` 的位置显示替身标签并且内容相同
     *
     * 效果：当 `baseElement` 的内容因父标签宽度不足而隐藏时，替身标签可以代为显示内容
     * @see hiddenAvatar
     */
    function summonAvatar() {
        avatar.style.left = `${this.getBoundingClientRect().left}px`;
        avatar.style.top = `${this.parentElement.getBoundingClientRect().top}px`;
        avatar.style.color = document.defaultView.getComputedStyle(this).color;
        avatar.innerHTML = this.innerHTML;
    }

    /**
     * 隐藏替身标签
     * @see summonAvatar
     */
    function hiddenAvatar() {
        if (avatar.innerHTML)
            avatar.innerHTML = null;
    }

    /**
     * 项目被点击时进入激活状态，高亮显示
     */
    function onItemClick() {
        //这里的 this 指向触发事件的元素
        //使用 thisOfNavTree 访问 NavTree 的属性
        if (!this.classList.contains("_activate")) {
            let curActivate = thisOfNavTree.container.querySelector(".nav-tree-link._activate");
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
        expander.classList.add("fa");
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
        displayName.addEventListener("mouseleave", hiddenAvatar);
        if (clickCallback != null) {
            displayName.classList.add("nav-tree-link");
            displayName.addEventListener("data-click", onItemClick);
            displayName.addEventListener("click", clickCallback);
        }
        item.appendChild(displayName);

        return item;
    };

    /**
     * 创建导航列表，可以包含多个导航项目
     * @param {string} displayContent 显示的文本
     * @param {itemClickCallback} clickCallback 标签点击事件
     * @param {HTMLElement} parentElement 父标签
     * @return {HTMLUListElement} 用于填充导航项目的标签
     */
    NavTree.prototype.createNavList = function (displayContent,
                                                clickCallback = null,
                                                parentElement = this.container) {
        /** @type {HTMLLIElement} */
        let item = this.createNavItem(displayContent, clickCallback, parentElement);
        item.classList.add("_branch");
        item.classList.add("_opened"); // 默认打开

        createExpander(item);

        /** @type {HTMLUListElement} */
        let ul = document.createElement("ul");
        ul.classList.add("nav-tree-list");
        item.appendChild(ul);

        return ul;
    };
}

/**
 * 创建笔记导航树，添加到 treeRoot 子标签中
 * @param treeRoot 树根，导航树的父标签
 * @param {Object} notesJson nav.xml中的notes节点
 * @param {itemClickCallback} callback 导航项目被点击时的回调
 */
function createNotesNavTree(treeRoot, notesJson, callback) {
    const tree = new NavTree(treeRoot);

    // 递归创建树
    (function buildTree(tag, parent) {
        if (Array.isArray(tag)) {
            for (let child of tag)
                buildTree(child, parent);

        } else if (typeof tag === "string") {
            var fileName = tag.replace(/^.*[\\\/]/, '');
            let item = tree.createNavItem(fileName, callback, parent);
            item.querySelector(".nav-tree-item-content").setAttribute(
                "data-src", tag);

        } else {
            let dirName = Object.keys(tag)[0];
            let itemList = tree.createNavList(
                dirName,
                null,
                parent);
            for (let child of tag[dirName])
                buildTree(child, itemList);
        }
    }(notesJson[0]["笔记"], tree.container));
}

/**
 * 生成目录树，并添加到 root 标签下
 * @param {HTMLElement} root 目录树的父标签
 * @param {HTMLElement} article 需要生成目录的文章标签
 * @param {boolean} option 可选项，true:清空 root 原有的内容再添加目录树，false:不清除原有内容
 */
function createCatalogue(root, article, option = false) {
    if (option)
        root.innerHTML = null;

    /** @type {NavTree} */
    const tree = new NavTree(root);

    /** @type {NodeList} */
    let headers = article.querySelectorAll(
        "h1:not([class~=notitle]),h2:not([class~=notitle]),h3:not([class~=notitle]),h4:not([class~=notitle]),h5:not([class~=notitle]),h6:not([class~=notitle])");

    // 获取第 i 个标题的等级
    function getLevel(i) {
        return parseInt(headers[i].nodeName[1]);
    }

    // 判断第 i 个标题是否具有下级标题
    function hasSubtitle(i) {
        return headers[i + 1] != null &&
            getLevel(i + 1) > getLevel(i);
    }

    // 获取第 i 个标题的父元素
    function getParentElement(i) {
        // 找到上一个级别的标题
        for (let p = i - 1; p >= 0; p--) {
            if (getLevel(p) < getLevel(i))
                return headers[p].myRef;
        }
        return tree.container;
    }

    // 处理点击事件
    function onClickHandle(position) {
        /** @type{HTMLElement} */
        let preview = document.querySelector(".preview");
        /** @type{HTMLElement} */
        let anchor = document.querySelector(`#${position.replaceAll(".", "\\.")}`);
        preview.scrollTo({top: anchor.offsetTop - 20, behavior: "smooth"});
        // 修改显示的网址但是不执行跳转
        let url = window.location.href;
        url = url.substring(0, url.lastIndexOf("#"));
        window.history.pushState({}, 0, `${url}#${position}`);
    }

    /**
     * 章节排序值
     * @type {number[]}
     */
    let chIndex = [0];
    for (let i = 0; i < getLevel(0); i++)
        chIndex[i] = 0; //添加元素

    for (let i = 0; i < headers.length; i++) {
        if (i > 0) {
            let j = getLevel(i - 1) - getLevel(i);
            if (j > 0)
                chIndex.splice(-j, j);
        }
        chIndex[chIndex.length - 1]++;
        let id = `ch${chIndex.join(".")}`;
        headers[i].setAttribute("id", id);

        if (hasSubtitle(i)) {
            // 目录树中添加标题的索引
            headers[i].myRef = tree.createNavList(
                headers[i].textContent,
                function () {
                    onClickHandle(id)
                },
                getParentElement(i));

            for (let j = 0; j < (getLevel(i + 1) - getLevel(i)); j++)
                chIndex[chIndex.length] = 0; //添加元素
        } else {
            headers[i].myRef = tree.createNavItem(
                headers[i].textContent,
                function () {
                    onClickHandle(id)
                },
                getParentElement(i));
        }
    }
}