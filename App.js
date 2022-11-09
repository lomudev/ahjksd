import * as React from "react"
import { useFonts } from "expo-font"
import { Provider } from "react-redux"
import store from "./src/redux"
import { List, Detail, Cart } from "./src/pages"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

const Stack = createNativeStackNavigator()

const optionStackScreen = { headerShown: false }

const MyStack = () => {
  const [fontsLoaded] = useFonts({
    "Oswald-Regular": require("./assets/Oswald-Regular.ttf"),
    "Oswald-Bold": require("./assets/Oswald-Bold.ttf"),
    "Oswald-Light": require("./assets/Oswald-Light.ttf"),
  })

  if (!fontsLoaded) return null

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name='List'
            component={List}
            options={optionStackScreen}
          />
          <Stack.Screen
            name='Detail'
            component={Detail}
            options={optionStackScreen}
          />
          <Stack.Screen
            name='Cart'
            component={Cart}
            options={optionStackScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}

export default MyStack
