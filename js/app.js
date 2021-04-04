const containerImageDOOM = document.querySelector(".main-image");
const modalAddPhoto = document.querySelector(".modal-photo");

const form = document.querySelector(".form");
const inputAddImage = document.querySelector(".input-add-image");
const error = document.querySelector(".error");

const modal = document.querySelector('.modal');
const modalInsertImage = document.querySelector('.main-modal-image');

const nextImageDOM = document.querySelector('.next-image');
const prevImageDOM = document.querySelector('.prev-image');

const getLocalStorage = localStorage.getItem('photos');
let photos = getLocalStorage ? JSON.parse(localStorage.photos) : [];


const insertAllImageToDOM = photos => {
  photos.map(({ id, image }) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="remove-image" onClick="removeImage(${id})">❌</span>
      <img id="${id}" class="image" onClick="viewImage(${id})"src="${image}"></img>
    `
    containerImageDOOM.appendChild(li);
  });

}

const addImage = e => {
  e.preventDefault();
  const randomId = Math.floor(Math.random() * 9999)

  const inputImage = inputAddImage.value;

  const validate = validateAddImage(inputImage);
  if (!validate);

  const id = randomId;
  const { image } = validate;

  photos.push({
    id,
    image,
  });

  inputAddImage.value = '';
  init();
  closeModalAddPhoto();
  updateLocalStorage();
}

const removeImage = id => {
  photos = photos.filter(photo => photo.id !== id);
  init();
  updateLocalStorage();
}

const viewImage = id => {
  modal.style.display = "flex";
  const photo = photos.find(p => p.id == id);

  insertImageToModal(photo);

  return;
}

const insertImageToModal = ({id, image}) => {
  modalInsertImage.innerHTML = `
    <strong class="close-modal" onClick="closeModal()" >X</strong>
    <span class="prev-image arrow" onClick="prevImage(${id})">❮</span>
    <div class="modal-insert-image">
      <img class="modal-image" src="${image}"></img>
    </div>
    <span class="next-image arrow" onClick="nextImage(${id})">❯</span>
  `;
}

const nextImage = id => {
  const index = photos.findIndex(photo => photo.id == id);
  
  const photoNext = photos[index + 1];
  if (!photoNext) return;
  insertImageToModal(photoNext);

}

const prevImage = id => {
  const index = photos.findIndex(photo => photo.id == id);

  const photoNext = photos[index - 1];
  if (!photoNext) return;

  insertImageToModal(photoNext);
}

const validateAddImage = url => {
  const validate = url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);

  if (!validate) {
    viewError("insira uma url valida!");
    return;
  } else {
    error.innerHTML = '';
  }

  return {
    image: validate
  };
}

const viewError = (message) => {
  error.innerHTML = `<strong>${message}<strong/>` 
}

const updateLocalStorage = () => {
  localStorage.setItem('photos', JSON.stringify(photos));
}

const openModalAddPhoto = () => {
  modalAddPhoto.style.display = "flex";
}

const closeModalAddPhoto = () => {
  modalAddPhoto.style.display = "none";
}

const closeModal = () => {
  modal.style.display = "none";
}

const init = () => {
  containerImageDOOM.innerHTML = '';
  insertAllImageToDOM(photos);
}

nextImageDOM.addEventListener('click', () => nextImage());
prevImageDOM.addEventListener('click', () => prevImage());
form.addEventListener("submit", e => addImage(e));

init();
