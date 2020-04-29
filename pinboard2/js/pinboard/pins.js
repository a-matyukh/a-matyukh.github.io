// События ------------------------------------------------

canvas.on('selection:created', event => {
	pinboard.switch(pinBar);
	pinBar.update();
	thumbs.selection_update();
	document.addEventListener('keydown', pinHotKeys);
	trash.classList.add('ready');
});

canvas.on('selection:updated', event => {
	pinBar.update();
	thumbs.selection_update();
});

canvas.on("object:modified", event => {
	pinBar.check(pinFlipX, 'flipX', true);
	pinBar.check(pinFlipY, 'flipY', true);
	canvas.bringToFront(canvas.search_pin('board_area'));
});

canvas.on('selection:cleared', function() {
	document.removeEventListener('keydown', pinHotKeys);
	pinboard.switch(pinBar);
	thumbs.create();
	thumbs.selection_update();
	trash.classList.remove('ready');
});


// Модификатор
fabric.Object.prototype.padding = 0;
fabric.Object.prototype.rotatingPointOffset = 60;
fabric.Object.prototype.borderColor = '#f5f5f5';
fabric.Object.prototype.transparentCorners = false;
fabric.Object.prototype.cornerSize = 20;
fabric.Object.prototype.cornerStyle = 'circle';
fabric.Object.prototype.cornerColor = 'rgba(0,191,255,0.5)';

// Панель пина
var pinBar = document.getElementById("pinBar");
var pinFlipX = document.getElementById("pinFlipX");
var pinFlipY = document.getElementById("pinFlipY");
var pinOpacity = document.getElementById("pinOpacity");

var pin_distance = document.getElementById("pin_distance");

var commonOptions = document.getElementById("commonOptions");
var groupOptions = document.getElementById("groupOptions");
var groupOptions_group = document.getElementById("groupOptions_group");
var groupOptions_ungroup = document.getElementById("groupOptions_ungroup");
var textOptions = document.getElementById("textOptions");
var textOptionsFamily = document.getElementById("textOptionsFamily");
var textOptionsSize = document.getElementById("textOptionsSize");
var textOptionsColorBg = document.getElementById("textOptionsColorBg");
var textOptionsColor = document.getElementById("textOptionsColor");
var textOptionsBold = document.getElementById("textOptionsBold");
var textOptionsItalic = document.getElementById("textOptionsItalic");
var textOptionsUnderline = document.getElementById("textOptionsUnderline");

var shapeOptions = document.getElementById("shapeOptions");
var shapeOptionsColorBg = document.getElementById('shapeOptionsColorBg');
var shapeOptionsColor = document.getElementById('shapeOptionsColor');

var maskOptions = document.getElementById("maskOptions");

var shadow_x = document.getElementById("shadow_x");
var shadow_y = document.getElementById("shadow_y");
var shadow_blur = document.getElementById("shadow_blur");

var c_picker_block = document.getElementById("c_picker_block");
var c_picker = document.getElementById("c_picker");

