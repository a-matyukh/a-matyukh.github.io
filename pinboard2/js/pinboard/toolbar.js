var toolbar = document.getElementById('toolbar');
var path = document.getElementById('path');


// ---------- Toolbar label

var toolbar_label = document.getElementById('toolbar_label');
// var toolbar_label_first = document.getElementById('toolbar_label_first');

// toolbar_label.style.display = 'none';
// pinboard.switch(thumbsBar);

// toolbar_label_first.show = () => {
//     pinboard.show(toolbar);
//     toolbar_label_first.style.display = 'none';
//     setTimeout(() => {
//         toolbar_label.style.display = 'inline';
//         pinboard.switch(thumbsBar);
//     }, 500);
// }

// ---------- Hubs

var hubs = document.getElementById('hubs');
var current_hub;
hubs.open = (event, hub_id) => {

    if (current_hub != undefined && current_hub.firstElementChild.style.display == 'none') {
        path.firstElementChild.click();
    }

    var i, hub, path_hub, gallery;

    hub = document.getElementsByClassName("hub");
    for (i = 0; i < hub.length; i++) {
        hub[i].className = hub[i].className.replace(" active", "");
    }

    switch (hub_id) {
        case 'Products':
            path_hub = 'Products';
            break;
        case 'Images':
            path_hub = 'Images';
            break;
        case 'Text':
            path_hub = 'Text';
            break;
        case 'Colors':
            path_hub = 'Colors';
            break;
    }

    gallery = document.getElementsByClassName("gallery");
    for (i = 0; i < gallery.length; i++) {
        gallery[i].style.display = "none";
    }

    event.currentTarget.className += " active";
    path.firstElementChild.innerHTML = path_hub;
    path.firstElementChild.dataset.id = hub_id;
    document.getElementById(hub_id).style.display = "block";
    current_hub = document.getElementById(hub_id);

}
document.getElementById("hub_images").click();
pinboard.show(toolbar);


// ---------- Path

path.back = () => {
    path.top();
    path.lastElementChild.innerHTML = "";
    current_gallery.style.display = "none";
    var current_hub = document.getElementById(event.target.dataset.id);
    current_hub.lastElementChild.style.display = "none";
    current_hub.firstElementChild.style.display = "block";
}

path.top = () => {
    if (toolbar.onscroll != null) {
        toolbar.onscroll = null;
    }
    toolbar.scrollTop = 0;
}

// ---------- Gallery

var current_gallery;
function show_gallery(id) {
    path.lastElementChild.innerHTML = event.target.innerHTML;

    event.target.closest('.list').style.display = 'none';
    event.target.closest('.list').nextElementSibling.style.display = 'block';

    current_gallery = document.getElementById(id);
    current_gallery.style.display = 'block';
}

// Masonry

function MyRound10(val) {
    return Math.round(val / 10) * 10;
}

let makeCell = item => {
    let height = MyRound10(item.offsetHeight);
    item.style.height = height + 'px';
    let rowSpan = Math.round((height + 10)/20);
    item.style.gridRowEnd = 'span '+ rowSpan;
}

function imageLoaded(e) {
    makeCell(e.target);
} 

// -------------------------------------------------------------------------------------------------- Картинки -------------------------------------------------------

//Cоздать картинку
toolbar.create_image = (src, gallery) => {
    var id = 'pin' + (new Date()).getTime();
    var image = document.createElement('img');
    image.crossOrigin = 'anonymous';
    image.id = id;
    image.src = src;
    image.setAttribute('ondragstart', 'handleDragStart(event)');
    image.setAttribute('onload', 'makeCell(this)');
    gallery.appendChild(image);
}


// ------------------------------------------------- Загрузка картинок -------------------------------------------------------

// -------------------- Загрузка картинки в браузер с локального диска ----------------

function showFileInput() {    
    document.getElementById("fileInput").click();
}

var output = document.getElementById("fileOutput");

