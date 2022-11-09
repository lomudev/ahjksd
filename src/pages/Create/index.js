import * as React from "react"
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  Pressable,
  ScrollView,
  Image,
  RefreshControl,
} from "react-native"
import { handleAsync } from "../../utils"
import { createProduct } from "../../redux/Action"
import Ionicons from "@expo/vector-icons/Ionicons"
import { useDispatch } from "react-redux"
import AnimatedInput from "react-native-animated-input"

const windowWidth = Dimensions.get("window").width

const unix = () => String(Math.round(new Date().getTime() / 1000))

const Scene = ({ navigation }) => {
  const dispatch = useDispatch()

  const [refreshing, setRefreshing] = React.useState(false)
  const [title, setTitle] = React.useState("")
  const [type, setType] = React.useState("")
  const [desc, setDesc] = React.useState("")
  const [price, setPrice] = React.useState("0")
  const [image, setImage] = React.useState("")
  const [item, setItem] = React.useState([
    {
      _id: unix(),
      title: "",
      stock: 0,
    },
  ])

  const navigateBack = () => {
    return navigation.pop()
  }

  const addItem = () => {
    const newItem = [...item]
    newItem.push({
      _id: unix(),
      title: "",
      stock: 0,
    })
    setItem(newItem)
  }

  const onChangeItem = (_id, name, value) => {
    const newItem = [...item]
    for (let index = 0; index < newItem.length; index++) {
      const element = { ...newItem[index] }
      if (element._id == _id) {
        if (name == "stock") {
          const newValue = value.replace(/\D+/g, "")
          if (newValue != element.stock) {
            if (newValue) {
              element[name] = newValue
            } else if (value == "") {
              element[name] = 0
            }
          }
        } else {
          element[name] = value
        }
        newItem[index] = element
      }
    }
    setItem(newItem)
  }

  const onSetprice = (value) => {
    const newValue = value.replace(/\D+/g, "")
    if (newValue != price) {
      if (newValue) {
        return setPrice(newValue)
      } else if (newValue == "") {
        return setPrice(0)
      }
    }
  }

  const getDisabled = () => {
    if (title && type && desc && price && image && item[0].stock) {
      return false
    }
    return true
  }

  const onCreateProduct = async () => {
    setRefreshing(true)
    await handleAsync(
      dispatch(
        createProduct({
          data: {
            title: title,
            type: type,
            desc: desc,
            price: parseInt(price),
            image: image,
            item: item.map((e) => {
              e.stock = parseInt(e.stock)
              return e
            }),
          },
        })
      )
    )
    clear()
    setRefreshing(false)
  }

  const clear = () => {
    setTitle("")
    setType("")
    setDesc("")
    setPrice(0)
    setImage("")
    setItem([
      {
        _id: unix(),
        title: "",
        stock: 0,
      },
    ])
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
        <ScrollView
          style={styles.section}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={clear} />
          }>
          <AnimatedInput
            value={title}
            onChangeText={setTitle}
            placeholder={"Title"}
            styleLabel={styles.styleLabel}
            styleInput={styles.styleLabel}
          />
          <AnimatedInput
            value={type}
            onChangeText={setType}
            placeholder={"Type"}
            styleLabel={styles.styleLabel}
            styleInput={styles.styleLabel}
          />
          <AnimatedInput
            value={desc}
            onChangeText={setDesc}
            placeholder={"Desc"}
            styleLabel={styles.styleLabel}
            styleInput={styles.styleLabel}
          />
          <AnimatedInput
            value={price}
            onChangeText={onSetprice}
            placeholder={"Price"}
            styleLabel={styles.styleLabel}
            styleInput={styles.styleLabel}
          />
          <AnimatedInput
            value={image}
            onChangeText={setImage}
            placeholder={"Image"}
            styleLabel={styles.styleLabel}
            styleInput={styles.styleLabel}
          />
          <View style={styles.item}>
            <Text style={styles.textTitle}>Item</Text>
            <Pressable style={styles.buttonItem} onPress={addItem}>
              <Text style={styles.buttonItemText}>Add</Text>
            </Pressable>
          </View>

          {item.map((e, i) => (
            <View style={styles.itemSection} key={i}>
              <View style={styles.itemLeft}>
                <AnimatedInput
                  value={e.title}
                  onChangeText={(v) => onChangeItem(e._id, "title", v)}
                  placeholder={"Size"}
                  styleLabel={styles.styleLabel}
                  styleInput={styles.styleLabel}
                />
              </View>
              <View style={styles.itemRight}>
                <AnimatedInput
                  value={e.stock}
                  onChangeText={(v) => onChangeItem(e._id, "stock", v)}
                  placeholder={"Stock"}
                  styleLabel={styles.styleLabel}
                  styleInput={styles.styleLabel}
                />
              </View>
            </View>
          ))}
        </ScrollView>
        <Pressable
          disabled={getDisabled()}
          onPress={onCreateProduct}
          style={styles.button(getDisabled())}>
          <Text style={styles.buttonText}>Create</Text>
        </Pressable>
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
    marginVertical: 16,
  },
  textTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 16,
    fontFamily: "Oswald-Bold",
    lineHeight: 20,
  },
  styleLabel: {
    fontSize: 14,
    fontFamily: "Oswald-Light",
  },
  label: {
    marginBottom: 16,
  },
  section: {
    flex: 1,
  },
  item: {
    flex: -1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonItem: {
    backgroundColor: "black",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonItemText: {
    fontSize: 12,
    fontFamily: "Oswald-Bold",
    color: "#fff",
  },
  itemSection: {
    flex: -1,
    flexDirection: "row",
  },
  itemLeft: {
    flex: 1,
    marginRight: 16,
  },
  itemRight: {
    flex: 1,
  },
  button: (disabled) => ({
    flex: -1,
    backgroundColor: disabled ? "rgba(106, 116, 129, 1)" : "black",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  }),
  buttonText: {
    fontSize: 14,
    fontFamily: "Oswald-Bold",
    color: "#fff",
  },
})

export default Scene
