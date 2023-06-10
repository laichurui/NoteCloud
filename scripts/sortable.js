Number.prototype.mod = function (n) {
    return ((this % n) + n) % n;
}
const removeAnimation = classList => {
    classList.remove("move-up", "move-down", "insert-up", "insert-down");
}

const sortableLists = document.querySelectorAll(".sortable-list");
let dragCounter = 0;
sortableLists.forEach(sortableList => {

    sortableList.querySelectorAll(".item").forEach(item => {
        item.addEventListener("dragstart", () => {
            // Adding dragging class to item after a delay
            setTimeout(() => item.classList.add("dragging"), 0);
        });
        // Removing dragging class from item on dragend event
        item.addEventListener("dragend", () => {
            item.classList.remove("dragging", "out");
        });
        item.addEventListener("animationend", () => removeAnimation(item.classList));
    });

    const moveWithAnimation = (draggingItem, nextSibling, items) => {
        let draggingIndex = items.indexOf(draggingItem).mod(sortableList.childElementCount + 1);
        let siblingIndex = items.indexOf(nextSibling).mod(sortableList.childElementCount + 1);
        let moveDirection = siblingIndex < draggingIndex;
        let start, end;
        if (moveDirection) {  // 向下移动
            start = siblingIndex;
            end = draggingIndex;
        } else {
            start = draggingIndex + 1;
            end = siblingIndex;
        }

        for (let i = start; i < end; ++i) {
            removeAnimation(items[i].classList);
            items[i].classList.add(moveDirection ? "move-down" : "move-up");
        }

        removeAnimation(draggingItem.classList);
        draggingItem.classList.add(moveDirection ? "insert-up" : "insert-down");
        sortableList.insertBefore(draggingItem, nextSibling);

        draggingItem.classList.remove("out");
    };

    /**
     * 把拖拽的项插入到对应位置
     * @param {DragEvent} e
     */
    const onDragOver = (e) => {
        e.preventDefault();
        const draggingItem = document.querySelector(".dragging");
        // Getting all items and making array of them
        let items = [...sortableList.querySelectorAll(".item")];

        // Finding the sibling after which the dragging item should be placed
        let nextSibling = items.find(sibling => {
            return sibling.matches(".item:not(.dragging)")
                && e.pageY <= sibling.offsetTop + sibling.offsetHeight / 2;
        }) || null;

        // Inserting the dragging item before the found sibling
        if (nextSibling !== draggingItem.nextElementSibling
            || draggingItem.matches(".out")) {
            // 拖拽到另一个列表中
            if (draggingItem.parentElement !== sortableList) {
                draggingItem.dispatchEvent(new CustomEvent("movetonewlist", {"detail": sortableList}));
            }
            moveWithAnimation(draggingItem, nextSibling, items);
        }
    }

    sortableList.addEventListener("dragover", onDragOver);

    sortableList.addEventListener("dragstart", () => dragCounter = 0);
    sortableList.addEventListener("dragenter", e => {
        e.preventDefault();
        ++dragCounter;
    });
    sortableList.addEventListener("dragleave", () => {
        --dragCounter;
        if (dragCounter === 0) {
            let d = document.querySelector(".dragging");
            moveWithAnimation(d, null, [...sortableList.querySelectorAll(".item")]);
            d.classList.add("out");
        }
    });

});