function processFiles(files) {
    let i;
    for (i = 0; i < files.length; i++) {
        let file = files[i];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = e => {
            toolbar.create_image(e.target.result, output);
        };
    }
}

// -------------------- Загрузка картинки в браузер по ссылке ----------------

var linkToLoadImg = document.getElementById("linkToLoadImg");

function loadImgAsBase64(url, callback) {
    let canvas2 = document.createElement('CANVAS');
    let img = document.createElement('img');
    img.setAttribute('crossorigin', 'anonymous');
    img.src = 'https://cors-anywhere.herokuapp.com/'+url;

    img.onload = () =>
    {
        canvas2.height = img.height;
        canvas2.width = img.width;
        let context = canvas2.getContext('2d');
        context.drawImage(img,0,0);
        let dataURL = canvas2.toDataURL('image/png');
        canvas2 = null;
        callback(dataURL);
    };
}

linkToLoadImg.upload = () => {
    loadImgAsBase64(linkToLoadImg.value, (dataURL) => {
        toolbar.create_image(dataURL, output);
    });
}

// ------------------------------------------------- Ресурсы -------------------------------------------------------

// Элементы

function getElements(folder_id, gallery_id) {
    
    var gallery = document.querySelector(`#${gallery_id} .grid`);

    if (gallery.innerHTML == "") {

        var data = {category: 'elements', folder: folder_id};
        var fd = new FormData();
        for (var i in data){
            fd.append(i, data[i]);
        }

        fetch('js/pinboard/get_images.php', {
            method: "POST",
            body: fd
        })
        .then(response => response.json())
        .then(response => {
            response.reverse();
            gallery.items = response;

            var loadMore = () => {
                if (gallery.items.length == 0) return;
                var load_quantity = 30;
                var load_count;
                if (gallery.items.length >= load_quantity) {
                    load_count = load_quantity;
                } else {
                    load_count = gallery.items.length;
                }
                var last_item = gallery.items.length - 1;
                for (var i = load_count; i > 0; i--) {
                    gallery.innerHTML += gallery.items[last_item];
                    gallery.items.pop();
                    last_item--;
                }
            };
            loadMore();
            toolbar.onscroll = e => {
                if (toolbar.scrollTop + toolbar.clientHeight + 30 >= toolbar.scrollHeight) {
                    loadMore();
                }
            };
        });
    }
}

// PixaBay

function getPixabay(query) {
    var gallery = document.querySelector('#Pixabay .grid');
    var url = `https://pixabay.com/api/?key=12009280-bcab8183df13f2e7bbccf9214&per_page=200&q=${query}`;
    fetch(url)
        .then(response => response.json())
        .then(res => {
            gallery.innerHTML = "";
            gallery.items = res;
            gallery.loaded = 0;
            gallery.left = gallery.items.hits.length - gallery.loaded;
            var loadMore = () => {
                var next_loaded = 30;
                var load_quantity;
                if (gallery.left >= next_loaded) {
                    load_quantity = next_loaded;
                } else {
                    load_quantity = gallery.left;
                }
                for (var i = 0; i < load_quantity; i++) {
                    toolbar.create_image(`${gallery.items.hits[gallery.loaded].webformatURL}`, gallery);
                    gallery.loaded++;
                }
                gallery.left = gallery.items.hits.length - gallery.loaded;
            };
            loadMore();
            toolbar.onscroll = e => {
                if (toolbar.scrollTop + toolbar.clientHeight + 10 >= toolbar.scrollHeight && gallery.left != 0) {
                    loadMore();
                }
            };
        });
}

var pixabay_query = document.getElementById('pixabay_query');
pixabay_query.onkeypress = e => {
    if (e.code == 'Enter') {
        getPixabay(pixabay_query.value);
    }
}


