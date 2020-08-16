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