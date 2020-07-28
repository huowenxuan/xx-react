import { combineReducers } from "redux";

const initialState = {
  userId: "",
  token: "",
  userName: "",
  phone: "",
  openid: "",
  avatar: "",
};

const login = (state = initialState, action) => {
  switch (action.type) {
    case "login":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default combineReducers({ login });