// Harvard
function getHarvard() {

    var gallery = document.querySelector('#Harvard .grid');

    fetch('js/pinboard/get_harvard.php', {
        method: "POST"
    })
    .then(response => response.json())
    .then(res => {
        console.log(res);

    });


}



// Amsterdam
function getAmsterdam() {
    var gallery = document.querySelector('#Amsterdam .grid');
    fetch('https://www.rijksmuseum.nl/api/en/collection?key=LVdNGsxc&format=json&ps=100')
    .then(response => response.json())
    .then(res => {

        var amstr = res.artObjects;
        gallery.innerHTML = "";
        gallery.items = amstr;
        gallery.loaded = 0;
        gallery.left = gallery.items.length - gallery.loaded;

        var loadMore = () => {
            var next_loaded = 20;
            var load_quantity;
            if (gallery.left >= next_loaded) {
                load_quantity = next_loaded;
            } else {
                load_quantity = gallery.left;
            }
            for (var i = 0; i < load_quantity; i++) {
                toolbar.create_image(`${gallery.items[gallery.loaded].webImage.url}`, gallery);
                gallery.loaded++;
            }
            gallery.left = gallery.items.length - gallery.loaded;
        };
        loadMore();
        toolbar.onscroll = e => {
            if (toolbar.scrollTop + toolbar.clientHeight + 10 >= toolbar.scrollHeight && gallery.left != 0) {
                loadMore();
            }
        };

    });
}


// Colourlovers

function getColors(request, gallery_id) {

    var gallery = document.querySelector(`#${gallery_id} .grid`);

    var data = new FormData();
    data.append('type', request);

    fetch('js/pinboard/get_colors.php', {
        method: "POST",
        body: data
    })
    .then(response => response.json())
    .then(res => {

        var i;
        var arr = [];
        for (i in res) {
            var id = 'pin' + (new Date()).getTime();
            var img = `<img src='${res[i].imageUrl}' id='pin${id}' data-hex='#${res[i].hex}' ondragstart='handleDragStart(event)' onload='makeCell(this)'>`;
            arr.push(img);
        }
        arr.reverse();
        gallery.items = arr;

        var loadMore = () => {
            if (gallery.items.length == 0) return;
            var load_quantity = 30;
            var load_count;
            if (gallery.items.length >= load_quantity) {
                load_count = load_quantity;
            } else {
                load_count = gallery.items.length;
            }
            var last_item = gallery.items.length - 1;
            for (var i = load_count; i > 0; i--) {
                gallery.innerHTML += gallery.items[last_item];
                gallery.items.pop();
                last_item--;
            }
        };
        loadMore();
        toolbar.onscroll = e => {
            if (toolbar.scrollTop + toolbar.clientHeight + 30 >= toolbar.scrollHeight) {
                loadMore();
            }
        };

    });
}

// Iconfinder

function getIconfinder() {

    var gallery = document.querySelector(`#Iconfinder .grid`);

    fetch('js/pinboard/get_iconfinder.php')
    .then(response => response.json())
    .then(res => {

        console.log(res);



    });
}

// ------------------------------------------------- Добавление на холст -------------------------------------------------------

// Клик

var grids = document.getElementsByClassName('grid');
for (let item of grids) {
    item.addEventListener('click', addByClick);
}

