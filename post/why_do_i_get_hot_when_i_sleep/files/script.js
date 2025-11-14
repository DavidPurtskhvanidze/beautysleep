document.querySelectorAll('.post-product-card').forEach(card => {
    const colorButtons = card.querySelectorAll('.post-product-card-color');
    const sizeButtons = card.querySelectorAll('.post-product-card-size');
    const images = card.querySelectorAll('.post-product-card-picture img');

    const colorList = card.querySelector('.post-product-card-colors');
    // if (colorButtons.length > 3 && colorList) {
    //     colorList.classList.add('collapse');
    //     const moreBtn = document.createElement('div');
    //     moreBtn.className = 'card-color more-colors';
    //     moreBtn.textContent = `+${(colorButtons.length) - 2}`;
    //     colorList.querySelector('.post-product-card-colors-list').appendChild(moreBtn);
    //
    //     colorList.addEventListener('click', () => {
    //         colorList.classList.remove('collapse');
    //     });
    // }

    colorButtons.forEach(button => {

        button.addEventListener('click', () => {
            const selectedColor = button.getAttribute('data-color');

            colorButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            images.forEach(img => {
                if (img.getAttribute('data-color') === selectedColor) {
                    img.style.display = 'block';
                } else {
                    img.style.display = 'none';
                }
            });
        });
    });

    sizeButtons.forEach(button => {
        button.addEventListener('click', () => {
            sizeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
});