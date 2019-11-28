import React from 'react'
import { View, Text, Button, StatusBar, Image } from 'react-native'
import styled from 'styled-components/native'
import * as authActions from 'ducks/authDuck'
import * as authSelectors from 'selectors/authSelectors'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { LoadingScreen } from 'shared'
import { Fa5Icon } from 'styled/icons'
import {
  PillButton,
  FacebookButton,
  GoogleButton,
  AnonymousButton,
  DividerWithText,
  Typography,
  FlatButton
} from 'styled'
import { LinearGradient } from 'expo'

class LoginScreen extends React.Component {
  state = {
    isLoading: false
  }

  render() {
    if (this.state.isLoading) return <LoadingScreen />

    return (
      <Container>
        <StatusBar barStyle="light-content" />

        <Header>
          <Image
            style={{ width: 500, height: 300, left: '-30%' }}
            source={require('./image.jpg')}
          />
          <HeaderBackground>
            <Typography
              style={{
                fontSize: 50,
                color: '#fff',
                marginBottom: 20
              }}
            >
              Arise
            </Typography>
          </HeaderBackground>
        </Header>

        <Content>
          <PillButton
            style={{ marginBottom: 16 }}
            onPress={this.navigateTo('LoginForm')}
            leftIcon={<Fa5Icon size={24} color="#fff" name="envelope" />}
          >
            Login with email
          </PillButton>

          <AnonymousButton style={{ marginBottom: 40 }}>Login anonymously</AnonymousButton>

          <DividerWithText style={{ marginBottom: 40, marginRight: 20, marginLeft: 20 }}>
            OR CONNECT WITH
          </DividerWithText>

          <ProviderButtonsContainer>
            <FacebookButton style={{ flex: 1, marginRight: 12 }} onPress={this.loginWithFacebook}>
              facebook
            </FacebookButton>

            <GoogleButton style={{ flex: 1, marginLeft: 12 }} onPress={this.loginWithGoogle}>
              google
            </GoogleButton>
          </ProviderButtonsContainer>
        </Content>

        <Footer>
          <Typography type="label" style={{ marginRight: 10 }}>
            Don't have an account?
          </Typography>
          <FlatButton onPress={this.navigateTo('Register')} color="#8A8A8F">
            Register Now
          </FlatButton>
        </Footer>
      </Container>
    )
  }

  navigateTo = screen => () => {
    const { navigate } = this.props.navigation
    navigate(screen)
  }

  loginWithFacebook = async () => {
    try {
      const { authActions } = this.props

      this.setState({ isLoading: true })
      await authActions.loginWithFacebook()
      this.navigateToAppContainer()
    } catch (error) {
      console.log(error)
      this.setState({ isLoading: false })
    }
  }

  loginWithGoogle = async () => {
    try {
      const { authActions } = this.props

      this.setState({ isLoading: true })
      await authActions.loginWithGoogle()
      this.navigateToAppContainer()
    } catch (error) {
      console.log(error)
      this.setState({ isLoading: false })
    }
  }

  navigateToAppContainer = () => {
    const { navigate } = this.props.navigation
    navigate('Home')
  }
}

const Container = styled.View`
  flex: 1;
`

const Content = styled.View`
  flex: 2;
  margin-top: 50;
  margin-left: 20;
  margin-right: 20;
`

const Header = styled.View`
  flex: 1;
  overflow: hidden;
  border-bottom-left-radius: 10;
  border-bottom-right-radius: 100;
  justify-content: center;

  /* Doesn't work with overflow */
  /* box-shadow: 0 5px 5px rgba(238,46,46, 0.35); */
`

const HeaderBackground = styled(LinearGradient).attrs(() => ({
  colors: ['rgba(360, 65, 56, 1)', 'rgba(360, 65, 56, 0.6)'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 2 }
}))`
  width: 100%;
  height: 100%;
  justify-content: flex-end;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`

const Footer = styled.View`
  flex-direction: row;
  margin-top: 20px;
  justify-content: center;
  align-items: center;
  margin-bottom: 40;
`

const ProviderButtonsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`

const mapState = state => ({
  user: authSelectors.getUser(state)
})

const mapDispatch = dispatch => ({
  authActions: bindActionCreators(authActions, dispatch)
})

export default connect(
  mapState,
  mapDispatch
)(LoginScreen)
