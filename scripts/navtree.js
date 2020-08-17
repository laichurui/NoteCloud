/**
 * 导航树
 * @param {HTMLElement} treeRoot 根元素
 * @constructor
 */
function NavTree() {


    function NavTreeObj(treeRoot) {

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
        }.bind(this)())

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
         * @param {HTMLElement} baseElement 替身标签的爸爸
         * @see hiddenAvatar
         */
        function summonAvatar(baseElement) {
            avatar.style.left = `${baseElement.getBoundingClientRect().left}px`;
            avatar.style.top = `${baseElement.getBoundingClientRect().top}px`;

            avatar.style.color =
                document.defaultView.getComputedStyle(baseElement).color;

            avatar.innerHTML = baseElement.innerHTML;
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
         * @callback itemClickCallBack
         * @param {HTMLSpanElement} this
         * @param {MouseEvent} event
         */

        /**
         * 创建导航项目
         * @param {string} displayContent 显示的文本
         * @param {itemClickCallBack} clickCallback 标签点击事件
         * @param {HTMLElement} parentElement
         * @return {HTMLLIElement}
         */
        this.createNavItem = function (displayContent,
                                       clickCallback = null,
                                       parentElement = this.container) {
            /** @type {HTMLLIElement} */
            let item = document.createElement("li");
            item.classList.add("nav-tree-item");
            parentElement.appendChild(item);

            /** @type {HTMLSpanElement} */
            let displayName = document.createElement("span");
            displayName.innerText = displayContent;
            displayName.title = displayName.innerText;

            displayName.addEventListener("mouseenter", summonAvatar);
            displayName.addEventListener("mouseout", hiddenAvatar);
            if (clickCallback != null) {
                displayName.classList.add("nav-tree-link");
                displayName.addEventListener("click", onItemClick);
                displayName.addEventListener("click", clickCallback);
            }

            displayName.classList.add("nav-tree-link");
            displayName.setAttribute("data-src", n.getAttribute("src"));

            item.appendChild(displayName);

            return item;
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
         * 创建导航列表，由多个导航项目组成
         * @param {string} displayContent 显示的文本
         * @param {HTMLElement} parentElement 父标签
         * @return {HTMLUListElement} 用于填充导航项目的标签
         */
        this.createNavList = function (displayContent, parentElement = this.container) {
            /** @type {HTMLLIElement} */
            let item = this.createNavItem(displayContent, null, parentElement);
            item.classList.add("_branch");

            createExpander(item);

            /** @type {HTMLUListElement} */
            let ul = document.createElement("ul");
            ul.classList.add("nav-tree-list");
            item.appendChild(ul);

            return ul;
        }
    }

    return NavTreeObj;
}

/**
 * 把 notes 内容转化为 html 标签填入 fillTarget 中，注意：fillTarget原有的子标签不会被清除
 * @see loadXmlToNavTree
 */
function NavTreeForNotes(treeRoot) {
    NavTree.call(this, treeRoot);

    this.url = "nav.xml";

    function buildTree(tag, parent = this.container) {
        if (tag.tagName === "notes") {
            for (let child of tag.children)
                buildTree(child, parent);

        } else if (tag.tagName === "note") {
            let item = this.createNavItem(
                tag.innerHTML,
                function () {
                    loadMdFileToElement(this.getAttribute("data-src"),
                        document.querySelector(".preview"));
                },
                parent
            );
            item.querySelector(">span").setAttribute(
                "data-src", tag.getAttribute("src"));

        } else if (tag.tagName === "note-list") {
            alert(this.createNavList);
            let itemList = this.createNavList(tag.getAttribute("name"), parent);
            for (let child of tag.children) {
                buildTree(child, itemList);
            }
        }
    }

    loadFile(this.url, req => buildTree(req.responseXML.documentElement));
}
