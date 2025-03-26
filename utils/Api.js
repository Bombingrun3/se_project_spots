export class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, { headers: this._headers })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(`Error: ${res.status}`);
      })
      .then((data) => data)
      .catch((err) => Promise.reject(err));
  }

  getUserInfo() {}
  //   GET request

  editUserInfo() {}
  //   PATCH request

  addCard() {}
  // POST request

  deleteCard() {}
  //   DELETE request

  likeCard() {}

  dislikeCard() {}

  updateAvatar() {}
}
