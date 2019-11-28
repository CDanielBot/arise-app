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

const validationSchema = yup.object().shape({
  'Last Name': yup
    .string()
    .min(2)
    .required(),
  'First Name': yup
    .string()
    .min(2)
    .required()
})

class RegisterStep2Screen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Register',
    headerLeft: <HeaderBackButton navigation={navigation} showIcon />,
    headerStyle: {
      borderBottomWidth: 0,
      elevation: 0
    }
  })

  state = {
    form: {
      firstName: '',
      lastName: ''
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
            <Title type="title">Basic Information</Title>

            <FormInput
              placeholder="First Name"
              name="firstName"
              onChangeText={this.onInputChange('firstName')}
            />
            <FormInput
              placeholder="Last Name"
              name="lastName"
              onChangeText={this.onInputChange('lastName')}
            />
          </Content>

          <Footer>
            {this.state.error ? <ErrorMessage>{this.state.error}</ErrorMessage> : null}
            <PillButton
              loading={this.state.loading}
              onPress={this.validateAndCreateAccount}
              shadow
              style={{ alignSelf: 'stretch' }}
            >
              Register
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

  validateAndCreateAccount = async () => {
    try {
      const { form } = this.state

      await validationSchema.validate({
        'First Name': form.firstName,
        'Last Name': form.lastName
      })

      this.hideErrorMessage()
      const credentials = this.props.navigation.getParam('credentials')

      this.setState({ loading: true })
      await this.props.authActions.createAccount({ ...credentials, ...form })
      this.props.navigation.navigate('StepFinal', { credentials })
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

const InputLabel = styled(Typography).attrs({
  type: 'label'
})`
  margin-left: 26;
  margin-bottom: 8;
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
)(RegisterStep2Screen)
