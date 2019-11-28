import { createSwitchNavigator, createAppContainer } from 'react-navigation'
import AuthNavigator from './auth/AuthNavigator'
import AppNavigator from './app/AppNavigator'
import RootLoadingScreen from './RootLoadingScreen'

const RootNavigator = createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: RootLoadingScreen,
      App: AppNavigator,
      Auth: AuthNavigator
    },
    {
      initialRouteName: 'AuthLoading'
    }
  )
)

export default RootNavigator
