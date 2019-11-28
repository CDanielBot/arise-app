import React from 'react'
import store from './src/state/store'
import { Provider } from 'react-redux'
import RootNavigator from './src/components/RootNavigator'
import './fb_config'
import { ThemeProvider } from 'styled-components/native'
import theme from './theme'
import applyAxiosMiddlewares from './src/utils/applyAxiosMiddlewares'
import * as Expo from 'expo'

applyAxiosMiddlewares()

// Removes warning for debug mode on testing. TODO: Remove this in production
import { YellowBox } from 'react-native'
import { Platform } from 'expo-core'
YellowBox.ignoreWarnings(['Remote debugger'])

class App extends React.Component {
  state = {
    fontsLoaded: false
  }

  async componentDidMount() {
    if (Platform.OS === 'ios') {
      await this.loadIosFonts()
    } else {
      await this.loadAndroidFonts()
    }

    this.setState({
      fontsLoaded: true
    })
  }

  loadIosFonts = async () => {
    await Expo.Font.loadAsync({
      'Font Awesome 5 Free': require('./node_modules/react-native-vector-icons/Fonts/FontAwesome5_Solid.ttf'),
      'Font Awesome 5 Brands': require('./node_modules/react-native-vector-icons/Fonts/FontAwesome5_Brands.ttf')
    })
  }

  loadAndroidFonts = async () => {
    await Expo.Font.loadAsync({
      Montserrat: require('./assets/fonts/Montserrat-Regular.otf'),
      'Montserrat-Medium': require('./assets/fonts/Montserrat-Medium.otf'),
      'Montserrat-Bold': require('./assets/fonts/Montserrat-Bold.otf'),

      FontAwesome5_Regular: require('./node_modules/react-native-vector-icons/Fonts/FontAwesome5_Regular.ttf'),
      FontAwesome5_Solid: require('./node_modules/react-native-vector-icons/Fonts/FontAwesome5_Solid.ttf'),
      FontAwesome5_Brands: require('./node_modules/react-native-vector-icons/Fonts/FontAwesome5_Brands.ttf')
    })
  }

  render() {
    if (!this.state.fontsLoaded) return <Expo.AppLoading />

    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <RootNavigator />
        </ThemeProvider>
      </Provider>
    )
  }
}

export default App
