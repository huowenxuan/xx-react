import { combineReducers } from "redux";

const initialState = {
  userId: "",
  token: "",
  userName: "",
  phone: "",
  openid: "",
  avatar: "",
};

const draft = (state = initialState, action) => {
  switch (action.type) {
    case "login":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default combineReducers({ draft });
