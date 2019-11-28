import React from 'react'
import { AsyncStorage } from 'react-native'
import { LottieLoadingScreen } from 'shared'
import { connect } from 'react-redux'
import { initUserFromAsyncStorage } from 'ducks/authDuck'

class RootLoadingScree extends React.Component {
  constructor(props) {
    super(props)

    this.getUserFromAsyncStorage()
  }

  render() {
    return <LottieLoadingScreen />
  }

  getUserFromAsyncStorage = async () => {
    try {
      const auth = JSON.parse(await AsyncStorage.getItem('auth'))
      if (auth && auth.user) {
        this.props.initUserFromAsyncStorage(auth)
        this.props.navigation.navigate('App')
        return
      }

      this.props.navigation.navigate('Auth')
    } catch (error) {
      console.log(error)
    }
  }
}

export default connect(
  null,
  { initUserFromAsyncStorage }
)(RootLoadingScree)
