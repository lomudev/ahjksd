export const transformProducts = (result) => {
  return result.map((e) => transformProduct(e))
}

const transformProduct = (data) => ({
  _id: data._id,
  title: data.title,
  type: data.type,
  desc: data.desc,
  image: data.image,
  price: data.price,
  items: transformItems(data.item),
})

const transformItems = (items) => {
  return items.map((e) => ({
    _id: e._id,
    title: e.title,
    stock: e.stock,
  }))
}

export const transformCarts = (result) => {
  return result.map((e) => ({
    _id: e._id,
    product_id: e.product_id,
    item_id: e.item_id,
    stock: e.stock,
  }))
}
