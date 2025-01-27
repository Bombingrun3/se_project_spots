const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

const editProfileButton = document.querySelector(".profile__edit-button");
const editProfileModal = document.querySelector("#edit-profile-modal");
const closeProfileButton = editProfileModal.querySelector(
  ".modal__close-button"
);
const editProfileForm = editProfileModal.querySelector("#edit-profile-form");
const submitProfileButton = editProfileModal.querySelector(
  ".modal__submit-button"
);
const profile = document.querySelector(".profile");
const profileName = profile.querySelector(".profile__name");
const profileDescription = profile.querySelector(".profile__description");

const inputName = document.querySelector("#profile-name-input");
const inputDescription = document.querySelector("#profile-description-input");

const cardTemplate = document.querySelector("#card-template");
const galleryList = document.querySelector(".gallery__list");

const newPostModal = document.querySelector("#new-post-modal");
const newPostButton = profile.querySelector("#new-post-button");
const closeNewPostButton = newPostModal.querySelector("#close-new-post-button");

const newPostForm = newPostModal.querySelector("#new-post-form");
const inputImageLink = newPostForm.querySelector("#image-link-input");
const inputCaption = newPostForm.querySelector("#image-caption-input");

// -----Open/Close Modal (Universal)------

function openModal(modal) {
  modal.classList.add("modal_opened");
}

editProfileButton.addEventListener("click", () => {
  inputName.value = profileName.textContent;
  inputDescription.value = profileDescription.textContent;
  openModal(editProfileModal);
});

newPostButton.addEventListener("click", () => {
  openModal(newPostModal);
});

function closeModal(modal) {
  modal.classList.remove("modal_opened");
}

closeProfileButton.addEventListener("click", () => {
  closeModal(editProfileModal);
});

closeNewPostButton.addEventListener("click", () => {
  closeModal(newPostModal);
});

// -----Submit changes from Form and Close Modal-----

function handleFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = inputName.value;
  profileDescription.textContent = inputDescription.value;
  closeModal(editProfileModal);
}

editProfileForm.addEventListener("submit", handleFormSubmit);

// -----Add Cards with Template-----

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardDescription = cardElement.querySelector(".card__description");
  cardDescription.textContent = data.name;

  const cardImage = cardElement.querySelector(".card__image");
  cardImage.src = data.link;
  cardImage.alt = data.name;

  return cardElement;
}

initialCards.forEach((card) => {
  const cardElement = getCardElement(card);
  galleryList.prepend(cardElement);
});

// -----Submit New Post to Gallery-----

function handleNewPostSubmit(evt) {
  evt.preventDefault();
  const inputValues = {
    name: inputCaption.value,
    link: inputImageLink.value,
  };
  const cardElement = getCardElement(inputValues);
  galleryList.prepend(cardElement);

  closeModal(newPostModal);
}

newPostForm.addEventListener("submit", handleNewPostSubmit);