pinBar.update = () => {
	var aobj = canvas.getActiveObject();

	pinBar.check = (id, prop, value) => {
		if (aobj[prop] == value) {
			id.style.color = `red`;
		} else {
			id.style.color = '';
		}
	}

	pinBar.toggle = (id, prop, val1, val2) => {
		if (aobj[prop] == val1) {
			// aobj[prop] = val2;
			aobj.set(prop, val2);
		} else {
			aobj[prop] = val1;
		}
		
		//Се ля ви
		var value = aobj.scaleX;
		aobj.set('scaleX', value + 0.0000000000001);
		
		canvas.renderAll();
		pinBar.check(id, prop, val1);
	}

	pinBar.observe = (id, prop, val1, val2) => {
		pinBar.check(id, prop, val1);
		id.change = () => {
			pinBar.toggle(id, prop, val1, val2);
		};
		id.onclick = id.change;
		canvas.requestRenderAll();
	}

	pinBar.observe(pinFlipX, 'flipX', true, false);
	pinBar.observe(pinFlipY, 'flipY', true, false);

	pinOpacity.value = canvas.getActiveObject()['opacity']*100;

	if (canvas.getActiveObject().shadow == null) {
		shadow_x.value = 0;
		shadow_y.value = 0;
		shadow_blur.value = 0;
	} else if (canvas.getActiveObject().shadow) {
		shadow_x.value = canvas.getActiveObject().shadow.offsetX;
		shadow_y.value = canvas.getActiveObject().shadow.offsetY;
		shadow_blur.value = canvas.getActiveObject().shadow.blur;
	} 
	

	commonOptions.style.display = "inline-block";

	pinBar.setColor = (bg, text, id) => {
		bg.style.backgroundColor = canvas.getActiveObject().fill;
		text.value = canvas.getActiveObject().fill;
		$(document).ready(function() {
			$(id).farbtastic((color) => {
				canvas.getActiveObject().set('fill', color);
				canvas.renderAll();
				bg.style.backgroundColor = color;
				text.value = color;
				// var new_src = thumbs.generate(canvas.getActiveObject());
				// thumbs.update_thumb(canvas.getActiveObject().pin_id, new_src);
			});
			if (canvas.getActiveObject()) {
				$.farbtastic(id).setColor(canvas.getActiveObject().fill);
			}
		});
	}

	if (canvas.getActiveObject()._objects) {
		groupOptions.style.display = "inline-block";
		imgOptions.style.display = "none";
		shapeOptions.style.display = "none";
		textOptions.style.display = "none";
		maskOptions.style.display = "none";

		if (canvas.getActiveObject().type == "activeSelection") {
			commonOptions.style.display = "none";
			groupOptions_group.style.display = "inline-block";
			groupOptions_ungroup.style.display = "none";
		} else {
			groupOptions_ungroup.style.display = "inline-block";
			groupOptions_group.style.display = "none";
		}

	} else {

		groupOptions.style.display = "none";

		if (canvas.getActiveObject().type == 'image') {
			imgOptions.style.display = "inline-block";
			shapeOptions.style.display = "none";
			textOptions.style.display = "none";
			maskOptions.style.display = "inline-block";

			if (aobj.filters.length != 0) {
				pin_distance.value = aobj.filters[0].distance*100;
			} else {
				pin_distance.value = 0;
			}
			pinBar.white = () => {
				var filter = new fabric.Image.filters.RemoveColor({
					distance: pin_distance.value/100
				});

				aobj.filters[0] = filter;
				aobj.applyFilters();
				aobj._filterScalingX = 1;
				aobj._filterScalingY = 1;  
				canvas.renderAll();
			}

		}
		if (canvas.getActiveObject()._text) {
			imgOptions.style.display = "none";
			textOptions.style.display = "inline-block";
			shapeOptions.style.display = "none";

			maskOptions.style.display = "none";


			var i;
			for (i = 0; i < textOptionsFamily.options.length; i++) {
				if (textOptionsFamily.options[i].innerHTML === canvas.getActiveObject().fontFamily) {
					textOptionsFamily.selectedIndex = i;
				}
			}
			textOptionsFamily.onchange = () => {
				canvas.getActiveObject().set("fontFamily", textOptionsFamily.options[textOptionsFamily.selectedIndex].innerHTML);
				canvas.requestRenderAll();
			};
			pinBar.observe(textOptionsBold, 'fontWeight', 'bold', 'normal');
			pinBar.observe(textOptionsItalic, 'fontStyle', 'italic', 'normal');
			pinBar.observe(textOptionsUnderline, 'underline', true, false);
			pinBar.setColor(textOptionsColorBg, textOptionsColor, '#colorpicker');
		}
		if (canvas.getActiveObject().rx != undefined) {
			imgOptions.style.display = "none";
			textOptions.style.display = "none";
			shapeOptions.style.display = "inline-block";
			pinBar.setColor(shapeOptionsColorBg, shapeOptionsColor,	'#colorpicker2');
			maskOptions.style.display = "inline-block";
		}
	}
}

// Настройки в панели

pinBar.bringToFront = () => {
	canvas.bringToFront(canvas.getActiveObject());
	// canvas.sendBackwards(canvas.getActiveObject());
}

pinBar.bringForward = () => {
	var last_index = canvas.getObjects().length - 1;
	if (canvas.getActiveObject() != canvas.item(last_index)) {
		canvas.bringForward(canvas.getActiveObject());
	} else {
		snackbar.show("Этот слой вверху списка! Выбирайте слои пониже");
	}
}

