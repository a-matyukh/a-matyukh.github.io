var thumbsBar = document.getElementById('thumbsBar');
var thumbs = document.getElementById('thumbs');
var thumbBar = document.getElementById('thumbBar');
var trash = document.getElementById('trash');

// Создать или обновить панель слоёв

thumbs.create = () => {
	thumbs.delete();
	console.time('Генерация тамбов');
	for (let obj of canvas._objects) {
		if (obj.pin_id != 'board_area' && obj.pin_id != 'white-board') {
			thumbs.add(obj);
		}
	}
	console.timeEnd('Генерация тамбов');
}

thumbs.update_thumb = (id, src) => {
	for (let thumb of thumbs.children) {
		if (thumb.id == id) {
			thumb.src = src;
		}
	}
}

thumbs.add = (element) => {
	
	let thumb_src;

	if (element._element) {
		if (/pinwin/.test(element._element.currentSrc) || /data:image/.test(element._element.currentSrc)) {       
			thumb_src = element._element.currentSrc;
		} else {
			thumb_src = thumbs.generate(element);
		}
	} else {
		thumb_src = thumbs.generate(element);
	}

	var img = document.createElement('img');
	img.id = element.pin_id;
	img.src = thumb_src;
	img.draggable = false;
	thumbs.prepend(img);
}

thumbs.generate = element => {
	return element.toDataURL({
		format: 'png',
		// format: 'jpeg',
		// quality: 0.4,
		multiplier: 0.3,
		// top: element.ownMatrixCache.value[5],
		// left: element.ownMatrixCache.value[4],
		// width: element.width,
		// height: element.height,
		// enableRetinaScaling: false
	});
}

thumbs.remove = pin => {
	for (let thumb of thumbs.children) {
		if (thumb.id == pin.pin_id) {
			thumb.remove();
		}
	}
}

thumbs.delete = () => {
	if (thumbs.innerHTML != "") {
		thumbs.innerHTML = "";
	}
}


// Обновить выделения
thumbs.selection_update = () => {

	for (let thumb of thumbs.children) {
		if (thumb.classList.contains('active')) {
			thumb.classList.remove('active');
		}
	}

	var arr = canvas.getActiveObjects();
	for (let obj of arr){
		for (let thumb of thumbs.children) {
			if (obj.pin_id == thumb.id) {
				thumb.classList.add('active');
			}
		}
	}

}

// При наведении на пин на доске подсвечивается в панели
canvas.on('mouse:over', (event) => {
	canvas.renderAll();
	if (event.target != null && event.target.pin_id != 'white-board' && event.target.pin_id != 'board_area' && event.target.type != "activeSelection") {
		document.querySelector(`#thumbs #${event.target.pin_id}`).classList.add("hovered");
	}
});

canvas.on('mouse:out', (event) => {
	if (event.target != null && event.target.pin_id != 'white-board' && event.target.pin_id != 'board_area' && event.target.type != "activeSelection") {
		document.querySelector(`#thumbs #${event.target.pin_id}`).classList.remove("hovered");
	}
});


// При наведении на пин на панели подсвечивается на доске
thumbsBar.addEventListener('mouseover', (event) => {
	if (event.target.nodeName == "IMG") {
		if (!thumbs.contains(thumbBar)) {
			var div = document.createElement('div');
			div.id = "thumbBar";
			thumbs.append(thumbBar);
		}
		thumbBar.style.left = event.target.offsetLeft + 35 + "px";
		thumbBar.style.top = event.target.offsetTop - 10 + "px";
		thumbBar.style.display = 'block';

	} else if (event.target.id == "thumbBar") {
		thumbBar.onclick = () => {
			var i;
			for (i = 1; i < canvas.size(); i++) {
				if (canvas.item(i).pin_id == event.relatedTarget.id) {
					canvas.remove(canvas.item(i));
				}
			}
			thumbs.create();
		}
	} else {
		thumbBar.style.display = 'none';
	}
});

// Клик в панели - выбор на доске
thumbsBar.addEventListener('click', (event) => {
	if (event.target.nodeName == "IMG") {
		var i;
		for (i = 1; i < canvas.size(); i++) {
			if (canvas.item(i).pin_id == event.target.id) {
				var arr = canvas.getActiveObjects();
				if (arr.length == 0) {
					canvas.setActiveObject(canvas.item(i));
				} else {
					for (let obj of arr){
						if (obj.pin_id == canvas.item(i).pin_id) {
							canvas.discardActiveObject();
							canvas.renderAll();
						} else {
							canvas.setActiveObject(canvas.item(i));
						}
					}
				}
			}
		}
		thumbBar.style.display = 'none';
	} else if (event.target.id == "thumbs" || 'thumbsBar') {
		canvas.discardActiveObject();
		canvas.renderAll();
	}
});


// Перетаскивание пинов
Sortable.create(thumbs, {
	group: {
        name: 'shared',
        pull: true
    },
	animation: 150,
	ghostClass: "sortable-drag",
	onChoose: (event) => {
		trash.classList.toggle('active');
	},
	onUnchoose: (event) => {
		trash.classList.toggle('active');
	},
	onEnd: (event) => {
		let item;
		let delta_index = event.oldIndex - event.newIndex;
		for (i in canvas._objects) {
			if (canvas._objects[i].pin_id == event.item.id) {
				item = canvas._objects[i];
			}
		}
		if (delta_index < 0) {
			delta_index = Math.abs(delta_index);
			let n;
			for (n = 0; n < delta_index; n++) {
				canvas.sendBackwards(item);
			}
		} else {
			let f;
			for (f = 0; f < delta_index; f++) {
				canvas.bringForward(item);
			}
		}
	}
});

trash.delete_active_pin = () => {
	if (!canvas.getActiveObject()) {
		return;
	}
	canvas.deleteSelectedObject();
}
trash.delete_pin = (pin) => {
	for (let obj of canvas._objects) {
		if (obj.pin_id == pin.id) {
			canvas.remove(obj);
		}
	}
	pin.remove();
}

Sortable.create(trash, {
    group: {
        name: 'shared',
        pull: true
    },
	animation: 150,
	onAdd: event => {
		trash.delete_pin(event.item);
		if (canvas.getActiveObjects().length >= 2) {
			if (!canvas.search_active_pin(event.item.id) == false) {
				canvas.discardActiveObject().requestRenderAll();
			}
		}
	}
});