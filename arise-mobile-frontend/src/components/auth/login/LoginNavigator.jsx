import { createStackNavigator } from 'react-navigation'
import LoginScreen from './LoginScreen'
import LoginFormScreen from './LoginFormScreen'

export default createStackNavigator(
  {
    Login: {
      screen: LoginScreen,
      navigationOptions: {
        header: null
      }
    },
    LoginForm: LoginFormScreen
  },
  {
    mode: 'modal',
    headerLayoutPreset: 'center'
  }
)
