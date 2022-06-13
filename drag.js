let drag;
let drop;
setDrag = () => {
    /* events fired on the draggable target */
    document.addEventListener("drag", function(event) {
    }, false);
    document.addEventListener("dragstart", function(event) {
        // store a ref. on the dragged elem
        drag = event.target;
        drag.style.opacity = 0;
    }, false);
    document.addEventListener("dragend", function(event) {
        drag.style.opacity = 1;
    }, false);
}

setDrop = () => {
    document.addEventListener("dragover", function(event) {
        event.preventDefault();
    }, false);
    document.addEventListener("drop", function(event) {
        drop = event.target
        // prevent default action (open as link for some elements)
        event.preventDefault();
        // move dragged elem to the selected drop target
        if (drop.classList[0] == "drop") {
            if (drop.getAttribute("data-num") === drag.getAttribute("data-num")) {
                // locate drag on drop
                drag.parentNode.removeChild(drag);
                drop.appendChild(drag);
                // style
                onDrop(drag, drop);
            }
        }
    }, false);
}