function addByClick(e) {
    
    if (e.target.tagName == "IMG") {

        e.preventDefault();               
        e.stopPropagation();

        if (e.target.dataset.hex) {

            hubs.rect(e.target.dataset.hex, CANVAS_TOP*5, CANVAS_TOP*5);

        } else {

            let source;

            if (/pinwin/.test(e.target.currentSrc) || /data:image/.test(e.target.currentSrc)) {       
                source = e.target;
            } else {
                let canvas_img = document.createElement('CANVAS');
                canvas_img.height = e.target.naturalHeight;
                canvas_img.width = e.target.naturalWidth;
                let context = canvas_img.getContext('2d');
                context.drawImage(e.target,0,0);
                let dataURL = canvas_img.toDataURL('image/png');

                let image = document.createElement("img");
                image.crossOrigin = 'anonymous';
                let id = 'img' + (new Date()).getTime();
                image.id = id;
                image.src = dataURL;
                image.style.display = 'none';
                output.append(image);
                source = image;
            } 

            setTimeout(() => {
                var newImage = new fabric.Image(source, {
                    pin_id: source.id,
                    width: source.naturalWidth,
                    height: source.naturalHeight,
                    scaleX: 240/source.naturalWidth,
                    scaleY: 240/source.naturalWidth,
                    left: CANVAS_TOP*2,
                    top: CANVAS_TOP*2
                });
                canvas.add(newImage);
                thumbs.add(newImage);
                canvas.renderAll();
                toastr.success('Картинка добавлена!');
            }, 0);
        }
    }
    return false;
}

// Перетаскивание

canvasContainer.addEventListener('dragenter', handleDragEnter, false);
canvasContainer.addEventListener('dragover', handleDragOver, false);
canvasContainer.addEventListener('dragleave', handleDragLeave, false);
canvasContainer.addEventListener('drop', handleDrop, false);

var drop_item;
var drop_type;
var drop_event;

function handleDragStart(e) {
    e.dataTransfer.setData("text", e.target.id);
    drop_item = e.target;
}

function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    return false;
}

function handleDragEnter(e) {
    if (drop_item == null || drop_item == undefined) {
        drop_type = 'file';
    } else {
        drop_type = 'image';
    }
    canvasContainer.classList.add('over');
}

function handleDragLeave(e) {
    canvasContainer.classList.remove('over'); 
}

function handleDrop(e) {

    e.preventDefault();               
    e.stopPropagation();

    canvasContainer.classList.remove('over');

    if (drop_type == 'image') {

        if (drop_item.dataset.hex) {
            
            var drop_left = canvas.getPointer(e).x;
            var drop_top = canvas.getPointer(e).y;
            hubs.rect(drop_item.dataset.hex, drop_left, drop_top);

        } else {

            let source;

            if (/pinwin/.test(drop_item.currentSrc) || /data:image/.test(drop_item.currentSrc)) {       
                source = drop_item;
            } else {
                let canvas_img = document.createElement('CANVAS');
                canvas_img.width = drop_item.naturalWidth;
                canvas_img.height = drop_item.naturalHeight;
                let context = canvas_img.getContext('2d');
                context.drawImage(drop_item,0,0);
                let dataURL = canvas_img.toDataURL('image/png');

                let image = document.createElement("img");
                image.crossOrigin = 'anonymous';
                let id = 'img' + (new Date()).getTime();
                image.id = id;
                image.src = dataURL;
                image.style.display = 'none';
                output.append(image);
                source = image;
            } 

            setTimeout(() => {

                var newImage = new fabric.Image(source, {
                    pin_id: source.id,
                    width: source.naturalWidth,
                    height: source.naturalHeight,
                    scaleX: 240/source.naturalWidth,
                    scaleY: 240/source.naturalWidth,
                    left: canvas.getPointer(e).x,
                    top: canvas.getPointer(e).y
                });

                canvas.add(newImage);
                thumbs.add(newImage);

                newImage.set('left', newImage.aCoords.tl.x - (newImage.aCoords.tr.x - newImage.aCoords.tl.x)/2);
                newImage.set('top', newImage.aCoords.tl.y - (newImage.aCoords.bl.y - newImage.aCoords.tl.y)/2);
                newImage.setCoords();

                canvas.renderAll();
                
            }, 0);
        }

        drop_item = null;

    } else if (drop_type == 'file') {

        let dt = e.dataTransfer;
        let files = dt.files;
        drop_event = e;
        handleFiles(files);

    }
    return false;
}


// С рабочего стола

let dropArea = canvasContainer

;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults, false)
})

function preventDefaults (e) {
  e.preventDefault()
  e.stopPropagation()
}

