var canvas = new fabric.Canvas('c', {
	backgroundColor: '#f5f5f5', // цвет холста
	// width: screen.width,
	width: pinboard.clientWidth,
	// height: screen.height,
	height: pinboard.clientHeight - 80,
	perPixelTargetFind: true, // только пиксели объекта или модификатор включительно
	targetFindTolerance: 5,
	preserveObjectStacking: true, // выделенный объект на самый верх или нет
	altSelectionKey: 'shiftKey',
	fireRightClick: true,
	stopContextMenu: true,
	snapAngle: 120,
	snapThreshold: 120,
	defaultCursor: 'grab',
	// enableRetinaScaling: false,
	selectionLineWidth: 0
});

canvas.search_pin = (id_name) => {
	for (let obj of canvas._objects) {
		if (obj.pin_id == id_name) {
			return obj;
		}
	}
}

canvas.search_active_pin = (id_name) => {
	var arr = canvas.getActiveObjects();
	for (let obj of arr) {
		if (obj.pin_id == id_name) {
			return obj;
		}
	}
	return false;
}

var CANVAS_TOP = 19;

// ------------------------------------------------ Холст ------------------------------------------------

canvas.minmaxScale = (value) => {
	if (value > 20) {value = 20; return value;}
	if (value < 0.2) {value = 0.2; return value;}
	console.log(value);
}

// Масштабирование холста
canvas.on('mouse:wheel', function(opt) {
	var delta = opt.e.deltaY;
	var pointer = canvas.getPointer(opt.e);
	var zoom = canvas.getZoom();
	zoom = zoom - delta/5000;
	// canvas.minmaxScale(zoom);
	if (zoom > 20) zoom = 20;
	if (zoom < 0.2) zoom = 0.2;
	canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);	
	canvas.showCurrentZoom();
	opt.e.preventDefault();
	opt.e.stopPropagation();
})

canvas.showCurrentZoom = function() {
	document.getElementById('currentZoom').innerText = `${Math.floor(canvas.getZoom()*100)}%`;
}

canvas.scale = function(rate) {
	var zoom = canvas.getZoom();
    switch (rate) {
        case "down": zoom = zoom - 0.03; break;
        case "up": zoom = zoom + 0.03; break;
    }
	// canvas.minmaxScale(zoom);
	if (zoom > 20) zoom = 20;
	if (zoom < 0.2) zoom = 0.2;
    canvas.setZoom(zoom);
	canvas.showCurrentZoom();
}

canvas.setOriginalPosition = function() {
	canvas.setZoom(1);
	canvas.showCurrentZoom();
	canvas.viewportTransform[4] = 0;
	canvas.viewportTransform[5] = 0;
}

// Перемещение холста
canvas.on('mouse:down', function(event) {

	if (event.e.type == "touchstart" && event.e.touches.length == 2) {
		canvas.zoomPointX = event.pointer.x;
		canvas.zoomPointY = event.pointer.y;
	};
		
	var evt = event.e;

	if (canvas.getActiveObjects().length == 0) {

		this.isDragging = true;
		this.selection = false;

		canvas.defaultCursor = 'grabbing';
		canvas.item(0).set('hoverCursor', 'grabbing');
		
		this.lastPosX = event.pointer.x;
		this.lastPosY = event.pointer.y;
		this.renderAll();

		canvas.on('mouse:move', function(event) {
		if (this.isDragging) {
			this.viewportTransform[4] += event.pointer.x - this.lastPosX;
			this.viewportTransform[5] += event.pointer.y - this.lastPosY;
			this.requestRenderAll();
			this.lastPosX = event.pointer.x;
			this.lastPosY = event.pointer.y;
		}
		});
		canvas.on('mouse:up', function(event) {
			this.isDragging = false;
			this.selection = true;
			canvas.defaultCursor = 'grab';
			canvas.item(0).set('hoverCursor', 'grab');
			this.renderAll();
			// Странная необходимость
			var zoom = canvas.getZoom();
			canvas.setZoom(zoom);
		});
	}

	if (event.button == 3 && event.target != null && event.target.selectable != false) {

		if (canvas.getActiveObject() === event.target) {
			console.log('тот же объект!');
			return;
		} else if (!canvas.getActiveObject()) {
			console.log('не выделенный и выделения нету');
			canvas.setActiveObject(event.target);
		} else {
			console.log('есть выделенный объект, добавляем в группу');
			var active_objects = canvas.getActiveObjects();
			console.log(active_objects);
			canvas.discardActiveObject();
			var sel = new fabric.ActiveSelection(active_objects, {
				canvas: canvas,
			});
			sel.addWithUpdate(event.target);
			canvas.setActiveObject(sel);
			console.log(canvas.getActiveObjects());
		}

		canvas.requestRenderAll();

	}
	if (evt.shiftKey === true ) {
		this.isDragging = false;
		this.selection = true;
	}	
	
});