pinBar.sendBackwards = () => {
	if (canvas.getActiveObject() != canvas.item(1)) {
		canvas.sendBackwards(canvas.getActiveObject());
	} else {
		snackbar.show("Этот пин внизу списка! Выбирайте пины повыше");
	}
}

pinBar.sendToBack = () => {
	canvas.sendToBack(canvas.getActiveObject());
	canvas.bringForward(canvas.getActiveObject());
}

pinBar.reset = () => {
	canvas.getActiveObject().originX = "center";
	canvas.getActiveObject().originY = "center";
	canvas.getActiveObject().set('angle', 0);
	
	if (canvas.getActiveObject().type == 'image') {
		canvas.getActiveObject().set('scaleX', 240/canvas.getActiveObject()._originalElement.naturalWidth);
		canvas.getActiveObject().set('scaleY', 240/canvas.getActiveObject()._originalElement.naturalWidth);
	} else if (canvas.getActiveObject()._text) {
		canvas.getActiveObject().set('scaleX', 1);
		canvas.getActiveObject().set('scaleY', 1);
	}
	canvas.getActiveObject().setCoords();
	canvas.renderAll();
}

pinBar.duplicate = () => {
	canvas.getActiveObject().clone( clonedObj => {
		canvas.discardActiveObject();
		if (clonedObj.type === 'activeSelection') {
			// active selection needs a reference to the canvas.
			clonedObj.canvas = canvas;
			clonedObj.forEachObject(function(obj) {
				obj.set({
					left: obj.left + 20,
					top: obj.top + 20,
					pin_id: `pin${(new Date()).getTime()}`,
					evented: true
				});
				canvas.add(obj);
				console.log(obj.pin_id);
			});
			// this should solve the unselectability
			clonedObj.setCoords();
			canvas.setActiveObject(clonedObj);
			canvas.discardActiveObject();
		} else {
			clonedObj.set({
				left: clonedObj.left + 20,
				top: clonedObj.top + 20,
				pin_id: `pin${(new Date()).getTime()}`,
				evented: true,
			});
			canvas.add(clonedObj);
			canvas.setActiveObject(clonedObj);
		}
		canvas.requestRenderAll();
		thumbs.create();
		thumbs.selection_update(event);
	});
}

pinBar.opacity = () => {
	canvas.getActiveObject()['opacity'] = pinOpacity.value/100;
	canvas.requestRenderAll();
}

