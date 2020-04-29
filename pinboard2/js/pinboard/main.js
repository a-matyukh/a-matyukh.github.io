var pinboard = document.getElementById('pinboard');
var canvasContainer = document.getElementById('canvas-container');

// ---------- UI

// switcher

pinboard.switch = id => {
    id.classList.toggle('hidden');
}

// closeOnOutside

var current_opened;
pinboard.show = open_id => {

    // if (current_opened === undefined) {
    //     current_opened = open_id;
    //     pinboard.switch(open_id);
    // } else if (current_opened === open_id) {
    //     pinboard.switch(open_id);
    // } else if (current_opened !== open_id) {
    //     pinboard.switch(current_opened);
    //     current_opened = open_id;
    //     pinboard.switch(open_id);
    // }

    current_opened = open_id;
    pinboard.switch(open_id);

    setTimeout(() => {
        document.addEventListener('click', pinboard.closeOnOutside);
    }, 0);
}

pinboard.closeOnOutside = event => {

    var arr = [];
    event.path.forEach(entry => {
        if (entry.id != '' && entry.id != undefined) {
            arr.push(entry.id);
        }
    });
    
    if (arr.includes(current_opened.id)) {
        return;
    } else {
        pinboard.switch(current_opened);
        document.removeEventListener('click', pinboard.closeOnOutside);
    }

}


// toastr

toastr.options.timeOut = 1000;