;['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, highlight, false)
})

;['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, unhighlight, false)
})

function highlight(e) {
  dropArea.classList.add('highlight')
}

function unhighlight(e) {
  dropArea.classList.remove('over')
}

dropArea.addEventListener('drop', handleDrop, false)

var upload_margin;
function handleFiles(files) {
    upload_margin = 0;
    ([...files]).forEach(uploadFile)
}

var MAX_WIDTH_IMAGE = 1200;

function uploadFile(file) {

    NProgress.start();

    let source;

    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = e => {

        let image = document.createElement("img");
        image.crossOrigin = 'anonymous';
        image.id = 'pin' + (new Date()).getTime();
        image.src = e.target.result;
        image.style.display = 'none';
        Images.append(image);
        source = image;

        setTimeout(() => {

            if (image.width > MAX_WIDTH_IMAGE) {
                image.width = MAX_WIDTH_IMAGE;
                image.height *= MAX_WIDTH_IMAGE/image.naturalWidth;
                let canvas_img = document.createElement('CANVAS');
                canvas_img.width = image.width;
                canvas_img.height = image.height;
                let context = canvas_img.getContext('2d');
                context.drawImage(image, 0, 0, image.width, image.height);
                image.src = canvas_img.toDataURL('image/png');
            }

            var newImage = new fabric.Image(source, {
                pin_id: source.id,
                width: source.width,
                height: source.height,
                scaleX: 240/source.width,
                scaleY: 240/source.width,
                left: canvas.getPointer(drop_event).x + upload_margin,
                top: canvas.getPointer(drop_event).y + upload_margin
            });

            canvas.add(newImage);
            thumbs.add(newImage);

            newImage.set('left', newImage.aCoords.tl.x - (newImage.aCoords.tr.x - newImage.aCoords.tl.x)/2);
            newImage.set('top', newImage.aCoords.tl.y - (newImage.aCoords.bl.y - newImage.aCoords.tl.y)/2);
            newImage.setCoords();

            canvas.renderAll();
            
            upload_margin += 40;
            NProgress.done();

        }, 0);
    };
}


// Текст

hubs.text_remove = (font) => {
    var textbox = new fabric.Textbox('Введите текст', {
        pin_id: `textbox${(new Date()).getTime()}`,
        left: 50,
        top: 50,
        fontFamily: font,
        fill: 'white'
    });
    canvas.add(textbox);
    canvas.remove(textbox);
}
hubs.text_remove('Playfair Display');
hubs.text_remove('Roboto');
hubs.text_remove('Old Standard TT');
hubs.text_remove('Merriweather');
hubs.text_remove('Cormorant Garamond');
hubs.text_remove('Lobster');
hubs.text_remove('Fira Sans');

hubs.text = (font, fill) => {
    var textbox = new fabric.Textbox('Введите текст', {
        pin_id: `textbox${(new Date()).getTime()}`,
        left: 50,
        top: 50,
        fontFamily: font,
        fill: fill
    });
    canvas.add(textbox);
    thumbs.add(textbox);
    textbox.setCoords();
    canvas.requestRenderAll();
    toastr.success('Текст добавлен!');
}

// Цвет

hubs.rect = (hex, left, top) => {
    var new_rect = new fabric.Rect({
        pin_id: `rect${(new Date()).getTime()}`,
        left: left,
        top: top,
        fill: hex,
        width: 100,
        height: 100
    });
    canvas.add(new_rect);
    thumbs.add(new_rect);
    new_rect.set('left', new_rect.aCoords.tl.x - (new_rect.aCoords.tr.x - new_rect.aCoords.tl.x)/2);
    new_rect.set('top', new_rect.aCoords.tl.y - (new_rect.aCoords.bl.y - new_rect.aCoords.tl.y)/2);
    new_rect.setCoords();
    canvas.renderAll();
    toastr.success('Цвет добавлен!');
}