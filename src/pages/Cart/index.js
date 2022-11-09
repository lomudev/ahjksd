import * as React from "react"
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  Pressable,
  FlatList,
  Image,
  RefreshControl,
} from "react-native"
import { getCart, updateCart, removeCart } from "../../redux/Action"
import { handleAsync } from "../../utils"
import Ionicons from "@expo/vector-icons/Ionicons"
import { useSelector, useDispatch } from "react-redux"

const windowWidth = Dimensions.get("window").width

const Scene = ({ navigation }) => {
  const dispatch = useDispatch()
  const [refreshing, setRefreshing] = React.useState(false)
  const products = useSelector((state) => state.product.data)
  const cart = useSelector((state) => state.product.cart)

  const navigateBack = () => {
    return navigation.pop()
  }

  React.useEffect(() => {
    initfetch()
  }, [])

  const initfetch = async () => {
    setRefreshing(true)
    await handleAsync(dispatch(getCart()))
    setRefreshing(false)
  }

  const getprice = () => {
    let total = 0
    for (let index = 0; index < cart.length; index++) {
      const element = cart[index]
      const product = products.find((e) => e._id == element.product_id)
      total = total + product.price * element.stock
    }
    return total
  }

  const getDetail = (id, item_id) => {
    const product = products.find((e) => e._id == id)
    if (item_id) {
      return product.items.find((e) => e._id == item_id)
    }
    return product
  }

  const onPressPlus = async (item) => {
    const result = getDetail(item.product_id, item.item_id)
    if (result.stock >= item.stock + 1) {
      setRefreshing(true)
      await handleAsync(
        dispatch(
          updateCart({
            patch: item._id,
            data: {
              product_id: item.product_id,
              item_id: item.item_id,
              stock: item.stock + 1,
            },
          })
        )
      )
      setRefreshing(false)
    }
  }

  const onPressMin = async (item) => {
    if (0 < item.stock - 1) {
      setRefreshing(true)
      await handleAsync(
        dispatch(
          updateCart({
            patch: item._id,
            data: {
              product_id: item.product_id,
              item_id: item.item_id,
              stock: item.stock - 1,
            },
          })
        )
      )
      setRefreshing(false)
    } else {
      onPressRemove()
    }
  }

  const onPressRemove = async (item) => {
    setRefreshing(true)
    await handleAsync(
      dispatch(
        removeCart({
          patch: item._id,
        })
      )
    )
    setRefreshing(false)
  }

  const _renderCard = ({ item, index }) => {
    const product = getDetail(item.product_id)
    const itemProduct = getDetail(item.product_id, item.item_id)
    return (
      <View style={styles.card.container(index + 1 == cart.length)}>
        <View style={styles.card.sectionImage}>
          <Image
            source={{
              uri: product.image,
            }}
            style={styles.card.image}
          />
        </View>
        <View style={styles.card.subContainer}>
          <View>
            <View style={styles.card.rowTitle}>
              <Text style={styles.card.title}>{product.title}</Text>
              <Pressable onPress={() => onPressRemove(item)}>
                <Ionicons size={16} name='md-trash-outline' />
              </Pressable>
            </View>
            <Text style={styles.card.desc}>{product.type}</Text>
            <Text style={styles.card.stock}>{itemProduct.stock} Stock</Text>
          </View>
          <View style={styles.card.footer}>
            <Text style={styles.card.price}>${item.stock * product.price}</Text>
            <View style={styles.card.row}>
              <Pressable
                style={styles.card.plusContainer}
                onPress={() => onPressPlus(item)}>
                <Text style={styles.card.textCounter}>+</Text>
              </Pressable>
              <View style={styles.card.mainContainer}>
                <Text style={styles.card.textCounter}>{item.stock}</Text>
              </View>
              <Pressable
                style={styles.card.minusContainer}
                onPress={() => onPressMin(item)}>
                <Text style={styles.card.textCounter}>-</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    )
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.subContainer}>
        <Pressable onPress={navigateBack}>
          <Ionicons
            size={42}
            name='md-arrow-back-circle'
            style={styles.iconBack}
          />
        </Pressable>
        <Text style={styles.title}>My Cart</Text>
        <FlatList
          data={cart}
          renderItem={_renderCard}
          showsVerticalScrollIndicator={false}
          keyExtractor={(e, i) => i.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={initfetch} />
          }
        />
        <View style={styles.footer.container}>
          <View style={styles.footer.subContainer}>
            <Text style={styles.footer.textTotal}>Total Price</Text>
            <Text style={styles.footer.textPrice}>${getprice()}</Text>
          </View>
          <View style={styles.footer.button}>
            <Ionicons size={16} color={"#fff"} name='md-cart' />
            <Text style={styles.footer.textButton}>Processd to Checkout</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  subContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  iconBack: {
    marginTop: 16,
  },
  title: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 8,
    lineHeight: 20,
    fontFamily: "Oswald-Bold",
  },
  card: {
    container: (isLast) => ({
      flex: -1,
      flexDirection: "row",
      marginVertical: 8,
      paddingBottom: 8,
      borderBottomWidth: isLast ? 0 : 1,
      borderBottomColor: "rgba(221, 226, 232, 1)",
    }),
    sectionImage: {
      marginRight: 8,
    },
    image: {
      borderRadius: 10,
      width: windowWidth * 0.2,
      height: windowWidth * 0.2,
    },
    subContainer: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "space-between",
    },
    rowTitle: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    title: {
      fontSize: 14,
      fontFamily: "Oswald-Bold",
      lineHeight: 18,
    },
    desc: {
      fontSize: 10,
      lineHeight: 14,
      fontFamily: "Oswald-Light",
      color: "rgba(106, 116, 129, 1)",
    },
    stock: {
      fontSize: 8,
      lineHeight: 12,
      fontFamily: "Oswald-Light",
    },
    footer: {
      flex: -1,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    price: {
      marginTop: 4,
      fontSize: 14,
      fontFamily: "Oswald-Bold",
    },
    row: { flexDirection: "row" },
    plusContainer: {
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderTopStartRadius: 8,
      borderBottomStartRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(221, 226, 232, 1)",
    },
    mainContainer: {
      paddingVertical: 4,
      paddingHorizontal: 8,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(221, 226, 232, 1)",
    },
    minusContainer: {
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderTopEndRadius: 8,
      borderBottomEndRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(221, 226, 232, 1)",
    },
    textCounter: { fontFamily: "Oswald-Regular" },
  },
  footer: {
    container: {
      position: "absolute",
      bottom: 0,
      right: 0,
      left: 0,
      flex: -1,
      paddingHorizontal: 24,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    subContainer: {
      flex: -1,
    },
    textTotal: {
      fontSize: 10,
      lineHeight: 14,
      fontFamily: "Oswald-Light",
      color: "rgba(106, 116, 129, 1)",
    },
    textPrice: {
      fontSize: 22,
      fontFamily: "Oswald-Bold",
      lineHeight: 26,
    },
    button: {
      flex: -1,
      backgroundColor: "black",
      height: 48,
      borderRadius: 24,
      paddingHorizontal: 32,
      flexDirection: "row",
      alignItems: "center",
    },
    textButton: {
      fontSize: 14,
      fontFamily: "Oswald-Bold",
      color: "#fff",
      marginLeft: 8,
    },
  },
})

export default Scene
