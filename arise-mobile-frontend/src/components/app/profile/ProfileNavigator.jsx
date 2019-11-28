import { createStackNavigator } from 'react-navigation'
import { fromBottom, fromRight } from 'react-navigation-transitions'
import ProfileScreen from './ProfileScreen'
import SettingsScreen from './SettingsScreen'
import ProfileSettingsScreen from './ProfileSettingsScreen'
import ResetPasswordScreen from './ResetPasswordScreen'
import MyPrayersScreen from './MyPrayersScreen'
import MyEvangelismRequestsScreen from './MyEvangelismRequestsScreen'
import EvangelismRequestForm from '../add/EvangelismRequestFormScreen'
import ContentScreen from '../home/ContentScreen'

const transitionTime = 350

const applyCustomTransitions = ({ scenes }) => {
  const prevScene = scenes[scenes.length - 2]
  const nextScene = scenes[scenes.length - 1]

  if (
    prevScene &&
    prevScene.route.routeName === 'MyEvangelismRequests' &&
    nextScene.route.routeName === 'EvangelismRequestForm'
  ) {
    return fromBottom(500)
  }

  return fromRight(transitionTime)
}

export default createStackNavigator(
  {
    Profile: {
      screen: ProfileScreen,
      navigationOptions: {
        header: null
      }
    },
    Settings: SettingsScreen,
    ProfileSettings: ProfileSettingsScreen,
    ResetPassword: ResetPasswordScreen,
    Prayers: MyPrayersScreen,
    MyEvangelismRequests: MyEvangelismRequestsScreen,
    EvangelismRequestForm: EvangelismRequestForm,
    Content: ContentScreen
  },
  {
    navigationOptions: ({ navigation }) => {
      let tabBarVisible = true
      if (navigation.state.index > 0) {
        tabBarVisible = false
      }

      return {
        tabBarVisible
      }
    },
    // transitionConfig: () => fromRight(350),
    transitionConfig: navigation => applyCustomTransitions(navigation),
    headerLayoutPreset: 'center'
  }
)
