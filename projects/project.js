const lightbox = document.querySelector('.project_lightbox');
const lightboxImg = lightbox.querySelector('img');

// Cover and figure images can be clicked to enlarge them
document.querySelectorAll('.project_cover img, .project_figure img').forEach(img => {
  img.addEventListener('click', () => {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.showModal();
  });
});

//Clicking anywhere outside the image closes the enlargement (Escape key also works)
lightbox.addEventListener('click', () => lightbox.close());