import { createStackNavigator } from 'react-navigation'
import BibleScreen from './BibleScreen'
import BookPickerScreen from './BookPickerScreen'
import VersionPickerScreen from './VersionPickerScreen'

export default createStackNavigator({
  Bible: {
    screen: BibleScreen,
    navigationOptions: {
      header: null
    }
  },
  BookPicker: BookPickerScreen,
  VersionPicker: VersionPickerScreen
})