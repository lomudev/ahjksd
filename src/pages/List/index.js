import * as React from "react"
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  TextInput,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
} from "react-native"
import { getProducts, typeUpdateSelected } from "../../redux/Action"
import { handleAsync } from "../../utils"
import { useSelector, useDispatch } from "react-redux"
import Ionicons from "@expo/vector-icons/Ionicons"

const windowWidth = Dimensions.get("window").width

const Scene = ({ navigation }) => {
  const [text, setText] = React.useState("")
  const [refreshing, setRefreshing] = React.useState(false)
  const dispatch = useDispatch()

  const products = useSelector((state) => state.product.data)

  console.log(products, "products")

  React.useEffect(() => {
    initfetch()
  }, [])

  const initfetch = async () => {
    setRefreshing(true)
    await handleAsync(dispatch(getProducts()))
    setRefreshing(false)
  }

  const navigateToCart = () => {
    return navigation.push("Cart")
  }

  const navigateToCreate = () => {
    return navigation.push("Create")
  }

  const navigateToDetail = (item) => {
    dispatch(typeUpdateSelected(item))
    return navigation.push("Detail")
  }

  const getData = () => {
    if (text) {
      return products.filter(
        (e) =>
          e.title.toLowerCase().includes(text.toLowerCase()) ||
          e.type.toLowerCase().includes(text.toLowerCase())
      )
    }
    return products
  }

  const _renderCard = ({ item }) => {
    return (
      <Pressable
        style={styles.section.container}
        onPress={() => navigateToDetail(item)}>
        <Image
          source={{
            uri: item.image,
          }}
          style={styles.section.image}
        />
        <View style={styles.section.subContainer}>
          <Text style={styles.section.title}>{item.title}</Text>
          <Text style={styles.section.desc}>{item.type}</Text>
          <Text style={styles.section.price}>${item.price}</Text>
        </View>
      </Pressable>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.subContainer}>
        <View style={styles.header}>
          <View style={styles.search}>
            <Ionicons
              size={18}
              name='md-search-outline'
              style={styles.iconSearch}
            />
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder={"Please type here…"}
            />
          </View>
          <Pressable style={styles.cart} onPress={navigateToCart}>
            <Ionicons
              size={18}
              color={"#fff"}
              name='md-cart'
              style={styles.iconSearch}
            />
          </Pressable>
          <Pressable style={styles.add} onPress={navigateToCreate}>
            <Ionicons
              size={18}
              color={"#fff"}
              name='md-add'
              style={styles.iconSearch}
            />
          </Pressable>
        </View>
        <FlatList
          data={getData()}
          renderItem={_renderCard}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          keyExtractor={(e, i) => i.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={initfetch} />
          }
        />
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
    marginHorizontal: 24,
    marginVertical: 16,
  },
  header: {
    flex: -1,
    marginBottom: 24,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  search: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 8,
    flexDirection: "row",
    backgroundColor: "rgba(221, 226, 232, 1)",
  },
  cart: {
    flex: -1,
    marginLeft: 16,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: "black",
  },
  add: {
    flex: -1,
    marginLeft: 8,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: "black",
  },
  iconSearch: { marginHorizontal: 8 },
  scroll: {
    flexWrap: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  section: {
    container: {
      flex: -1,
      borderRadius: 16,
      marginBottom: 24,
      backgroundColor: "#fff",
    },
    image: {
      borderRadius: 16,
      width: windowWidth * 0.4,
      height: windowWidth * 0.4,
    },
    subContainer: {
      justifyContent: "center",
      alignItems: "center",
      marginTop: 8,
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
    price: {
      marginTop: 4,
      fontSize: 14,
      fontFamily: "Oswald-Bold",
    },
  },
})

export default Scene
