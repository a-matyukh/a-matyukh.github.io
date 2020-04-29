// ------- 3.1 Возврат в раздел "Мои альбомы" -------
// canvas.exitMenu = () => {
//     var exitMenu = document.getElementById("exitMenu");
//     if (exitMenu.style.display == "none" || exitMenu.style.display == "") {
//         exitMenu.style.display = "block";
//         document.addEventListener("click", closeExitMenu);
//     } else {
//         exitMenu.style.display = "none";
//         document.removeEventListener("click", closeExitMenu);
//     }
//     function closeExitMenu(event) {        
//         if (event.target.id != "" && event.target.id != "exitMenu") {
//             exitMenu.style.display = "none";
//         }
//     }
// };

// ------- 3.2 При нажатии на один из пунктов -------

// canvas.backToAlbums = function(event, save) {

//     if (save == "yeah") {
//         canvas.saveToAlbum();
//         setTimeout(function() {
//             click(event);
//             console.log("Стоп: теперь клик по ссылке! уходим на другой раздел");
//         }, 3000);
//     } else if (save == "no") {
//         click(event);
//     }

//     function click() {
//         event.target.setAttribute("href", "./albums.php");
//         event.target.click();
//     }

// }

// ------- Сохранение картинки коллажа в альбом -------
canvas.saveToAlbum = () => {
	
	//Запоминаем текущие параметры
	var currentView = {
		zoom: canvas.getZoom(),
		top: canvas.viewportTransform[4],
		left: canvas.viewportTransform[5]
	};

	// Ставим стартовые
	canvas.setOriginalPosition();
	
		console.time('1. Генерация картинки');
		var image = canvas.toDataURL({
			format: 'png',
			left: 20,
			top: CANVAS_TOP + 1,
			width: 1200,
			height: 975
		});
		console.timeEnd('1. Генерация картинки');

		//Генерация превьюшки
		fabric.Image.fromURL(image, function(preview) {
			preview.set({pin_id: 'canvas_preview', scaleX: 0.166, scaleY: 0.166});
			var preview_data = preview.toDataURL({format: 'png'});
			// Что-то делать с бинарником превьюшки preview_data
		});

		console.time('2. Сохранение картинки на диск сервера');
        var imgdata = image.replace(/^data:image\/(png|jpg);base64,/, "");
        var fd = new FormData;
        fd.append('albumid', 0);
        fd.append('newalbum', 1);
        fd.append('file', imgdata);

		$.ajax({
            url: 'imgs/users/pinboard/',
            data: fd,
            processData: false,
            contentType: false,
            type: 'post',
            success: function (response) {
				console.timeEnd('2. Сохранение картинки на диск сервера');
                console.log(`Картинка с именем ${response} сохранена в альбом`);
				snackbar.show("Картинка коллажа успешно сохранена в папку альбома!");
            }
        });

	//Возвращаем параметры просмотра
	canvas.setZoom(currentView.zoom);
	canvas.showCurrentZoom();
	canvas.viewportTransform[4] = currentView.top;
	canvas.viewportTransform[5] = currentView.left;
}

// Скачивание картинки коллажа на диск ------------------------
canvas.exportToPng = () => {

	console.time('Сохранение картинки');

	//Запоминаем текущие параметры
	var currentView = {
		zoom: canvas.getZoom(),
		top: canvas.viewportTransform[4],
		left: canvas.viewportTransform[5]
	};

	// Ставим стартовые
	canvas.setOriginalPosition();

	// Печать водяного знака
	canvas.addLabel();

	console.time('Генерация картинки');
	var image = canvas.toDataURL({
		format: 'png',
		left: 20,
		top: CANVAS_TOP + 1,
		width: 1200,
		height: 975
	});
	console.timeEnd('Генерация картинки');

	forceDownload(image, `${boardSettings.firstElementChild.innerHTML}.png`);
	function forceDownload(url, fileName){
		var xhr = new XMLHttpRequest();
		xhr.open("GET", url, true);
		xhr.responseType = "blob";
		xhr.onload = function(){
			var urlCreator = window.URL || window.webkitURL;
			var imageUrl = urlCreator.createObjectURL(this.response);
			var tag = document.createElement('a');
			tag.href = imageUrl;
			tag.download = fileName;
			document.body.appendChild(tag);
			tag.click();
			document.body.removeChild(tag);
		}
		xhr.send();
	}

	//Возвращаем параметры просмотра
	canvas.setZoom(currentView.zoom);
	canvas.showCurrentZoom();
	canvas.viewportTransform[4] = currentView.top;
	canvas.viewportTransform[5] = currentView.left;

	// Удаляем водяной знак
	canvas.removeLabel();

	console.timeEnd('Сохранение картинки');
}

