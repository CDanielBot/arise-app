import React from 'react'
import { createBottomTabNavigator, createAppContainer } from 'react-navigation'
import HomeNavigator from './home/HomeNavigator'
import ProfileNavigator from './profile/ProfileNavigator'
import BibleNavigator from './bible/BibleNavigator'
import AddNavigator from './add/AddNavigator'

// styles
import { View, Text } from 'react-native'
import styled from 'styled-components/native'

import { EntypoIcon, Fa5Icon } from 'styled/icons'
import theme from 'theme'

const TabNavigator = createBottomTabNavigator(
  {
    Home: HomeNavigator,
    Bible: BibleNavigator,
    Add: AddNavigator,
    Notifications: () => (
      <Container>
        <Text>Notifications Screen</Text>
      </Container>
    ),
    Profile: ProfileNavigator
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ tintColor }) => {
        const { routeName } = navigation.state
        let routeIcon

        switch (routeName) {
          case 'Home': {
            routeIcon = <EntypoIcon size={27} color={tintColor} name="home" />
            return routeIcon
          }
          case 'Bible': {
            routeIcon = <Fa5Icon size={24} color={tintColor} name="bible" />
            return routeIcon
          }
          case 'Add': {
            routeIcon = <EntypoIcon size={35} color={tintColor} name="plus" />
            return routeIcon
          }
          case 'Notifications': {
            routeIcon = <Fa5Icon size={24} color={tintColor} name="bell" />
            return routeIcon
          }
          case 'Profile': {
            routeIcon = <Fa5Icon size={27} color={tintColor} name="user-circle" />
            return routeIcon
          }
        }
      }
    }),
    tabBarOptions: {
      activeTintColor: theme.primary,
      inactiveTintColor: theme.icon.medium,
      showLabel: false,
      style: {
        // borderTopColor: 'transparent',
        backgroundColor: 'rgba(249, 249, 249, 0.51)'
      }
    }
  }
)

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`

export default createAppContainer(TabNavigator)
