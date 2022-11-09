import Constant from "./constant"
import { combineReducers } from "redux"

const INITIAL_STATE = {
  data: [],
  cart: [],
  selected: {},
}

const productReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case Constant.UPDATE_DATA:
      return {
        ...state,
        data: action.value,
      }
    case Constant.UPDATE_SELECTED:
      return {
        ...state,
        selected: action.value,
      }
    case Constant.UPDATE_CART:
      return {
        ...state,
        cart: action.value,
      }
    default:
      return state
  }
}

export default combineReducers({
  product: productReducer,
})
