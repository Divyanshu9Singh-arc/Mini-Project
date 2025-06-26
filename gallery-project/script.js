

const galleryItems = document.querySelectorAll('.gallery-item img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.close');
const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.prev');
const filterButtons = document.querySelectorAll('.filter-buttons button');

let currentIndex = 0;
let visibleImages = Array.from(galleryItems);


galleryItems.forEach((img, index) => {
  img.addEventListener('click', () => {
    currentIndex = index;
    showLightbox(img.src);
  });
});

function showLightbox(src) {
  lightbox.style.display = 'block';
  lightboxImg.src = src;
}


closeBtn.addEventListener('click', () => {
  lightbox.style.display = 'none';
});


nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % visibleImages.length;
  lightboxImg.src = visibleImages[currentIndex].src;
});


prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + visibleImages.length) % visibleImages.length;
  lightboxImg.src = visibleImages[currentIndex].src;
});


lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) lightbox.style.display = 'none';
});


filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    visibleImages = [];
    galleryItems.forEach(img => {
      const item = img.closest('.gallery-item');
      const category = item.dataset.category;
      if (filter === 'all' || category === filter) {
        item.style.display = 'block';
        visibleImages.push(img);
      } else {
        item.style.display = 'none';
      }
    });
  });
});
