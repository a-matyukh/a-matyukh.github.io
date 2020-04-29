// ---------------- Common ----------------

window.onload = () => {
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        notification.show("Извините, редактор коллажей адаптирован для работы на ноутбуках и десктопных компьютерах");
    }
}

// Snackbar
var snackbar = document.getElementById("snackbar");
snackbar.show = function(message) {
    if (snackbar.className == "show") {
        return;
    } else {
        snackbar.innerHTML = message;
        snackbar.classList.toggle("show");
        setTimeout(function(){ snackbar.classList.toggle("show"); }, 3000);    
    }
}

// Notification
var notification = document.getElementById("notification");
notification.show = function(message) {
    notification.innerHTML = message;
    notification.classList.toggle("show");
}

var editor = document.getElementById("editor");
editor.hide = function(id) {
    if (id.style.display == "" || id.style.display == "block") {
        id.style.display = "none";
        event.target.style.color = "red";
        (id == thumbs) ? event.target.innerHTML = "Show layers" : event.target.innerHTML = "Show navigator";
    } else {
        id.style.display = "block";
        event.target.style.color = "";
        (id == thumbs) ? event.target.innerHTML = "Hide layers" : event.target.innerHTML = "Hide navigator";
    }
}

var help = document.getElementById("help");

editor.toggleHelp = () => {
    if (help.style.display == "none" || help.style.display == "") {
        help.style.display = "block";
        event.target.innerHTML = "Hide help";
        event.target.style.color = "red";

        help.dataset.content = "↘";

        help.onscroll = detectPolosa;
        function detectPolosa() {
            if (help.scrollTop > 0) {
                help.dataset.content = "";
            } else {
                help.dataset.content = "↘";
            }
        }            

        dragPanel(document.getElementById("help"));
      

    } else {
        help.style.display = "none";
        event.target.innerHTML = "Help";
        event.target.style.color = "";
    }
};

function dragPanel(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }
    
    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
    
    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// ---------------- Editor ----------------

var preview = document.getElementById("preview");

preview.addEventListener("wheel", function(event) {
    event.preventDefault();
    var value;
    if (navigator.userAgent.match("Firefox") == null) {
        value = event.deltaY/5000;
    } else {
        value = event.deltaY/100;
    }
    if (canvas.dataset.scale < "0.1") {canvas.dataset.scale = 0.11;}
    if (canvas.dataset.scale > "5.0") {canvas.dataset.scale = 5.0;}
    canvas.dataset.scale = parseFloat(canvas.dataset.scale) - value;
    canvas.update();
});

preview.addEventListener("mouseover", previewCursor);
function previewCursor(event) {
    if (event.target.id == "board" || event.target.id == "preview" || event.target.id == "canvas") {
        preview.style.cursor = "url('./style/cursors/grab.png'), auto";
    } else {
        preview.style.cursor = "inherit";
    }
}

preview.addEventListener("mousedown", canvasMove);
function canvasMove(event) {
    if (event.target.id == "canvas" || event.target.id == "board" || event.target.id == "preview") {
        event.preventDefault();
        document.onmousemove = elementDrag;
        document.onmouseup = closeDragElement;
		preview.style.cursor = "url('./style/cursors/drag.png'), auto";
        function elementDrag(event) {
            canvas.dataset.translateY = parseFloat(canvas.dataset.translateY) + event.movementY;
            canvas.dataset.translateX = parseFloat(canvas.dataset.translateX) + event.movementX;
            canvas.update();
        }
        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
			preview.style.cursor = "url('./style/cursors/grab.png'), auto";
        }
    }
}

// Canvas
var canvas = document.getElementById("canvas");
var canvasbar = document.getElementById("canvasbar");

dragPanel(document.getElementById("canvasbar"));

canvas.update = () => {
    canvas.style.transform = `translate(${canvas.dataset.translateX}px, ${canvas.dataset.translateY}px) scale(${canvas.dataset.scale})`;
}

canvas.scale = function(rate) {
    var value;
    switch (rate) {
        case "up": if (canvas.dataset.scale == "5.0") {value = 2; break;} else {value = parseFloat(canvas.dataset.scale) + 0.03; break;}
        case "down": if (canvas.dataset.scale == "0.1") {value = 0.1; break;} else {value = parseFloat(canvas.dataset.scale) - 0.03; break;}
        case "reset": value = 1; canvas.dataset.translateX = 0; canvas.dataset.translateY = 0;
    }
    canvas.dataset.scale = value.toFixed(2);
    canvas.update();
}

