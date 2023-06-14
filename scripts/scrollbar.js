class VScrollbar extends HTMLDivElement {
    constructor(parentEl = null) {
        super();

        if (this.parentElement) {
            this.parentElement.addEventListener("data-completed", () => {
                setTimeout(() => this.init(), 100);
            });
            this.parentElement.addEventListener("scroll", () => {
                this.style.top = `${this.calcTop()}px`;
                this.style.right = `${-this.parentElement.scrollLeft}px`;
            });
        } else if (parentEl) {
            parentEl.addEventListener("data-completed", () => {
                setTimeout(() => this.init(), 100);
            });
            parentEl.addEventListener("scroll", () => {
                this.style.top = `${this.calcTop()}px`;
                this.style.right = `${-parentEl.scrollLeft}px`;
            });
        }

        this.addEventListener("mousedown", this.onMouseDown);
        window.addEventListener("mousemove", e => this.onWinMouseMove(e));
        window.addEventListener("mouseup", e => this.onWinMouseUp(e));
        window.addEventListener("mouseleave", e => this.onWinMouseLeave(e));
    }

    init() {
        if (!this.parentElement) return;
        this.parentElement.style.position = "relative";
        this.onResize();
    }

    /**
     * 计算滚动条的高度
     * @returns {number} 高度
     */
    calcHeight() {
        let hei = this.parentElement.clientHeight / this.parentElement.scrollHeight * this.parentElement.clientHeight;
        let minHei = parseInt(getComputedStyle(this).minHeight.slice(0, -2));
        return Math.max(hei, minHei);
    }

    /**
     * 计算 top 的位置
     * @returns {number} top值
     */
    calcTop() {
        return this.parentElement.scrollTop
            + this.parentElement.scrollTop
            / (this.parentElement.scrollHeight - this.parentElement.clientHeight)
            * (this.parentElement.clientHeight - this.calcHeight());
    }

    onResize() {
        if (Math.abs(this.parentElement.clientHeight - this.parentElement.scrollHeight) < 1)
            this.classList.add("hide");
        else {
            this.classList.remove("hide");

            this.style.top = `${this.calcTop()}px`;
            this.style.height = `${this.calcHeight()}px`;
        }
    }

    onMouseDown(e) {
        e.preventDefault();
        this.preY = e.clientY;
        this.offset = parseFloat(getComputedStyle(this).top.slice(0, -2)) - this.parentElement.scrollTop;
    }

    onWinMouseMove(e) {
        if (!this.preY) return;

        e.preventDefault();
        this.parentElement.scrollTop =
            (this.offset + e.clientY - this.preY)
            * (this.parentElement.scrollHeight - this.parentElement.clientHeight)
            / (this.parentElement.clientHeight - this.getBoundingClientRect().height);
    }

    onWinMouseUp(e) {
        if (this.preY) {
            this.preY = undefined;
            this.offset = undefined;
        }
    }

    onWinMouseLeave(e) {
        if (this.preY) {
            this.preY = undefined;
            this.offset = undefined;
        }
    }

    preY;
    offset;
}

class HScrollbar extends HTMLDivElement {
    constructor(parentEl = null) {
        super();

        if (this.parentElement) {
            this.parentElement.addEventListener("data-completed", () => {
                setTimeout(() => this.init(), 100);
            });
            this.parentElement.addEventListener("scroll", () => {
                this.style.left = `${this.calcLeft()}px`;
                this.style.bottom = `${-this.parentElement.scrollTop}px`;
            });
        } else if (parentEl) {
            parentEl.addEventListener("data-completed", () => {
                setTimeout(() => this.init(), 100);
            });
            parentEl.addEventListener("scroll", () => {
                this.style.left = `${this.calcLeft()}px`;
                this.style.bottom = `${-parentEl.scrollTop}px`;
            });
        }

        this.addEventListener("mousedown", this.onMouseDown);
        window.addEventListener("mousemove", e => this.onWinMouseMove(e));
        window.addEventListener("mouseup", e => this.onWinMouseUp(e));
        window.addEventListener("mouseleave", e => this.onWinMouseLeave(e));
    }

    init() {
        if (!this.parentElement) return;
        this.parentElement.style.position = "relative";
        this.onResize();
    }

    /**
     * 计算滚动条的宽度
     * @returns {number}
     */
    calcWidth() {
        let wid = this.parentElement.clientWidth / this.parentElement.scrollWidth * this.parentElement.clientWidth;
        let minWid = parseInt(getComputedStyle(this).minWidth.slice(0, -2));
        return Math.max(wid, minWid);
    }

    /**
     * 计算 left 的位置
     * @returns {number} left值
     */
    calcLeft() {
        return this.parentElement.scrollLeft
            + this.parentElement.scrollLeft
            / (this.parentElement.scrollWidth - this.parentElement.clientWidth)
            * (this.parentElement.clientWidth - this.calcWidth());
    }

    onResize() {
        this.style.bottom = `${-this.parentElement.scrollTop}px`;

        if (Math.abs(this.parentElement.clientWidth - this.parentElement.scrollWidth) < 1)
            this.classList.add("hide");
        else {
            this.classList.remove("hide");

            this.style.left = `${this.calcLeft()}px`;
            this.style.width = `${this.calcWidth()}px`;
        }
    }

    onMouseDown(e) {
        e.preventDefault();
        this.preX = e.clientX;
        this.offset = parseFloat(getComputedStyle(this).left.slice(0, -2)) - this.parentElement.scrollLeft;
    }

    onWinMouseMove(e) {
        if (!this.preX) return;

        e.preventDefault();
        this.parentElement.scrollLeft =
            (this.offset + e.clientX - this.preX)
            * (this.parentElement.scrollWidth - this.parentElement.clientWidth)
            / (this.parentElement.clientWidth - this.getBoundingClientRect().width);
    }

    onWinMouseUp(e) {
        if (this.preX) {
            this.preX = undefined;
            this.offset = undefined;
        }
    }

    onWinMouseLeave(e) {
        if (this.preX) {
            this.preX = undefined;
            this.offset = undefined;
        }
    }

    preX;
    offset;
}

customElements.define("v-scroll-bar", VScrollbar, {extends: "div"});
customElements.define("h-scroll-bar", HScrollbar, {extends: "div"});

const resizeObserver = new ResizeObserver(entries => {
    entries.forEach(entry => {
        let hBar = entry.target.querySelector("div[is=h-scroll-bar]");
        let vBar = entry.target.querySelector("div[is=v-scroll-bar]");

        if (hBar) hBar.style.display = "none";
        if (vBar) vBar.style.display = "none";

        if (hBar) hBar.onResize();
        if (vBar) vBar.onResize();

        if (hBar) hBar.style.display = "block";
        if (vBar) vBar.style.display = "block";
    });
});

document.querySelectorAll("*:has(>div[is$=scroll-bar])").forEach(
    el => resizeObserver.observe(el));