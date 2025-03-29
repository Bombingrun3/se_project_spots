import "../pages/index.css";
import {
  enableValidation,
  settings,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";
import { Api } from "../../utils/Api.js";

const editProfileButton = document.querySelector(".profile__edit-button");
const editProfileModal = document.querySelector("#edit-profile-modal");

const editAvatarButton = document.querySelector(".profile__avatar-edit-button");
const editAvatarModal = document.querySelector("#edit-avatar-modal");
const inputAvatarLink = document.querySelector("#avatar-image-input");
const submitAvatarButton = editAvatarModal.querySelector(
  ".modal__submit-button"
);
const editAvatarForm = editAvatarModal.querySelector("#edit-avatar-form");

const cancelModal = document.querySelector("#cancel-modal");
const cancelModalCloseButton = cancelModal.querySelector(
  "#close-cancel-button"
);
const cancelModalDeleteButton = cancelModal.querySelector(
  "#delete-cancel-button"
);
const cancelModalCancelButton = cancelModal.querySelector(
  "#cancel-cancel-button"
);

const editProfileForm = editProfileModal.querySelector("#edit-profile-form");
const submitProfileButton = editProfileModal.querySelector(
  ".modal__submit-button"
);
const profile = document.querySelector(".profile");
const profileName = profile.querySelector(".profile__name");
const profileDescription = profile.querySelector(".profile__description");
const profileAvatar = profile.querySelector(".profile__avatar-image");

const inputName = document.querySelector("#profile-name-input");
const inputDescription = document.querySelector("#profile-description-input");

const cardTemplate = document.querySelector("#card-template");
const galleryList = document.querySelector(".gallery__list");

const newPostModal = document.querySelector("#new-post-modal");
const newPostButton = profile.querySelector("#new-post-button");

const newPostForm = newPostModal.querySelector("#new-post-form");
const inputImageLink = newPostForm.querySelector("#image-link-input");
const inputCaption = newPostForm.querySelector("#image-caption-input");
const newPostSubmitButton = newPostForm.querySelector(".modal__submit-button");

const previewModal = document.querySelector("#preview-modal");
const previewModalImage = previewModal.querySelector(".modal__image");
const previewModalCaption = previewModal.querySelector(".modal__caption");

const closeButtons = document.querySelectorAll(".modal__close-button");

let cardToDelete = null;
let cardIdToDelete = null;

let userId;

// -----Open Modal (Universal)------

function openModal(modal) {
  modal.classList.add("modal_opened");

  document.addEventListener("keydown", closeModalOnEsc);
}

editProfileButton.addEventListener("click", () => {
  inputName.value = profileName.textContent;
  inputDescription.value = profileDescription.textContent;
  openModal(editProfileModal);
  resetValidation(editProfileForm, [inputName, inputDescription], settings);
});

newPostButton.addEventListener("click", () => {
  openModal(newPostModal);
});

editAvatarButton.addEventListener("click", () => {
  inputAvatarLink.value = profileAvatar.src;
  openModal(editAvatarModal);
  resetValidation(editAvatarForm, [inputAvatarLink], settings);
});

// -----Close Modal (Universal)------

function closeModal(modal) {
  modal.classList.remove("modal_opened");

  document.removeEventListener("keydown", closeModalOnEsc);
}

closeButtons.forEach((button) => {
  const modal = button.closest(".modal");

  button.addEventListener("click", () => closeModal(modal));
});

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

  const cardLikeButton = cardElement.querySelector(".card__like-button");

  if (data.isLiked) {
    cardLikeButton.classList.add("card__like-button_liked");
  }

  cardLikeButton.addEventListener("click", () => {
    const isCurrentlyLiked = cardLikeButton.classList.contains(
      "card__like-button_liked"
    );
    if (isCurrentlyLiked) {
      api
        .dislikeCard(data._id)
        .then((updatedCard) => {
          cardLikeButton.classList.remove("card__like-button_liked");
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      api
        .likeCard(data._id)
        .then((updatedCard) => {
          cardLikeButton.classList.add("card__like-button_liked");
        })
        .catch((err) => {
          console.error("Error updating like status:", err);
        });
    }
  });

  // -----Delete Card Feature-----

  const cardDeleteButton = cardElement.querySelector("#delete-button");
  cardDeleteButton.addEventListener("click", () => {
    handleCardDelete(cardElement, data._id);
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

// -----Close Modal on Click-----

const closeModalOnClick = () => {
  const modals = document.querySelectorAll(".modal");
  modals.forEach((modal) => {
    modal.addEventListener("click", function (event) {
      if (event.target.classList.contains("modal")) {
        closeModal(modal);
      }
    });
  });
};

closeModalOnClick();

// -----Close Modal with "Esc" Key-----

function closeModalOnEsc(evt) {
  if (evt.key === "Escape") {
    const modal = document.querySelector(".modal_opened");
    closeModal(modal);
  }
}

enableValidation(settings);

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "1c9b6b75-fdbb-45e6-b261-c4a3ce5c7c23",
    "Content-Type": "application/json",
  },
});

api
  .getUserInfo()
  .then((userData) => {
    profileName.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.src = userData.avatar;
    userId = userData._id;

    return api.getInitialCards();
  })
  .then((initialCards) => {
    initialCards.forEach((card) => {
      const cardElement = getCardElement(card);
      galleryList.prepend(cardElement);
    });
  })
  .catch((err) => {
    console.error(err);
  });

// -----Submit New Post to Gallery-----

function handleNewPostFormSubmit(evt) {
  evt.preventDefault();
  const originalNewPostSubmitButton = newPostSubmitButton.textContent;
  const inputValues = {
    name: inputCaption.value,
    link: inputImageLink.value,
  };
  newPostSubmitButton.textContent = "Saving...";
  api
    .addCard(inputValues)
    .then((newCardData) => {
      const newCard = getCardElement(newCardData);
      return galleryList.prepend(newCard);
    })
    .then(() => {
      closeModal(newPostModal);
      newPostForm.reset();
      disableButton(newPostSubmitButton, settings);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      newPostSubmitButton.textContent = originalNewPostSubmitButton;
    });
}

newPostForm.addEventListener("submit", handleNewPostFormSubmit);

// -----Submit changes from Form and Close Edit Avatar Modal-----

function handleAvatarFormSubmit(evt) {
  evt.preventDefault();
  const originalSubmitAvatarButton = submitAvatarButton.textContent;
  const errorElement = document.querySelector("#avatar-image-input-error");
  errorElement.textContent = "";
  submitAvatarButton.textContent = "Saving...";
  const newAvatarUrl = inputAvatarLink.value;

  if (!newAvatarUrl) {
    errorElement.textContent = "Please enter a valid URL";
    return;
  }
  api
    .updateAvatar(newAvatarUrl)
    .then((updatedUserData) => {
      profileAvatar.src = updatedUserData.avatar;
      editAvatarForm.reset();
      closeModal(editAvatarModal);
      disableButton(submitAvatarButton, settings);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      submitAvatarButton.textContent = originalSubmitAvatarButton;
    });
}

editAvatarForm.addEventListener("submit", handleAvatarFormSubmit);

// -----Submit changes from Form and Close Edit Profile Modal-----

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  const name = inputName.value;
  const about = inputDescription.value;
  const originalSubmitProfileButton = submitProfileButton.textContent;
  submitProfileButton.textContent = "Saving...";

  api
    .editUserInfo({ name, about })
    .then((userData) => {
      profileName.textContent = userData.name;
      profileDescription.textContent = userData.about;
      submitProfileButton.textContent = originalSubmitProfileButton;
      closeModal(editProfileModal);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      submitProfileButton.textContent = originalSubmitProfileButton;
    });
}

editProfileForm.addEventListener("submit", handleProfileFormSubmit);

// -----Delete Cards Feature with API-----

function handleCardDelete(cardElement, cardId) {
  cardToDelete = cardElement;
  cardIdToDelete = cardId;
  openModal(cancelModal);
}

cancelModalDeleteButton.addEventListener("click", () => {
  const originalButtonText = cancelModalDeleteButton.textContent;
  cancelModalDeleteButton.textContent = "Deleting...";
  cancelModalDeleteButton.disabled = true;
  api
    .deleteCard(cardIdToDelete)
    .then(() => {
      cardToDelete.remove();
      closeModal(cancelModal);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      cancelModalDeleteButton.textContent = originalButtonText;
      cancelModalDeleteButton.disabled = false;
    });
});
cancelModalCancelButton.addEventListener("click", () => {
  closeModal(cancelModal);
  cardToDelete = null;
  cardIdToDelete = null;
});
