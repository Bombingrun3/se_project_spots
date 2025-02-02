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
  {
    name: "Golden Gate Bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
];

const editProfileButton = document.querySelector(".profile__edit-button");
const editProfileModal = document.querySelector("#edit-profile-modal");

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

const newPostForm = newPostModal.querySelector("#new-post-form");
const inputImageLink = newPostForm.querySelector("#image-link-input");
const inputCaption = newPostForm.querySelector("#image-caption-input");

const previewModal = document.querySelector("#preview-modal");
const previewModalImage = previewModal.querySelector(".modal__image");
const previewModalCaption = previewModal.querySelector(".modal__caption");

const closeButtons = document.querySelectorAll(".modal__close-button");

// -----Open Modal (Universal)------

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

// -----Close Modal (Universal)------

function closeModal(modal) {
  modal.classList.remove("modal_opened");
}
closeButtons.forEach((button) => {
  const modal = button.closest(".modal");

  button.addEventListener("click", () => closeModal(modal));
});

// -----Submit changes from Form and Close Modal-----

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = inputName.value;
  profileDescription.textContent = inputDescription.value;
  closeModal(editProfileModal);
}

editProfileForm.addEventListener("submit", handleProfileFormSubmit);

// -----Add New Cards with Template-----

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardDescription = cardElement.querySelector(".card__description");
  cardDescription.textContent = data.name;

  const cardImage = cardElement.querySelector(".card__image");
  cardImage.src = data.link;
  cardImage.alt = data.name;

  // -----Like Cards Feature-----

  const cardLikeButton = cardElement.querySelector("#like-button");

  cardLikeButton.addEventListener("click", () => {
    cardLikeButton.classList.toggle("card__like-button_liked");
  });

  // -----Delete Cards Feature-----

  const cardDeleteButton = cardElement.querySelector("#delete-button");

  cardDeleteButton.addEventListener("click", () => {
    cardElement.remove();
  });

  // -----Open Preview Modal-----

  cardImage.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImage.src = data.link;
    previewModalImage.alt = data.name;
    previewModalCaption.textContent = data.name;
  });

  return cardElement;
}

initialCards.forEach((card) => {
  const cardElement = getCardElement(card);
  galleryList.prepend(cardElement);
});

// -----Submit New Post to Gallery-----

function handleNewPostFormSubmit(evt) {
  evt.preventDefault();
  const inputValues = {
    name: inputCaption.value,
    link: inputImageLink.value,
  };
  const cardElement = getCardElement(inputValues);
  galleryList.prepend(cardElement);

  closeModal(newPostModal);
  newPostForm.reset();
}

newPostForm.addEventListener("submit", handleNewPostFormSubmit);

// -----Close Modal with "Esc" Key-----

function closeModalOnEsc(evt) {
  if (evt.key === "Escape") {
    const openedModal =
      document.querySelector.classList.contains(".modal_opened");
    closeModal(openedModal);
    console.log(evt.key);
  }
}

openedModal.addEventListener("keydown", () => {
  closeModalOnEsc(evt);
});

// config object

const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__button",
  inactiveButtonClass: "modal__button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

enableValidation(settings);
