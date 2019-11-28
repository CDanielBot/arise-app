import { createStackNavigator } from 'react-navigation'
import AddScreen from './AddScreen'
import EvangelismRequestFormScreen from './EvangelismRequestFormScreen'
import PrayerFormScreen from './PrayerFormScreen'

export default createStackNavigator(
  {
    AddScreen: {
      screen: AddScreen,
      navigationOptions: {
        header: null
      }
    },
    EvangelismRequestForm: EvangelismRequestFormScreen,
    PrayerForm: PrayerFormScreen
  },
  {
    mode: 'modal',
    navigationOptions: ({ navigation }) => {
      let tabBarVisible = true
      if (navigation.state.index > 0) {
        tabBarVisible = false
      }

      return {
        tabBarVisible
      }
    },
    headerLayoutPreset: 'center'
  }
)
