import { createStackNavigator } from 'react-navigation'
import RegisterNavigator from './register/RegisterNavigator'
import LoginNavigator from './login/LoginNavigator'

export default createStackNavigator(
  {
    Login: LoginNavigator,
    Register: RegisterNavigator
    // navigationOptions: {
    //   header: null
    // }
  },
  {
    mode: 'modal',
    headerMode: 'none'
  }
)
