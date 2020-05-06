start.addEventListener('click', e => {
    start.classList.add('fadeout');
    circle.classList.add('fadeout');
    ui.style.display = 'block';
    setTimeout(() => {
        ui.classList.add('fadein');
        setTimeout(() => {
            showChest.style.display = 'block';
        }, 1500);
    }, 300);
})

showChest.onclick = e => {
    chest.style.display = 'block';
    setTimeout(() => {
        chest.classList.add('fadein');
        setTimeout(() => {
            chest.classList.add('fadeout');
            // chest.style.display = 'none';
            setTimeout(() => {
                chest.classList.remove('fadein');
                chest.classList.remove('fadeout');
            }, 1000);
        }, 2300);
    }, 300);
}