// Поле названия черновика
// var boardNameInput = document.getElementById('boardNameInput');
// boardNameInput.onchange = event => {
// 	if (boardNameInput.value != null) {
// 		canvas.saving(boardNameInput.value);
// 	}
// }

// Сохранение черновика -------------------------------------
canvas.saveToCabinet = () => {
	//Если сохраняется новый коллаж без названия
	if (boardNameInput.value == "") {
		let boardName = prompt("Введите название нового коллажа");
		if (boardName != null) {
			canvas.saving(boardName);
			boardNameInput.value = boardName;
		}
	//Если сохраняется текущий коллаж с названием
	} else {
		if (boardNameInput.value != null) {
			canvas.saving(boardNameInput.value);
		}
	}
}

canvas.saving = boardName => {

	// boardNameInput.dataset.id - айдишник доски, который можно передавать 

	var fd = new FormData;
	fd.append('method', 'saveboard');
	fd.append('boardname', boardName);
	fd.append('boardcont', JSON.stringify(canvas.toJSON(['selectable', 'hoverCursor', 'viewportTransform', 'pin_id'])));

	$.ajax({
		url: 'pinboard-draft.php',
		data: fd,
		processData: false,
		contentType: false,
		type: 'post',
		success: function (data) {
			snackbar.show("Черновик коллажа успешно сохранен!");
			canvas.saveToAlbum();
			boardList.updateList();
		}
	});
}

// Загрузка черновика
canvas.loadFromCabinet = (id, name) => {
	NProgress.start();
	document.getElementsByClassName('loader')[0].classList.toggle('is-active');
	document.getElementsByClassName('loader')[0].dataset.text = `Коллаж "${name}" загружается`;
	var fd = new FormData;
	fd.append('method', 'getdraft');
	fd.append('draft', id);
	$.ajax({
		url: 'pinboard-draft.php',
		data: fd,
		processData: false,
		contentType: false,
		type: 'post',
		success: function (data) {
			for (i in canvas._objects) {
				canvas.remove(canvas._objects[i]);
			}
			canvas.loadFromJSON(data, () => {
				canvas.removeBoardArea();
				canvas.addBoardArea();
				thumbs.create();
				canvas.showCurrentZoom();
				NProgress.done();
				document.getElementsByClassName('loader')[0].classList.toggle('is-active');
				console.log(`Доска с id ${id} и именем ${name} загружена`);
				toastr.success(`Коллаж "${name}" загружен`);
			});
			boardNameInput.value = name;
			boardNameInput.dataset.id = id;
		}
	});
}

// Список черновиков -------------------------------------

// var boardList = document.getElementById('boardList');	

// boardList.updateList = () => {

// 	boardList.selectedIndex = 0;	

// 	// Очищение списка
// 	var arr = [...boardList.options];
// 	for (key in arr) {
// 		if (arr[key].id != "") {
// 			var i;
// 			for (i = 0; i < boardList.length; i++) {
// 				if (boardList.item(i).id == arr[key].id) {
// 					boardList.item(i).remove();
// 				}
// 			}
// 		}
// 	}

// 	// Создание нового списка
// 	var fd = new FormData;
// 	fd.append('method', 'list');
// 	$.ajax({
// 		url: 'pinboard-draft.php',
// 		data: fd,
// 		processData: false,
// 		contentType: false,
// 		type: 'post',
// 		success: function (data) {
// 			var res = JSON.parse(data);
// 			for (let i = 0; i < res.length; i++) {
// 				let curData = res[i];
// 				var option = document.createElement("option");
// 				option.text = curData.name;
// 				option.id = curData.id;
// 				boardList.add(option);
// 			}
// 		}
// 	});
// }
// boardList.updateList();

// boardList.oninput = (event) => {
// 	canvas.loadFromCabinet(boardList[boardList.selectedIndex].id, event.target.value);
// 	boardList.updateList();
// };