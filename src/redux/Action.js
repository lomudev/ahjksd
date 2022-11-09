import axios from "axios"
import constant from "./constant"
import { transformProducts, transformCarts } from "./Transform"
const instance = axios.create({
  baseURL: "https://crudcrud.com/api/d3ffc3cb266f4b4fa4c224ec9df898c5",
  timeout: 1000,
})

export const typeUpdateData = (value) => {
  return {
    value,
    type: constant.UPDATE_DATA,
  }
}

export const typeUpdateSelected = (value) => {
  return {
    value,
    type: constant.UPDATE_SELECTED,
  }
}

export const typeUpdateCart = (value) => {
  return {
    value,
    type: constant.UPDATE_CART,
  }
}

export const getProducts = () => async (dispatch) => {
  try {
    const res = await instance({
      url: "/products",
      method: "get",
    })

    const data = transformProducts(res.data)

    await dispatch(typeUpdateData(data))

    return Promise.resolve(data)
  } catch (error) {
    console.log("Error getProducts", error)
    return Promise.reject(error)
  }
}

export const createProduct = (payload) => async (dispatch) => {
  try {
    const res = await instance({
      url: "/products",
      method: "post",
      data: payload.data,
    })

    return Promise.resolve(res.data)
  } catch (error) {
    console.log("Error getProducts", error)
    return Promise.reject(error)
  }
}

export const getCart = () => async (dispatch) => {
  try {
    const res = await instance({
      url: "/cart",
      method: "get",
    })

    const data = transformCarts(res.data)

    await dispatch(typeUpdateCart(data))

    return Promise.resolve(data)
  } catch (error) {
    console.log("Error getProducts", error)
    return Promise.reject(error)
  }
}

export const createCart = (payload) => async (dispatch) => {
  try {
    const res = await instance({
      url: "/cart",
      method: "post",
      data: payload.data,
    })

    return Promise.resolve(res.data)
  } catch (error) {
    console.log("Error getProducts", error)
    return Promise.reject(error)
  }
}

export const updateCart = (payload) => async (dispatch) => {
  try {
    const res = await instance({
      url: `/cart/${payload.patch}`,
      method: "put",
      data: payload.data,
    })

    await dispatch(getCart())

    return Promise.resolve(res.data)
  } catch (error) {
    console.log("Error getProducts", error)
    return Promise.reject(error)
  }
}

export const removeCart = (payload) => async (dispatch) => {
  try {
    const res = await instance({
      url: `/cart/${payload.patch}`,
      method: "delete",
    })

    await dispatch(getCart())

    return Promise.resolve(res.data)
  } catch (error) {
    console.log("Error getProducts", error)
    return Promise.reject(error)
  }
}
