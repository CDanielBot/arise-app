import React from 'react'
import { HeaderBackButton } from 'shared'
import { connect } from 'react-redux'
import * as yup from 'yup'
import * as authSelectors from 'selectors/authSelectors'
import * as authActions from 'ducks/authDuck'
import { bindActionCreators } from 'redux'

// styles
import styled from 'styled-components'
import { View, Keyboard, TouchableWithoutFeedback } from 'react-native'
import { Typography, Input, PillButton } from 'styled'

const validationSchema = yup.object().shape({
  firstName: yup
    .string()
    .min(2)
    .required(),
  lastName: yup
    .string()
    .min(2)
    .required(),
  mobile: yup.number()
})

class ProfileSettingsScreen extends React.Component {
  errorTimer = null
  state = {
    loading: false,
    error: '',
    form: {
      firstName: this.props.user.firstName,
      lastName: this.props.user.lastName,
      mobile: this.props.user.mobile
    }
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

  save = async () => {
    try {
      await validationSchema.validate(this.state.form)
      this.hideErrorMessage()
      this.setState({ loading: true })
      await this.props.authActions.updatePersonalInformation(
        this.props.user.userId,
        this.state.form
      )
      this.props.navigation.goBack()
      this.setState({ loading: false })
    } catch (error) {
      console.log(error)
      this.showErrorMessage(error.message)
      this.setState({ loading: false })
    }
  }

  dismissKeyboard = () => {
    Keyboard.dismiss()
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
          <FormContainer>
            <Subtitle type="header">Basic Information</Subtitle>

            <InputContainer>
              <Label>First name</Label>
              <FormInput
                placeholder="John"
                value={this.state.form.firstName}
                onChangeText={this.onInputChange('firstName')}
              />
            </InputContainer>

            <InputContainer>
              <Label>Last Name</Label>
              <FormInput
                placeholder="Doe"
                value={this.state.form.lastName}
                onChangeText={this.onInputChange('lastName')}
              />
            </InputContainer>

            <InputContainer>
              <Label>Telephone</Label>
              <FormInput
                placeholder="0726 837 937"
                value={this.state.form.mobile}
                onChangeText={this.onInputChange('mobile')}
              />
            </InputContainer>
          </FormContainer>

          <Footer>
            {this.state.error ? <ErrorMessage>{this.state.error}</ErrorMessage> : null}
            <PillButton shadow onPress={this.save} loading={this.state.loading}>
              Save
            </PillButton>
          </Footer>
        </Container>
      </TouchableWithoutFeedback>
    )
  }
}

ProfileSettingsScreen.navigationOptions = ({ navigation }) => ({
  title: 'Profile Settings',
  headerLeft: <HeaderBackButton navigation={navigation} showIcon />,
  headerStyle: {
    borderBottomWidth: 0,
    elevation: 0
  }
})

const Container = styled.View`
  padding-left: 20;
  padding-right: 20;
  flex: 1;
`

const ErrorMessage = styled(Typography).attrs({
  type: 'error'
})`
  margin-bottom: 16;
  text-align: center;
`

const Footer = styled.View`
  margin-top: 50;
  margin-bottom: 40;
`

const FormContainer = styled.View`
  margin-top: 32;
  flex: 1;
`

const Subtitle = styled(Typography).attrs({
  type: 'header'
})`
  margin-bottom: 21;
`

const InputContainer = styled.View`
  align-items: center;
  flex-direction: row;
  margin-bottom: 16;
  margin-left: 10;
`

const FormInput = styled(Input)`
  flex: 1;
  margin-left: 10;
`

const Label = styled(Typography).attrs({
  type: 'label'
})`
  width: 80;
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
)(ProfileSettingsScreen)
