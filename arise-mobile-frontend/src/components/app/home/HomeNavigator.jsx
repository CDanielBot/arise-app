import { createStackNavigator } from 'react-navigation'
import HomeScreen from './HomeScreen'
import ContentScreen from './ContentScreen'
import { fromRight } from 'react-navigation-transitions'
import CommentsScreen from './comments/CommentsScreen'

export default createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        // headerStyle: {
        //   borderBottomWidth: 0,
        //   height: 0
        // }
        header: null
      }
    },

    Content: ContentScreen,
    Comments: CommentsScreen
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
    transitionConfig: () => fromRight(350)
  }
)
