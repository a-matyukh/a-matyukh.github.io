// Thumbs
var thumbs = document.getElementById("thumbs");
var thumbList = document.getElementsByClassName("thumb");
var thumbListActive = thumbs.getElementsByClassName("active");

thumbs.updateText = function() {

    let string = pinsActive[0].innerText;
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
    thumbListActive[0].innerHTML = txtThumb;

    thumbListActive[0].style.fontFamily = getComputedStyle(pinsActive[0]).fontFamily;
    thumbListActive[0].style.color = getComputedStyle(pinsActive[0]).color;
    thumbListActive[0].style.fontWeight = getComputedStyle(pinsActive[0]).fontWeight;
    thumbListActive[0].style.fontStyle = getComputedStyle(pinsActive[0]).fontStyle;
    thumbListActive[0].style.textDecorationLine = getComputedStyle(pinsActive[0]).textDecorationLine;
}

thumbs.addEventListener("click", function(event) {

    if (event.target.tagName == "BUTTON") return;  
    
    if (thumbListActive.length == 0 && event.target.classList.contains("thumb")) {
        // console.log(event.target.id + " - нет никаких активных пинов, зажигаем первый из них");
        board.activate(event);
    }
    else if (thumbListActive.length == 1) {

        if (event.target.classList.contains("active")) {
            // console.log(event.target.id + " - нажимаем по активному пину");
            board.deactivate(event);
        }
        else if (event.target.id == "thumbs") {
            // console.log(event.target.id + " - нажато пустое место");
            board.deactivate(event);
        }
        else if (event.target.className != "thumb active") {
            // console.log(event.target.id + " - нажимаем по неактивному пину");
            board.deactivate(event);
            board.activate(event);
        }

    }

});

thumbs.delete = function(event) {

    if (pinsActive.length == 1) {
        board.deactivate(event);
    }

    event.target.parentElement.parentElement.remove();
    pins[event.target.parentElement.parentElement.firstElementChild.id].remove();

}