function rgb2hex(rgb){
	rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
	return (rgb && rgb.length === 4) ? "#" +
	("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
	("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
	("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}

pinBar.colorPicker = (event, bg, id) => {


	event.target.closest('button').blur();
	var btn_style = event.target.closest('button').style;
	var canvasElement = document.getElementById('c');
	var ctx = canvasElement.getContext("2d");
	var isPickerEnabled;
	var new_color;

	bg.style.outline = "5px solid rgba(0,191,255,0.5)";
	bg.style.boxShadow = "0 0 40px 20px rgba(0,0,0,0.2)";

	function searchColor(e) {
		var mouse = canvas.getPointer(e.e);
		var x = Math.floor((parseInt(mouse.x) * canvas.getZoom() + canvas.viewportTransform[4]) * fabric.devicePixelRatio);
		var y = Math.floor((parseInt(mouse.y) * canvas.getZoom() + canvas.viewportTransform[5]) * fabric.devicePixelRatio);
		var px = ctx.getImageData(x, y, 1, 1).data;
		var rgbadata = `rgba(${px[0]}, ${px[1]}, ${px[2]}, ${px[3]})`; 
		var hex = rgb2hex(rgbadata);
		bg.style.backgroundColor = hex;
		id.value = hex;
		new_color = hex;
		c_picker_block.style.top = `${e.pointer.y}px`;
		c_picker_block.style.left = `${e.pointer.x}px`;
		c_picker.style.backgroundColor = hex;
		canvas.requestRenderAll();
	}

	canvas.on('before:selection:cleared', () => {
		if (isPickerEnabled == true) {
			console.log('Установили!');
			canvas.getActiveObject().set('fill', new_color);
			canvas.renderAll();
			finishPicker();
			isPickerEnabled = false;
		} 
	});
	canvas.on('selection:updated', event => {
		if (isPickerEnabled == true) {
			console.log('Установили!');
			event.deselected[0].set('fill', new_color);
			canvas.renderAll();
			finishPicker();
			isPickerEnabled = false;
			canvas.discardActiveObject();
		} 
	});

	function setColor(event) {
		if (canvas.getActiveObject() && event.code === "Space") {
			console.log('Установили!');
			canvas.getActiveObject().set('fill', id.value);
			canvas.renderAll();
			finishPicker();
		}
		if (canvas.getActiveObject() && event.code === "Escape") {
			console.log('Отмена!');
			bg.style.backgroundColor = canvas.getActiveObject().fill;
			canvas.renderAll();
			finishPicker();
		}
	}

	function startPicker() {
		isPickerEnabled = true;
		console.log('начали!');
		btn_style.color = "red";
		canvas.on('mouse:move', searchColor);
		document.addEventListener('keydown', setColor);
		canvas.on('selection:updated', finishPicker);
		canvas.on('selection:cleared', finishPicker);

		c_picker_block.style.top = `${event.clientY}px`;
		c_picker_block.style.left = `${event.clientX}px`;
		c_picker_block.style.display = 'block';
		c_picker.onclick = finishPicker;


	}

	function finishPicker() {
		console.log('закончили!');
		canvas.__eventListeners["mouse:move"] = [];
		canvas.off('selection:updated', finishPicker);
		canvas.off('selection:cleared', finishPicker);
		btn_style.color = "";
		document.removeEventListener('keydown', setColor, false);
		bg.style.outline = "";
		bg.style.boxShadow = "0 0 20px 10px rgba(0,0,0,0.0)";
		bg.style.boxShadow = "0 0 20px 10px rgba(0,0,0,0.0)";

		c_picker_block.style.display = 'none';

	}

	if (btn_style.color == "red") {
		bg.style.backgroundColor = canvas.getActiveObject().fill;
		id.value = canvas.getActiveObject().fill;
		document.removeEventListener('keydown', setColor, false);
		finishPicker();
	} else {
		startPicker();
	}
}

pinBar.mask = (type) => {

	if (type == "none") {
		canvas.getActiveObject().clipPath = '';
	} 
	else if (type == "circle") {
		var width = canvas.getActiveObject().getScaledWidth();
		var height = canvas.getActiveObject().getScaledHeight();

		var clipPath = new fabric.Ellipse({
			// rx: canvas.getActiveObject().width/2,
			rx: 500,
			// ry: canvas.getActiveObject().height/2,
			ry: 500,
			left: -(canvas.getActiveObject().width/2),
			top: -(canvas.getActiveObject().height/2),
			scaleX: canvas.getActiveObject().width/1000,
			scaleY: canvas.getActiveObject().height/1000
		});
		canvas.getActiveObject().clipPath = clipPath;
	}
	else if (type == 'rounded' || 'splash' || 'star' || 'bookmark' || 'splash2' || 'splash3' || 'splash4' || 'splash5') {
		imageMask(type);
	}

	//Се ля ви
	canvas.getActiveObject().set('scaleX', canvas.getActiveObject().scaleX + 0.0000000000001);
	canvas.getActiveObject().set('scaleY', canvas.getActiveObject().scaleY + 0.0000000000001);

	canvas.getActiveObject().setCoords();
	canvas.requestRenderAll();

}
function imageMask(name) {
	fabric.Image.fromURL(`css/pinboard/images/${name}.png`, function(img) {
		img.top = -(canvas.getActiveObject().height/2);
		img.left = -(canvas.getActiveObject().width/2);
		img.scaleX = canvas.getActiveObject().width/img.width;
		img.scaleY = canvas.getActiveObject().height/img.height;
		canvas.getActiveObject().clipPath = img;
		// Странная необходимость
		var zoom = canvas.getZoom() + 0.0000000000001;
		canvas.setZoom(zoom);
	});
}

pinBar.shadow = () => {

	if (canvas.getActiveObject()._text || canvas.getActiveObject().rx != undefined) {
			if (shadow_x.value > 9) shadow_x.value = 9;
			if (shadow_y.value > 9) shadow_y.value = 9;
			if (shadow_blur.value > 9) shadow_blur.value = 9;
	}

	canvas.getActiveObject().setShadow({
		nonScaling: true,
		offsetX: shadow_x.value, 
		offsetY: shadow_y.value, 
		blur: shadow_blur.value, 
		color: 'rgba(0,0,0,0.3)' 
	});
	canvas.renderAll();
}

pinBar.group = () => {
	if (!canvas.getActiveObject()) {
		return;
	}
	if (canvas.getActiveObject().type !== 'activeSelection') {
		return;
	}
	canvas.getActiveObject().toGroup();
	canvas.getActiveObject().set('pin_id', `group${(new Date()).getTime()}`)
	canvas.requestRenderAll();
	pinBar.update();
	thumbs.create();
	thumbs.selection_update();
}

pinBar.ungroup = () => {
	if (!canvas.getActiveObject()) {
		return;
	}
	if (canvas.getActiveObject().type !== 'group') {
		return;
	}
	canvas.getActiveObject().toActiveSelection();
	canvas.discardActiveObject();
	canvas.requestRenderAll();
	pinboard.switch(pinBar);
	thumbs.create();
}

// -------------------------------------------------------- Зона рефакторинга --------------------------------------------

pinBar.alignCenterX = () => {
	var activeObj = canvas.getActiveObject();
	
	var groupWidth = activeObj.width;
    var groupHeight = activeObj.height;

	activeObj.forEachObject(function(obj) {
		var itemWidth = obj.getBoundingRect().width;
    	var itemHeight = obj.getBoundingRect().height;

		obj.set({
			left: (0 - itemWidth/2),
			originX: 'left'
		});
        obj.setCoords();
        canvas.renderAll();
	});
};

pinBar.alignCenterY = () => {
	var activeObj = canvas.getActiveObject();
	
	var groupWidth = activeObj.width;
    var groupHeight = activeObj.height;

	activeObj.forEachObject(function(obj) {
		var itemWidth = obj.getBoundingRect().width;
    	var itemHeight = obj.getBoundingRect().height;

		obj.set({
			top: (0 - itemHeight/2),
			originX: 'left'
		});
        obj.setCoords();
        canvas.renderAll();
	});
};

// -------------------------------------------------------- Конец зоны рефакторинга --------------------------------------------


canvas.selectAllLayers = function() {
	canvas.discardActiveObject();
	var sel = new fabric.ActiveSelection(canvas.getObjects(), {
		canvas: canvas,
	});
	canvas.setActiveObject(sel);
	canvas.requestRenderAll();
}

canvas.deleteSelectedObject = function(event) {
	if (canvas.getActiveObjects().length >= 2){		
		canvas.getActiveObjects().forEach((o) => {
			thumbs.remove(o);
			canvas.remove(o);
		});
		canvas.discardActiveObject().requestRenderAll();
	} else {
		thumbs.remove(canvas.getActiveObject());
		canvas.remove(canvas.getActiveObject());
	}
};

canvas.deleteAllObject = function() {
	for (i in canvas._objects) {
		canvas.remove(canvas._objects[i]);
	}
	thumbs.delete();
	canvas.addBoard();
	canvas.addBoardArea();  
};

function update(jscolor) {
    canvas.getActiveObject().set('fill', shapeOptionsColor.style.backgroundColor);
	canvas.requestRenderAll();
}

// Горячие клавиши

function pinHotKeys(event) {

	function move(property, sign) {
		function upd_prop(value) {
			if (sign == 'minus') canvas.getActiveObject()[property] -= value;
			else if (sign == 'plus') canvas.getActiveObject()[property] += value;
		}
		if (event.shiftKey == true) {
			upd_prop(10);
		} else {
			upd_prop(1);
		};
		canvas.requestRenderAll();
	}

	switch (event.code) {
	case "ArrowUp":
		move('top', 'minus');
		break;
	case "ArrowLeft":
		move('left', 'minus');
		break;
	case "ArrowRight":
		move('left', 'plus');
		break;
	case "ArrowDown":
		move('top', 'plus');
		break;
	case "Delete":
		if (canvas.getActiveObject().type == "textbox" && canvas.getActiveObject().isEditing == true) return;
		canvas.deleteSelectedObject();
		break;
	}
}