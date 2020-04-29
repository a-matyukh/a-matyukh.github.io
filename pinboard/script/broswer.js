var browser = document.getElementById("browser");
var btnTop = document.getElementById("btnTop");

// Top Button

browser.onscroll = detectScroll;

function detectScroll() {
    if (browser.scrollTop > 200) {
        btnTop.style.display = "block";
    } else {
        btnTop.style.display = "none";
    }
}

function scrollToTop() {
    browser.scrollTop = 0;
}

// Tabs

document.getElementById("defaultOpen").click();

function openTab(evt, tabName) {

    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Add to board by drag

board.addEventListener("dragover", function(event) {
    dragOver(event);
});

board.addEventListener("drop", function(event) {
    if (window.getSelection().rangeCount >= 1) return;
    dropPin(event);
});


function removeQstart() {
    if (board.children.length != 0 && board.children[0].id == "qstart") {
        document.getElementById("qstart").remove();
    }
}

function dragStart(event) {
    if (event.target.id != "board") {
        event.dataTransfer.setData("text", event.target.id);
        board.className = "here ready";    
    }
}

function dragEnd() {
    board.className = "";
}

function dragOver(event) {
    event.preventDefault();
}

function dropPin(event) {
    
    event.preventDefault();
    removeQstart();
    board.className = "";

    var x = event.clientX - 70;
    var y = event.clientY - 90;
    var data = event.dataTransfer.getData("text");

    var original = document.getElementById(data);

    if (original.tagName == "IMG") {
        var copyimg = document.createElement("img"); 
        copyimg.src = original.src; 
        copyimg.width = original.width; 
        copyimg.height = original.height;
    } else if (original.tagName == "P" && original.classList.contains("pinText")) {
        var copyimg = document.createElement("p"); 
        copyimg.innerText = original.innerText;
    }
    copyimg.classList.add("pin");
    copyimg.id = checkId(original.id);

    board.appendChild(copyimg);    

    copyimg.setAttribute("style", "position: absolute; top: "+ y +"px; left:"+x+"px; opacity: 1; rotate(0deg); font-size:" + getComputedStyle(original).fontSize);
    copyimg.dataset.rotate = "0";
    copyimg.dataset.opacity = "1";
    copyimg.dataset.scaleX = "1";
    copyimg.dataset.scaleY = "1";

    var t = document.createElement("div");
    t.className = "dropdown thumb";
    thumbs.insertBefore(t, thumbs.firstChild);

    if (original.tagName == "IMG") {
        t.innerHTML = "<img class='thumb' id='" + copyimg.id + "' src='" + copyimg.src + "' /><div class='dropthumb-content'><button onclick='thumbs.delete(event)'>×</button></div>";
    } else if (original.tagName == "P") {
        let string = copyimg.innerText;
        let txtThumb;
        if (string.length > 3) {
            txtThumb = string[0] + string[1] + string[2] + "...";
        } else if (string.length == 3) {
            txtThumb = string[0] + string[1] + string[2];
        } else if (string.length == 2) {
            txtThumb = string[0] + string[1];
        } else if (string.length == 1) {
            txtThumb = string[0];
        } else if (string.length == 0) {
            txtThumb = "Текст";
        }
        t.innerHTML = "<p class='thumb' id='" + copyimg.id + "' src='" + copyimg.src + "' contenteditable='false'>" + txtThumb + "</p><div class='dropthumb-content'><button onclick='thumbs.delete(event)'>×</button></div>";
    }
}

// Add to board by click
browser.addEventListener("click", function(event) {

    if (event.target.tagName == "IMG" || event.target.tagName == "P") {
        removeQstart();
        var original = event.target;
        if (event.target.tagName == "IMG") {
            var copyimg = document.createElement("img");
            copyimg.classList.add("pin");
            copyimg.id = checkId(original.id);
            copyimg.src = original.src;
            copyimg.width = original.width;
            copyimg.height = original.height;
            board.appendChild(copyimg);
            copyimg.setAttribute("style", "position: absolute; top: 10px; left: 10px; opacity: 1; rotate(0deg)");
            copyimg.dataset.rotate = "0";
            copyimg.dataset.opacity = "1";
            copyimg.dataset.scaleX = "1";
            copyimg.dataset.scaleY = "1";

            var t = document.createElement("div");
            t.className = "dropdown thumb";
            thumbs.insertBefore(t, thumbs.firstChild);
            t.innerHTML = "<img class='thumb' id='" + copyimg.id + "' src='" + copyimg.src + "' /><div class='dropthumb-content'><button onclick='thumbs.delete(event)'>×</button></div>";
        } else if (event.target.tagName == "P" && event.target.classList.contains("pinText")) {
            var copyimg = document.createElement("p");
            copyimg.classList.add("pin");
            copyimg.id = checkId(original.id);

            copyimg.innerText = original.innerText;

            board.appendChild(copyimg);
            copyimg.setAttribute("style", "position: absolute; top: 10px; left: 10px; opacity: 1; rotate(0deg); font-size:" + getComputedStyle(original).fontSize);
            copyimg.dataset.rotate = "0";
            copyimg.dataset.opacity = "1";
            copyimg.dataset.scaleX = "1";
            copyimg.dataset.scaleY = "1";
            copyimg.draggable = false;

            var t = document.createElement("div");
            t.className = "dropdown thumb";
            thumbs.insertBefore(t, thumbs.firstChild);

            let string = copyimg.innerText;
            let txtThumb;
            if (string.length > 3) {
                txtThumb = string[0] + string[1] + string[2] + "...";
            } else if (string.length == 3) {
                txtThumb = string[0] + string[1] + string[2];
            } else if (string.length == 2) {
                txtThumb = string[0] + string[1];
            } else if (string.length == 1) {
                txtThumb = string[0];
            } else if (string.length == 0) {
                txtThumb = "Текст";
            }

            t.innerHTML = "<p class='thumb' id='" + copyimg.id + "' src='" + copyimg.src + "' contenteditable='false'>" + txtThumb + "</p><div class='dropthumb-content'><button onclick='thumbs.delete(event)'>×</button></div>";
        }
    }

});