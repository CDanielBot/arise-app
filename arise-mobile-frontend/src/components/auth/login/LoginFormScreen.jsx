import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from 'ducks/authDuck'
import * as yup from 'yup'
import { HeaderBackButton } from 'shared'

// styles
import styled from 'styled-components'
import { View, StatusBar, Keyboard, TouchableWithoutFeedback } from 'react-native'
import { Typography, PillButton, Input } from 'styled'
import { Fa5Icon } from 'styled/icons'

const validationSchema = yup.object().shape({
  Password: yup.string().min(6),
  Email: yup
    .string()
    .email()
    .required()
})

class LoginFormScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Login',
    headerLeft: <HeaderBackButton navigation={navigation} text="Cancel" />,
    headerStyle: {
      borderBottomWidth: 0,
      elevation: 0
    }
  })

  state = {
    form: {
      email: '',
      password: ''
    },
    loading: false,
    error: ''
  }

  errorTimer = null

  componentWillUnmount() {
    this.errorTimer && clearTimeout(this.errorTimer)
  }

  onInputChange = inputName => text => {
    this.setState(prevState => ({
      form: {
        ...prevState.form,
        [inputName]: text
      }
    }))
  }

  dismissKeyboard = () => {
    Keyboard.dismiss()
  }

  validateAndLogin = async () => {
    try {
      const { form } = this.state

      await validationSchema.validate({
        Email: form.email,
        Password: form.password
      })
      this.hideErrorMessage()

      this.setState({ loading: true })
      await this.props.authActions.loginWithEmailAndPassword(this.state.form)
      this.props.navigation.navigate('Home')
    } catch (error) {
      this.setState({ loading: false })
      this.showErrorMessage(error.message)
    }
  }

  hideErrorMessage = () => {
    if (this.errorTimer) {
      clearTimeout(this.errorTimer)
      this.setState({ error: '' })
    }
  }

  showErrorMessage = message => {
    this.errorTimer && clearTimeout(this.errorTimer)

    this.setState(
      {
        error: message
      },
      () => {
        this.errorTimer = setTimeout(() => {
          this.setState({ error: '' })
        }, 5000)
      }
    )
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.dismissKeyboard}>
        <Container>
          <StatusBar barStyle="default" />

          <Content>
            <Title type="title">Login</Title>

            <FormInput
              autoCapitalize="none"
              keyboardType="email-address"
              icon={<Fa5Icon size={20} name="envelope" color="#C8C7CC" />}
              placeholder="Email address"
              onChangeText={this.onInputChange('email')}
            />
            <FormInput
              autoCapitalize="none"
              secureTextEntry
              icon={<Fa5Icon size={20} name="lock" color="#C8C7CC" />}
              placeholder="Password"
              onChangeText={this.onInputChange('password')}
            />

            {/* TODO: Replace with Button */}
            <ForgotLabel>Forgot password?</ForgotLabel>
          </Content>

          <Footer>
            {this.state.error ? <ErrorMessage>{this.state.error}</ErrorMessage> : null}
            <PillButton
              loading={this.state.loading}
              onPress={this.validateAndLogin}
              shadow
              style={{ alignSelf: 'stretch' }}
            >
              Login
            </PillButton>
          </Footer>
        </Container>
      </TouchableWithoutFeedback>
    )
  }
}

const mapDispatch = dispatch => ({
  authActions: bindActionCreators(authActions, dispatch)
})

export default connect(
  null,
  mapDispatch
)(LoginFormScreen)

// SC
const Container = styled.View`
  flex: 1;
  background-color: #fff;
  padding-left: 20;
  padding-right: 20;
`

const Content = styled.View`
  margin-top: 20%;
  flex: 1;
  align-items: stretch;
`

const Footer = styled.View`
  margin-bottom: 40;
  align-items: stretch;
  flex-direction: column;
`

const FormInput = styled(Input)`
  margin-bottom: 16;
`

const Title = styled(Typography)`
  margin-bottom: 40;
  text-align: center;
`

const ErrorMessage = styled(Typography).attrs({
  type: 'error'
})`
  margin-bottom: 16;
  text-align: center;
`

const ForgotLabel = styled(Typography).attrs({
  type: 'label'
})`
  text-align: right;
  color: ${({ theme }) => theme.primary};
  margin-right: 20;
`
