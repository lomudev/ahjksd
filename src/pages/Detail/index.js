import * as React from "react"
import {
  StyleSheet,
  Text,
  Dimensions,
  View,
  Pressable,
  ImageBackground,
  SafeAreaView,
  ScrollView,
} from "react-native"
import { createCart } from "../../redux/Action"
import { useSelector, useDispatch } from "react-redux"
import Ionicons from "@expo/vector-icons/Ionicons"
const windowWidth = Dimensions.get("window").width

const Scene = ({ navigation }) => {
  const dispatch = useDispatch()
  const product = useSelector((state) => state.product.selected)
  const [item, setItem] = React.useState(product.items[0])
  const [counter, setCounter] = React.useState(0)

  const navigateBack = () => {
    return navigation.pop()
  }

  const onPressPlus = () => {
    setCounter((e) => {
      if (e + 1 >= item.stock) return item.stock
      return e + 1
    })
  }

  const onPressMin = () => {
    setCounter((e) => (e - 1 <= 0 ? 0 : e - 1))
  }

  const onPressAddToCart = () => {
    if (counter) {
      const data = {
        product_id: product._id,
        item_id: item._id,
        stock: counter,
      }

      dispatch(
        createCart({
          data,
        })
      )
      setCounter(0)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={{ uri: product.image }}
        resizeMode='cover'
        style={styles.imageBackground}>
        <Pressable onPress={navigateBack}>
          <Ionicons
            size={42}
            name='md-arrow-back-circle'
            style={styles.iconBack}
          />
        </Pressable>
      </ImageBackground>
      <View style={styles.subContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>{product.title}</Text>
              <Text style={styles.desc}>{product.type}</Text>
            </View>
            <View>
              <View style={styles.row}>
                <Pressable style={styles.plusContainer} onPress={onPressPlus}>
                  <Text style={styles.textCounter}>+</Text>
                </Pressable>
                <View style={styles.mainContainer}>
                  <Text style={styles.textCounter}>{counter}</Text>
                </View>
                <Pressable style={styles.minusContainer} onPress={onPressMin}>
                  <Text style={styles.textCounter}>-</Text>
                </Pressable>
              </View>
              <Text style={styles.textStock}>{item && item.stock} stock</Text>
            </View>
          </View>
          <Text style={styles.textTitle}>Size</Text>
          <View style={styles.sizeContainer}>
            {product.items &&
              product.items.map((e, i) => (
                <Pressable
                  key={i}
                  style={styles.size(item._id == e._id)}
                  onPress={() => {
                    setItem(e)
                    setCounter(0)
                  }}>
                  <Text style={styles.textSize(item._id == e._id)}>
                    {e.title}
                  </Text>
                </Pressable>
              ))}
          </View>
          <Text style={styles.textTitle}>Description</Text>
          <Text style={styles.note}>{product.desc}</Text>
        </ScrollView>
        <View style={styles.footer.container}>
          <View style={styles.footer.subContainer}>
            <Text style={styles.footer.textTotal}>Total Price</Text>
            <Text style={styles.footer.textPrice}>${product.price}</Text>
          </View>
          <Pressable
            style={styles.footer.button(counter == 0)}
            onPress={onPressAddToCart}>
            <Ionicons size={16} color={"#fff"} name='md-cart' />
            <Text style={styles.footer.textButton}>Add to Cart</Text>
          </Pressable>
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
  imageBackground: {
    height: windowWidth,
    width: windowWidth,
  },
  iconBack: {
    position: "absolute",
    top: 16,
    left: 16,
  },
  subContainer: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: -32,
    borderTopStartRadius: 24,
    borderTopEndRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    flex: -1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontFamily: "Oswald-Bold",
    lineHeight: 20,
  },
  desc: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 16,
    fontFamily: "Oswald-Light",
    color: "rgba(106, 116, 129, 1)",
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
  textStock: {
    fontFamily: "Oswald-Regular",
    textAlign: "right",
    fontSize: 10,
    marginTop: 4,
  },
  textTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 16,
    fontFamily: "Oswald-Bold",
    lineHeight: 20,
  },
  sizeContainer: {
    flex: -1,
    flexDirection: "row",
  },
  size: (isBold) => ({
    borderRadius: 32,
    width: 32,
    height: 32,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: isBold ? "black" : "rgba(221, 226, 232, 1)",
  }),
  textSize: (isBold) => ({
    fontFamily: `Oswald-${isBold ? "Bold" : "Regular"}`,
    fontSize: 12,
  }),
  note: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: "Oswald-Light",
    color: "rgba(31, 45, 61, 1)",
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
      fontSize: 8,
      lineHeight: 12,
      fontFamily: "Oswald-Light",
      color: "rgba(106, 116, 129, 1)",
    },
    textPrice: {
      fontSize: 16,
      fontFamily: "Oswald-Bold",
      lineHeight: 20,
    },
    button: (disabled) => ({
      flex: -1,
      backgroundColor: disabled ? "rgba(106, 116, 129, 1)" : "black",
      height: 48,
      borderRadius: 24,
      paddingHorizontal: 32,
      flexDirection: "row",
      alignItems: "center",
    }),
    textButton: {
      fontSize: 14,
      fontFamily: "Oswald-Bold",
      color: "#fff",
      marginLeft: 8,
    },
  },
})

export default Scene
