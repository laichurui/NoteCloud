class VScrollbar extends HTMLElement {
    constructor() {
        super();

        if (this.parentElement) {
            this.parentElement.addEventListener("data-completed", () => {
                setTimeout(() => this.init(), 100);
            });
            this.parentElement.addEventListener("scroll", () => {
                this.style.top = `${this.calcTop()}px`;
                this.style.right = `${this.calcRight()}px`;
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
        let top = this.parentElement.scrollTop
            + this.parentElement.scrollTop
            / (this.parentElement.scrollHeight - this.parentElement.clientHeight)
            * (this.parentElement.clientHeight - this.calcHeight());
        return Math.max(0, Math.min(top, this.maxTop));
    }

    calcRight() {
        return Math.max(-this.parentElement.scrollLeft, this.minRight);
    }

    onResize() {
        if (Math.abs(this.parentElement.clientHeight - this.parentElement.scrollHeight) < 1)
            this.classList.add("hide");
        else {
            this.classList.remove("hide");

            this.style.top = `${this.calcTop()}px`;
            this.style.height = `${this.calcHeight()}px`;
            this.maxTop = this.parentElement.scrollHeight - this.calcHeight();
            this.minRight = this.parentElement.clientWidth - this.parentElement.scrollWidth;
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

    minRight = 0;
    maxTop = 0;
    preY;
    offset;
}

class HScrollbar extends HTMLElement {
    constructor() {
        super();

        if (this.parentElement) {
            this.parentElement.addEventListener("data-completed", () => {
                setTimeout(() => this.init(), 100);
            });
            this.parentElement.addEventListener("scroll", () => {
                this.style.left = `${this.calcLeft()}px`;
                this.style.bottom = `${this.calcBottom()}px`;
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
        let left = this.parentElement.scrollLeft
            + this.parentElement.scrollLeft
            / (this.parentElement.scrollWidth - this.parentElement.clientWidth)
            * (this.parentElement.clientWidth - this.calcWidth());
        return Math.max(0, Math.min(left, this.maxLeft));
    }

    calcBottom() {
        return Math.max(-this.parentElement.scrollTop, this.minBottom);
    }

    onResize() {
        this.style.bottom = `${-this.parentElement.scrollTop}px`;

        if (Math.abs(this.parentElement.clientWidth - this.parentElement.scrollWidth) < 1)
            this.classList.add("hide");
        else {
            this.classList.remove("hide");

            this.style.left = `${this.calcLeft()}px`;
            this.style.width = `${this.calcWidth()}px`;
            this.maxLeft = this.parentElement.scrollWidth - this.calcWidth();
            this.minBottom = this.parentElement.clientHeight - this.parentElement.scrollHeight;
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

    minBottom = 0;
    maxLeft = 0;
    preX;
    offset;
}

customElements.define("v-scroll-bar", VScrollbar);
customElements.define("h-scroll-bar", HScrollbar);

const resizeObserver = new ResizeObserver(entries => {
    entries.forEach(entry => {
        let hBar = entry.target.querySelector("h-scroll-bar");
        let vBar = entry.target.querySelector("v-scroll-bar");

        if (hBar) hBar.style.display = "none";
        if (vBar) vBar.style.display = "none";

        if (entry.target.scrollTop > entry.target.scrollHeight - entry.target.clientHeight)
            entry.target.scrollTop = entry.target.scrollHeight - entry.target.clientHeight;
        if (entry.target.scrollLeft > entry.target.scrollWidth - entry.target.clientWidth)
            entry.target.scrollLeft = entry.target.scrollWidth - entry.target.clientWidth;

        if (hBar) hBar.onResize();
        if (vBar) vBar.onResize();

        if (hBar) hBar.style.display = "block";
        if (vBar) vBar.style.display = "block";
    });
});

document.querySelectorAll("*:has(:is(v-scroll-bar, h-scroll-bar))").forEach(
    el => resizeObserver.observe(el));