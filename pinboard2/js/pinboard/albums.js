function ViewAlbums() {
    $.ajax('/request/get_albums_board.php', {
        processData: false,
        success: function (response) {
            $('.albums').empty().append(response).hide().fadeIn();
        },
    });
}

function showAlbum(albumId) {
    $.ajax('request/get_album_board.php', {
        data: { id: albumId },
        type: 'post',
        success: function (response) {
            $('.albums').empty().append(response).hide().fadeIn();
        }
    })
}

var PinboarUploader = 1;
ViewAlbums();