canvas.text = () => {
    removeQstart();
    var copyimg = document.createElement("p"); 
    copyimg.innerText = "Введите текст";
    copyimg.classList.add("pin");
    copyimg.id = checkId("pin12345");
    board.appendChild(copyimg);    

    copyimg.setAttribute("style", "position: absolute; top: 10px; left: 10px; opacity: 1; rotate(0deg)");
    copyimg.dataset.rotate = "0";
    copyimg.dataset.opacity = "1";
    copyimg.dataset.scaleX = "1";
    copyimg.dataset.scaleY = "1";

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

// Board
var board = document.getElementById("board");

board.addEventListener("mousemove", hoverPin);
function hoverPin(event) {
    if (event.target.className == "pin") {
        pins[event.target.id].classList.add("hovered");
        thumbList[event.target.id].style.boxShadow = "0px 0px 50px rgba(0, 0, 0, 0.5)";
        event.target.addEventListener("mouseleave", function(event) {
            pins[event.target.id].classList.remove("hovered");
            thumbList[event.target.id].style.boxShadow = "";
        });
    }
}

board.addEventListener("mousedown", function(event) {
    if (event.target.classList.contains("pin") && pinsActive.length == 0) {
        board.activate(event);
    }
    else if (event.target.classList.contains("pin") && pinsActive.length == 1 && window.getSelection().rangeCount == 0) {
        board.deactivate(event);
        board.activate(event);
    }
    else if (event.target.id == "pinModBox") {
        dragMouseDown(event);
    }
    else if (event.target.id == "board") {
        board.deactivate(event);
    }
});


board.activate = function(event) {

    pins[event.target.id].classList.toggle("active");
    pinbar.style.display = "flex";
    dragPanel(document.getElementById("pinbar"));
    thumbList[event.target.id].classList.toggle("active");
    
    // Opacity
    pinsActive[0].style.opacity = getComputedStyle(pinsActive[0]).opacity;
    var pinOpacity = document.getElementById("pinOpacity");
    pinOpacity.value = pinsActive[0].style.opacity * 100;

    textOptions.style.display = "none";
    if (pinsActive[0].tagName == "P") {
        
        
        // Family
        var textOptionsFamily = document.getElementById("textOptionsFamily");
        pinsActive[0].style.fontFamily = getComputedStyle(pinsActive[0]).fontFamily;
        if (pinsActive[0].style.fontFamily == "Arial" || pinsActive[0].style.fontFamily == '"Arial"' || pinsActive[0].style.fontFamily == "") {
            textOptionsFamily.selectedIndex = 0;
        } else if (pinsActive[0].style.fontFamily == "Tahoma" || pinsActive[0].style.fontFamily == '"Tahoma"') {
            textOptionsFamily.selectedIndex = 1;
        } else if (pinsActive[0].style.fontFamily == "Times New Roman" || pinsActive[0].style.fontFamily == '"Times New Roman"') {
            textOptionsFamily.selectedIndex = 2;
        } else if (pinsActive[0].style.fontFamily == "Playfair Display" || pinsActive[0].style.fontFamily == '"Playfair Display"') {
            textOptionsFamily.selectedIndex = 3;
        } else if (pinsActive[0].style.fontFamily == "Roboto" || pinsActive[0].style.fontFamily == '"Roboto"') {
            textOptionsFamily.selectedIndex = 4;
        } else if (pinsActive[0].style.fontFamily == "Old Standard TT" || pinsActive[0].style.fontFamily == '"Old Standard TT"') {
            textOptionsFamily.selectedIndex = 5;
        } else if (pinsActive[0].style.fontFamily == "Merriweather" || pinsActive[0].style.fontFamily == '"Merriweather"') {
            textOptionsFamily.selectedIndex = 6;
        } else if (pinsActive[0].style.fontFamily == "Cormorant Garamond" || pinsActive[0].style.fontFamily == '"Cormorant Garamond"') {
            textOptionsFamily.selectedIndex = 7;
        } else if (pinsActive[0].style.fontFamily == "Lobster" || pinsActive[0].style.fontFamily == '"Lobster"') {
            textOptionsFamily.selectedIndex = 8;
        } else if (pinsActive[0].style.fontFamily == "Fira Sans" || pinsActive[0].style.fontFamily == '"Fira Sans"') {
            textOptionsFamily.selectedIndex = 9;
        }

        textOptionsFamily.oninput = () => {
            if (textOptionsFamily.value == "arial") {
                pinsActive[0].style.fontFamily = "Arial";
            } else if (textOptionsFamily.value == "tahoma") {
                pinsActive[0].style.fontFamily = "Tahoma";
            } else if (textOptionsFamily.value == "roman") {
                pinsActive[0].style.fontFamily = "Times New Roman";
            } else if (textOptionsFamily.value == "playfair") {
                pinsActive[0].style.fontFamily = "Playfair Display";
            } else if (textOptionsFamily.value == "roboto") {
                pinsActive[0].style.fontFamily = "Roboto";
            } else if (textOptionsFamily.value == "oldstandart") {
                pinsActive[0].style.fontFamily = "Old Standard TT";
            } else if (textOptionsFamily.value == "merriweather") {
                pinsActive[0].style.fontFamily = "Merriweather";
            } else if (textOptionsFamily.value == "garamond") {
                pinsActive[0].style.fontFamily = "Cormorant Garamond";
            } else if (textOptionsFamily.value == "lobster") {
                pinsActive[0].style.fontFamily = "Lobster";
            } else if (textOptionsFamily.value == "fira") {
                pinsActive[0].style.fontFamily = "Fira Sans";
            }
            thumbs.updateText();
        }

        // Bold
        var textOptionsBold = document.getElementById("textOptionsBold");
        if (pinsActive[0].style.fontWeight == "bold") {
            textOptionsBold.checked = true;
        } else {
            textOptionsBold.checked = false;
        }
        textOptionsBold.onchange = () => {
            if (textOptionsBold.checked == true) {
                pinsActive[0].style.fontWeight = "bold";
            } else {
                pinsActive[0].style.fontWeight = "normal";
            }
            thumbs.updateText();
        }

        // Italic
        var textOptionsItalic = document.getElementById("textOptionsItalic");
        if (pinsActive[0].style.fontStyle == "italic") {
            textOptionsItalic.checked = true;
        } else {
            textOptionsItalic.checked = false;
        }
        textOptionsItalic.onchange = () => {
            if (textOptionsItalic.checked == true) {
                pinsActive[0].style.fontStyle = "italic";
            } else {
                pinsActive[0].style.fontStyle = "normal";
            }
            thumbs.updateText();
        }

        // Underline
        var textOptionsUnderline = document.getElementById("textOptionsUnderline");
        if (pinsActive[0].style.textDecorationLine == "underline") {
            textOptionsUnderline.checked = true;
        } else {
            textOptionsUnderline.checked = false;
        }
        textOptionsUnderline.onchange = () => {
            if (textOptionsUnderline.checked == true) {
                pinsActive[0].style.textDecorationLine = "underline";
            } else {
                pinsActive[0].style.textDecorationLine = "none";
            }
            thumbs.updateText();
        }

        // Size
        var textOptionsSize = document.getElementById("textOptionsSize");
        pinsActive[0].style.fontSize = getComputedStyle(pinsActive[0]).fontSize;
        textOptionsSize.value = parseInt(getComputedStyle(pinsActive[0]).fontSize);
        textOptionsSize.oninput = () => {
            pinsActive[0].style.fontSize = textOptionsSize.value + "px";
            textOptionsSize.value = parseInt(getComputedStyle(pinsActive[0]).fontSize);
            updatePinModBox();
        }

        // Color
        var textOptionsColor = document.getElementById("textOptionsColor");
        textOptionsColor.value = rgb2hex(getComputedStyle(pinsActive[0]).color);
        function rgb2hex(rgb) {
            var rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
        
            return (rgb && rgb.length === 4) ? "#" +
                ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
                ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
                ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
        };
        textOptionsColor.oninput = () => {
            pinsActive[0].style.color = textOptionsColor.value;
            textOptionsColor.value = rgb2hex(pinsActive[0].style.color);
            thumbs.updateText();
        }

        // Inner
        var textOptionsInner = document.getElementById("textOptionsInner");
        textOptionsInner.value = pinsActive[0].innerText;
        textOptionsInner.oninput = function() {
            pinsActive[0].innerText = textOptionsInner.value;
            updatePinModBox();
            thumbs.updateText();
        }

		function updatePinModBox() {
			// Обновить размеры модификатора
			pinModBox.style.width = pinsActive[0].offsetWidth + "px";
			pinModBox.style.height = pinsActive[0].offsetHeight + "px";
			rotateMod.style.left = pinsActive[0].offsetWidth/2 + "px";        
		}

        textOptions.style.display = "block";

    }



    createModifier();
    
    if (event.target.classList[0] != "thumb") {
        dragMouseDown(event);
    }

    // Rotate
    rotateMod.addEventListener("mousedown", function(event) {

        event.preventDefault();

        var center = pinsActive[0].getBoundingClientRect();
        var center_y = center.top + center.height/2;
        var center_x = center.left + center.width/2;

        document.onmousemove = rotatePin;
        document.onmouseup = closeRotate;
        board.removeEventListener("mousemove", hoverPin);
        preview.removeEventListener("mouseover", previewCursor);
        preview.style.cursor = "url('./style/cursors/rotate.cur'), auto";

        function rotatePin(event) {
            var mouse_x = event.clientX;
            var mouse_y = event.clientY;
            var deegree = (Math.atan2(mouse_x - center_x, mouse_y - center_y) * 180 / Math.PI * -1) + 180;
            pinsActive[0].dataset.rotate = deegree;

            pinsActive[0].style.transform = "rotate(" + pinsActive[0].dataset.rotate + "deg)";			
            pinModBox.style.transform = "rotate(" + pinsActive[0].dataset.rotate + "deg)";

        }

        function closeRotate() {
            document.onmousemove = null;
            document.onmouseup = null;
            preview.style.cursor = "url('./style/cursors/grab.png'), auto";
            board.addEventListener("mousemove", hoverPin);
            preview.addEventListener("mouseover", previewCursor);
        }

    });

    // Scale
    board.addEventListener("mousedown", function(event){
        if (event.target.classList.contains("scMod")) {
            event.preventDefault();
            document.onmousemove = elementScale;
            document.onmouseup = closeScale;
            board.removeEventListener("mousemove", hoverPin);
            preview.removeEventListener("mouseover", previewCursor);
            preview.style.cursor = "nwse-resize";
        }

        function elementScale(e) {
            e.preventDefault();

            if (event.target.id == "scMod1" || event.target.id == "scMod2") {
                if (pinsActive[0].tagName == "IMG") {
                    
					pinsActive[0].width += e.movementX;
                    pinsActive[0].height += e.movementY;
					
                }
                else if (pinsActive[0].tagName == "P") {
                    pinsActive[0].style.fontSize = parseFloat(getComputedStyle(pinsActive[0]).fontSize) + e.movementX/2 + "px";
                    textOptionsSize.value = parseInt(getComputedStyle(pinsActive[0]).fontSize);
                }
            } else if (event.target.id == "scMod4" || event.target.id == "scMod6") {
                pinsActive[0].height += e.movementY;
            } else if (event.target.id == "scMod5" || event.target.id == "scMod7") {

			

                if (pinsActive[0].dataset.width > 0) {
                    pinsActive[0].dataset.width = parseFloat(pinsActive[0].dataset.width) + e.movementX;
                    pinsActive[0].style.width = pinsActive[0].dataset.width + "px";
                } else {
                    pinsActive[0].dataset.width = 1;
                }
			

            } else {
                pinsActive[0].width -= e.movementX;
                pinsActive[0].height -= e.movementX;
            }

            // Обновить модификатор
            if (pinsActive[0].tagName == "P") {
                pinsActive[0].width = pinsActive[0].clientWidth;
                pinsActive[0].height = pinsActive[0].clientHeight;
            }

            // Обновить размеры модификатора
            pinModBox.style.width = pinsActive[0].width + "px";
            pinModBox.style.height = pinsActive[0].height + "px";
            rotateMod.style.left = pinsActive[0].width/2 + "px";
        }

        function closeScale() {
            document.onmousemove = null;
            document.onmouseup = null;
            board.addEventListener("mousemove", hoverPin);
            preview.addEventListener("mouseover", previewCursor);
            preview.style.cursor = "url('./style/cursors/grab.png'), auto";
        }    

    });

    // Edit text
    pinModBox.addEventListener("dblclick", () => {
        if (event.target.tagName == "P") {
            event.target.contentEditable = true;

            pinModBox.style.display = "none";
            pinModBox.style.visibility = "hidden";

            event.target.click();
            event.target.focus();
            document.execCommand('selectAll',false,null);

            pinsActive[0].addEventListener("keyup", () => {
                textOptionsInner.value = pinsActive[0].innerText;
                textOptionsInner.oninput = function() {
                    updatePinModBox();
                    thumbs.updateText();
                }
                textOptionsInner.value = pinsActive[0].innerText;
                updatePinModBox();
                thumbs.updateText();
            })
        }
    })
}

function createModifier() {

    var rect = getComputedStyle(pinsActive[0]);

    // Create pinModBox
    var div = document.createElement("div");
    div.id = "pinModBox";
    div.style = "display: block; position: absolute; width: " + parseInt(rect.width) + "px; height: " + parseInt(rect.height) + "px; top: " + parseInt(rect.top) + "px; left: " + parseInt(rect.left) + "px;";
    div.style.transform = "rotate(" + pinsActive[0].dataset.rotate + "deg)";
    board.appendChild(div);
    var pinModBox = document.getElementById("pinModBox");

    // Create rotateMod
    var div = document.createElement("div");
    div.id = "rotateMod";
    div.style.left = parseInt(rect.width)/2 + "px";
    pinModBox.appendChild(div);
    var rotateMod = document.getElementById("rotateMod");

    // Create scMod
    var scMod = [];
    for (var i = 0; i <= 7; i++) {
        scMod[i] = document.createElement("div");
        scMod[i].className = "scMod";
        scMod[i].id = "scMod" + i;
        pinModBox.appendChild(scMod[i]);
    }

	if (pinsActive[0].tagName == "P") {
		var scMod5 = document.getElementById("scMod5");
		scMod5.style.display = "block";
		pinsActive[0].dataset.width = parseInt(getComputedStyle(pinsActive[0]).width);

        if (pinsActive[0].innerText.length == 1) {
            document.getElementById("scMod5").style.display = "none";
        }

	}
	

	
}

function dragMouseDown(event) {
    event.preventDefault();

    document.onmousemove = elementDrag;
    document.onmouseup = closeDragElement;

    function elementDrag(event) {
        var rect3 = getComputedStyle(pinModBox);
        pinModBox.style.top = parseInt(rect3.top) + event.movementY + "px";
        pinModBox.style.left = parseInt(rect3.left) + event.movementX + "px";
        pinsActive[0].style.top = parseInt(rect3.top) + "px";
        pinsActive[0].style.left = parseInt(rect3.left) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

board.deactivate = function(event) {
    // event.preventDefault(); // При активном пине возникает ошибка неспойманного события
    if (pinsActive.length == 0) return;

    if (pinsActive[0].tagName == "P") {
        thumbs.updateText();
        textOptions.style.display = "none";
        window.getSelection().removeAllRanges();
        pinsActive[0].innerText = textOptionsInner.value;
        pinsActive[0].blur();
        pinsActive[0].contentEditable = false;
    }

    pinsActive[0].classList.toggle("active");
    thumbListActive[0].classList.toggle("active");
    pinbar.style.display = "none";
    pinModBox.remove();
}

board.clean = function() {
    if (board.innerHTML == "") {
        snackbar.show("Доска пуста!");    
    } else {
        board.deactivate(event);
        board.innerHTML = "";
        thumbs.innerHTML = "";
        snackbar.show("Доска успешно очищена!");    
    }
}

board.delete = function() {
    snackbar.show("Доска успешно удалена!");
}

// Pinbar
var pinbar = document.getElementById("pinbar");
var textOptions = document.getElementById("textOptions");
var pins = board.getElementsByClassName("pin");
var pinsActive = board.getElementsByClassName("active");

function updatePin() {
    // Обновить значения активного пина (трансформация)
    pinsActive[0].style.transform = `rotate(${pinsActive[0].dataset.rotate}deg) scale(${pinsActive[0].dataset.scaleX}, ${pinsActive[0].dataset.scaleY})`;
}

pinbar.up = function() {
    if (thumbListActive[0].parentElement == thumbs.firstElementChild) {
        snackbar.show("Этот слой вверху списка! Выбирайте слои пониже");
    } else {
        pinsActive[0].nextElementSibling.after(pinsActive[0]);
        thumbListActive[0].parentElement.previousElementSibling.before(thumbListActive[0].parentElement);
    }
}

pinbar.down = function() {
    if (thumbListActive[0].parentElement == thumbs.lastElementChild) {
        snackbar.show("Этот пин внизу списка! Выбирайте пины повыше");
    } else {
        pinsActive[0].previousElementSibling.before(pinsActive[0]);
        thumbListActive[0].parentElement.nextElementSibling.after(thumbListActive[0].parentElement);
    }
}

pinbar.flip = () => {
    parseInt(pinsActive[0].dataset.scaleX) == 1 ? pinsActive[0].dataset.scaleX = "-1" : pinsActive[0].dataset.scaleX = "1";
    updatePin();
}

pinbar.flop = () => {
    parseInt(pinsActive[0].dataset.scaleY) == 1 ? pinsActive[0].dataset.scaleY = "-1" : pinsActive[0].dataset.scaleY = "1";
    updatePin();
}

function checkId(nameEnter) {
    if (pins.length != 0) {
        var i;
        for (i = 0; i < pins.length; i++) {
            if (nameEnter == pins[i].id) {
                // Есть копия! Новое имя для пина: ${nameExit}
                var randomId = Math.floor(Math.random() * 100000);
                var timeId = Date.now();
                var nameExit = "pin" + randomId + timeId;
                return nameExit;
            }
        }
        // Копий нет!
        return nameEnter;
    } else {
        // Нет никаких пинов и имён!
        return nameEnter;
    }
}

pinbar.reset = () => {
    pinsActive[0].dataset.rotate = 0;
    pinsActive[0].style.transform = "rotate(" + pinsActive[0].dataset.rotate + "deg)";			
    pinModBox.style.transform = "rotate(" + pinsActive[0].dataset.rotate + "deg)";

    if (pinsActive[0].tagName == "IMG") {
        pinsActive[0].width = pinsActive[0].naturalWidth;
        pinsActive[0].height = pinsActive[0].naturalHeight;
        // Обновить модификатор
        pinModBox.style.width = pinsActive[0].scrollWidth + "px";
        pinModBox.style.height = pinsActive[0].scrollHeight + "px";
        rotateMod.style.left = pinsActive[0].scrollWidth/2 + "px";
    } else if (pinsActive[0].tagName == "P") {
        pinsActive[0].style.fontSize = "30px";
        // Обновить модификатор
        pinModBox.style.width = pinsActive[0].scrollWidth + "px";
        pinModBox.style.height = pinsActive[0].scrollHeight + "px";
        rotateMod.style.left = pinsActive[0].scrollWidth/2 + "px";
    }
}

pinbar.clone = function() {

    var clonePin = pinsActive[0].cloneNode();
    
    clonePin.id = checkId(pinsActive[0].id);

    clonePin.classList.remove("active");
    clonePin.style.top = "10px";
    clonePin.style.left = "10px";

    if (pinsActive[0].tagName == "P") {
        clonePin.innerText = pinsActive[0].innerText;
    }

    board.appendChild(clonePin);

    var cloneThumb = thumbListActive[0].parentElement.cloneNode(true);
    cloneThumb.firstElementChild.classList.remove("active");

    cloneThumb.firstElementChild.id = clonePin.id;
    
    thumbs.insertBefore(cloneThumb, thumbs.firstElementChild);

    board.deactivate(event);
}

pinbar.delete = function() {
    pinsActive[0].remove();
    thumbListActive[0].parentElement.remove();
    pinbar.style.display = "none";
    pinModBox.remove();
}

pinbar.opacity = function() {
    var currentOpacity = pinOpacity.value;
    pinsActive[0].style.opacity = currentOpacity / 100;
    pinsActive[0].dataset.opacity = currentOpacity / 100;
}