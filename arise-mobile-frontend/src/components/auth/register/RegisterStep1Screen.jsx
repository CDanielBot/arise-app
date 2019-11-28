import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as authActions from 'ducks/authDuck'
import { HeaderBackButton } from 'shared'
import * as yup from 'yup'

// styles
import { View, StatusBar, Keyboard, TouchableWithoutFeedback } from 'react-native'
import styled from 'styled-components'
import { Typography, PillButton, Input } from 'styled'
import { FeatherIcon, Fa5Icon } from 'styled/icons'

const validationSchema = yup.object().shape({
  'Confirm Password': yup
    .string()
    .min(6)
    .oneOf([yup.ref('Password'), null], 'Passwords must match'),
  Password: yup.string().min(6),
  Email: yup
    .string()
    .email()
    .required()
})

class RegisterStep1Screen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Register',
    headerLeft: <HeaderBackButton navigation={navigation} text="Cancel" />,
    headerStyle: {
      borderBottomWidth: 0,
      elevation: 0
    }
  })

  state = {
    form: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    loading: false,
    error: ''
  }

  errorTimer = null

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.dismissKeyboard}>
        <Container onPress={this.dismissKeyboard}>
          <StatusBar barStyle="default" />

          <Content>
            <Title type="title">Credentials</Title>

            <FormInput
              autoCapitalize="none"
              keyboardType="email-address"
              icon={<Fa5Icon size={20} name="envelope" color="#C8C7CC" />}
              placeholder="Email address"
              name="email"
              onChangeText={this.onInputChange('email')}
            />
            <FormInput
              autoCapitalize="none"
              secureTextEntry
              icon={<Fa5Icon size={20} name="lock" color="#C8C7CC" />}
              placeholder="Password"
              name="password"
              onChangeText={this.onInputChange('password')}
            />
            <Input
              autoCapitalize="none"
              secureTextEntry
              icon={<Fa5Icon size={20} name="lock" color="#C8C7CC" />}
              placeholder="Confirm Password"
              name="confirmPassword"
              onChangeText={this.onInputChange('confirmPassword')}
            />
          </Content>

          <Footer>
            {this.state.error ? <ErrorMessage>{this.state.error}</ErrorMessage> : null}
            <PillButton
              loading={this.state.loading}
              onPress={this.validateAndRegister}
              shadow
              style={{ alignSelf: 'stretch' }}
              rightIcon={
                <FeatherIcon style={{ marginLeft: 15 }} name="arrow-right" size={20} color="#fff" />
              }
            >
              Continue
            </PillButton>
          </Footer>
        </Container>
      </TouchableWithoutFeedback>
    )
  }

  componentWillUnmount() {
    this.hideErrorMessage()
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

  validateAndRegister = async () => {
    try {
      const { form } = this.state

      await validationSchema.validate({
        Email: form.email,
        Password: form.password,
        'Confirm Password': form.confirmPassword
      })

      this.hideErrorMessage()
      this.props.navigation.navigate('Step2', {
        credentials: {
          email: this.state.form.email,
          password: this.state.form.password
        }
      })
    } catch (error) {
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
}

const Container = styled.View`
  flex: 1;
  background-color: #fff;
  padding-left: 20;
  padding-right: 20;
`

const ErrorMessage = styled(Typography).attrs({
  type: 'error'
})`
  margin-bottom: 16;
  text-align: center;
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
  margin-bottom: 20;
  text-align: center;
`

const mapDispatch = dispatch => ({
  authActions: bindActionCreators(authActions, dispatch)
})

export default connect(
  null,
  mapDispatch
)(RegisterStep1Screen)
