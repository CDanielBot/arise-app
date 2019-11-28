import React from 'react'
import LottieView from 'lottie-react-native'
import * as authActions from 'ducks/authDuck'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

// styled
import { Animated, Easing, View } from 'react-native'
import { Typography, FlatButton } from 'styled'
import styled from 'styled-components'
import theme from 'theme'

class RegisterFinalScreen extends React.Component {
  static navigationOptions = {
    header: null,
    gesturesEnabled: false
  }

  state = {
    progress: new Animated.Value(0),
    fadeAnimRegisterCompletedText: new Animated.Value(0),
    fadeAnimButton: new Animated.Value(0)
  }

  componentDidMount() {
    this.startAnimations()
  }

  render() {
    return (
      <Container>
        <LottieView progress={this.state.progress} source={require('./lottie_checkmark.json')} />

        <Footer>
          <Animated.View
            style={{ opacity: this.state.fadeAnimRegisterCompletedText, alignItems: 'stretch' }}
          >
            <Typography type="header">Registration Complete</Typography>

            <Animated.View style={{ opacity: this.state.fadeAnimButton }}>
              <FlatButton onPress={this.enterApp} color={theme.primary}>
                Enter App
              </FlatButton>
            </Animated.View>
          </Animated.View>
        </Footer>
      </Container>
    )
  }

  startAnimations = () => {
    Animated.sequence([
      Animated.delay(300),
      Animated.timing(this.state.progress, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear
      })
    ]).start(this.animateCompletedText)
  }

  animateCompletedText = () => {
    Animated.timing(this.state.fadeAnimRegisterCompletedText, {
      toValue: 1,
      duration: 300
    }).start(this.animateButton)
  }

  animateButton = () => {
    Animated.timing(this.state.fadeAnimButton, {
      toValue: 1,
      duration: 300
    }).start()
  }

  enterApp = async () => {
    try {
      const credentials = this.props.navigation.getParam('credentials')

      await this.props.authActions.loginWithEmailAndPassword(credentials)
      this.props.navigation.navigate('Home')
    } catch (error) {
      console.log(error)
    }
  }
}

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`

const Footer = styled.View`
  margin-top: 250;
  align-items: center;
`

const mapDispatch = dispatch => ({
  authActions: bindActionCreators(authActions, dispatch)
})

export default connect(
  null,
  mapDispatch
)(RegisterFinalScreen)
