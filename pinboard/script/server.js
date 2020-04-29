// -------------------- Панель доски --------------------

// ------- 3.1 Возврат в раздел "Мои альбомы" -------
board.exitMenu = () => {
    var exitMenu = document.getElementById("exitMenu");
    if (exitMenu.style.display == "none" || exitMenu.style.display == "") {
        exitMenu.style.display = "block";
        document.addEventListener("click", closeExitMenu);
    } else {
        exitMenu.style.display = "none";
        document.removeEventListener("click", closeExitMenu);
    }
    function closeExitMenu(event) {        
        if (event.target.id != "" && event.target.id != "exitMenu") {
            exitMenu.style.display = "none";
        }
    }
};



// ------- 3.2 При нажатии на один из пунктов -------


// board.backToAlbums = function(event, save) {
//     event.preventDefault();
//     console.dir(event.target);

//     if (save == "yeah") {
//         board.save();
//         setTimeout(function() {
//             click();
//         }, 1000); // кликает с задержкой, чтобы успевать отрендерить картинку
//     } else if (save == "no") {
//         click(event);
//     }

//     function click() {
//         // event.preventDefault();
//         // console.dir(event.target);
//         // event.target.setAttribute("href", "http://albums.php/");
//         // event.target.click();
//     }

// }

// function goToCollages(event) {
//     function click() {
//         event.target.parentElement.setAttribute("href", "http://collages.php/");
//         event.target.parentElement.click();
//     }
//     var result = confirm("Сохранить текущий коллаж?");
//     if (result == true) {
//         board.save();
//         setTimeout(click, 1000); // кликает с задержкой, чтобы успевать отрендерить картинку
//     } else {
//         click();
//     }
// }

// ------- 3.3 Сохранение коллажа -------

board.save = function(event) {
    board.deactivate(event);

    // var boardData = board.innerHTML; // Данные доски для сохранения
    // var thumbsData = thumbs.innerHTML; // Данные миниатюр для сохранения?

    // Исходная позиция и размер для рендеринга картинки
    var currentScale = parseFloat(canvas.dataset.scale);
    canvas.dataset.scale = 1;
    canvas.update();

    // Рендеринг картинки коллажа
    html2canvas(board, {
        scale: 1,
        useCORS: true
    }).then(function(canvas) {
        // Рендеринг произошел, дальше поставил для теста сохранение через браузер
        var image = canvas.toDataURL("image/jpg"); // Бинарник канваса

        download("my-collage.jpg", image);
        function download(filename, text) {
            var element = document.createElement('a');
            element.setAttribute('href', text);
            element.setAttribute('download', filename);
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
            
        }
    }).then(() => {
        canvas.dataset.scale = currentScale;
        canvas.update();
    });

    // Сохранение картинок в кабинет
    snackbar.show("Доска успешно сохранена!");
}

// -------------------- Браузер --------------------

// ------- 4.2 Предметы -------
// ------- 4.3 Графические элементы -------


// Галерея

var photos = document.getElementById("photos");

function goToGallery() {
    document.getElementById("menuElements").style.display = "none";
    document.getElementById("menuPhotos").style.display = "block";

    // Elements
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var i, x = "";
            var myObj = JSON.parse(this.responseText);
            for (i in myObj) {
                x += "<img src='" + myObj[i].thumbnailUrl + "' id='pin" + myObj[i].id + "' ondragstart='dragStart(event)' ondragend='dragEnd(event)'>";
            }
            document.getElementById("photos").innerHTML = x;
        }
    };
    xmlhttp.open("GET", "data/photos.json", true);
    xmlhttp.send();

}

function backToMenu() {
    document.getElementById("menuPhotos").style.display = "none";
    document.getElementById("menuElements").style.display = "grid";
}