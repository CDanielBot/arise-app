import React from 'react'
import { StatusBar, Platform } from 'react-native'

const tabWithStatusBarColor = barColor => Component =>
  class extends React.Component {
    componentDidMount() {
      this._navListener = this.props.navigation.addListener('didFocus', () => {
        switch (barColor) {
          case 'light': {
            StatusBar.setBarStyle('light-content')
            Platform.OS === 'android' && StatusBar.setBackgroundColor('#ffffff')
            break
          }
          case 'dark': {
            StatusBar.setBarStyle('dark-content')
            Platform.OS === 'android' && StatusBar.setBackgroundColor('#ffffff')
            break
          }
        }
      })
    }

    componentWillUnmount() {
      this._navListener.remove()
    }

    render() {
      return <Component {...this.props} />
    }
  }

export default tabWithStatusBarColor