// ------------------------------------------------ Объекты доски ------------------------------------------------

// ----------------- Board -----------------------
canvas.addBoard = () => {
	var board = new fabric.Rect({
		pin_id: 'white-board',
		left: 19,
		top: CANVAS_TOP,
		fill: 'white',
		width: 1201,
		height: 976,
		lockMovementX: true,
		lockMovementY: true,
		lockScalingFlip: true,
		selectable: false,
		hoverCursor: 'grab'
	});
	canvas.add(board);
}
canvas.addBoard();



// ----------------- Board Area -----------------------
canvas.addBoardArea = () => {
	let boardArea = new fabric.Rect({
		pin_id: 'board_area',
		left: 19,
		top: CANVAS_TOP,
		fill: 'rgba(255,255,255,0.0)',
		width: 1201,
		height: 976,
		selectable: false,
		hoverCursor: 'grab',
		strokeDashArray: [5, 5],
		stroke: 'red'
	});
	canvas.add(boardArea);
	canvas.requestRenderAll();
	canvas.boardArea = true;
}
canvas.addBoardArea();

canvas.removeBoardArea = () => {
	for (i in canvas._objects) {
		if (canvas._objects[i].pin_id == 'board_area') {
			canvas.remove(canvas._objects[i]);
		}
	}
	canvas.boardArea = false;
}

// var boardAreaCheckbox = document.getElementById('boardAreaCheckbox');
// boardAreaCheckbox.style.color = 'red';

canvas.toggleBoardArea = () => {
	if (canvas.boardArea == true) {
		canvas.removeBoardArea();
		boardAreaCheckbox.style.color = '';
	} else {
		canvas.addBoardArea();
		boardAreaCheckbox.style.color = 'red';
	}
}


// ----------------- Label -----------------------
canvas.addLabel = () => {
	let d = new Date();
	let day = d.getDate();
	let month = d.getMonth() + 1;
	let year = d.getFullYear();
	let sign = 'PinBoard@' + day + "." + month + "." + year;
	var board_label = new fabric.Textbox(sign, {
		pin_id: 'pinboard_label',
		left: 1020,
		top: 960,
        fontFamily: 'Arial',
		fontSize: 18,
		fontWeight: 'bold',
        fill: 'black'
	});
	canvas.add(board_label);	
}
canvas.removeLabel = () => {
	for (i in canvas._objects) {
		if (canvas._objects[i].pin_id == 'pinboard_label') {
			canvas.remove(canvas._objects[i]);
		}
	}
}


// Touch

var hammertime = new Hammer(canvasContainer);
hammertime.get('pinch').set({ enable: true });
hammertime.on('pinch', e => {

	let delta = e.scale;
	var zoom = canvas.getZoom();

	if (e.additionalEvent == 'pinchin') {
		zoom = zoom - delta/300;
	} else if (e.additionalEvent == 'pinchout') {
		zoom = zoom + delta/1000;
	}

	if (zoom > 20) zoom = 20;
	if (zoom < 0.2) zoom = 0.2;

	canvas.zoomToPoint({ x: e.center.x, y: e.center.y }, zoom);
	canvas.showCurrentZoom();

});