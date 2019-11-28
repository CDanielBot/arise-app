import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as evangelismRequestActions from 'ducks/evangelismRequestDuck'
import * as yup from 'yup'
import { HeaderBackButton } from 'shared'
import CreateSuccessScreen from './CreateSuccessScreen'
import * as authSelectors from 'selectors/authSelectors'

// styles
import styled from 'styled-components'
import { View, StatusBar, Keyboard, TouchableWithoutFeedback } from 'react-native'
import { Typography, PillButton, Input, CircleIcon } from 'styled'
import { Fa5Icon } from 'styled/icons'

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const EVANGELISM_REQUEST_CREATED_MESSAGE =
  'Your Evangelism Request created successfully. We will be in touch with you soon in order to help'

const validationSchemaRequired = yup.object().shape({
  Email: yup
    .string()
    .email()
    .required(),
  'Phone Number': yup.string().matches(phoneRegExp, 'Phone number is not valid'),
  'Full Name': yup
    .string()
    .min(4)
    .required()
})

const initialState = {
  form: {
    fullName: '',
    phoneNumber: '',
    email: ''
  },
  created: false,
  loading: false,
  error: ''
}

class EvangelismRequestFormScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerLeft: <HeaderBackButton navigation={navigation} text="Cancel" />,
    headerStyle: {
      borderBottomWidth: 0,
      elevation: 0
    }
  })

  constructor(props) {
    super(props)

    if (props.user) {
      this.state = {
        ...initialState,
        form: {
          ...initialState.form,
          fullName: props.user.user ? props.user.user : '',
          email: props.user.email ? props.user.email : '',
          phoneNumber: props.user.mobile ? props.user.mobile : ''
        }
      }
      return
    }

    this.state = { ...initialState }
  }

  errorTimer = null

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

  validateAndCreate = async () => {
    try {
      const { form } = this.state

      await validationSchemaRequired.validate({
        'Full Name': form.fullName,
        'Phone Number': form.phoneNumber,
        Email: form.email
      })

      this.setState({ loading: true })
      await this.props.evangelismRequestActions.createEvangelismRequest(this.props.user.userId, {
        applicantName: form.fullName,
        applicantPhone: form.phoneNumber,
        applicantEmail: form.email
      })

      this.setState({ created: true })
      this.props.evangelismRequestActions.getEvangelismRequests(this.props.user.userId)
    } catch (error) {
      this.setState({ loading: false })
      this.showErrorMessage(error.message)
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

  componentWillUnmount() {
    this.errorTimer && clearTimeout(this.errorTimer)
  }

  render() {
    if (this.state.created)
      return <CreateSuccessScreen message={EVANGELISM_REQUEST_CREATED_MESSAGE} />

    return (
      <TouchableWithoutFeedback onPress={this.dismissKeyboard}>
        <Container onPress={this.dismissKeyboard}>
          <StatusBar barStyle="default" />

          <Header>
            <HeaderIcon icon={<Fa5Icon size={50} name="hands-helping" color={theme.icon.dark} />} />

            <Typography>We help you help others</Typography>
          </Header>

          <Content>
            <FormInput
              icon={<Fa5Icon size={20} name="user" color="#C8C7CC" />}
              placeholder="Full Name"
              onChangeText={this.onInputChange('fullName')}
              value={this.state.form.fullName}
            />
            <FormInput
              autoCapitalize="none"
              keyboardType="numeric"
              icon={<Fa5Icon size={20} name="phone" color="#C8C7CC" />}
              placeholder="Phone Number"
              onChangeText={this.onInputChange('phoneNumber')}
              value={this.state.form.phoneNumber}
            />

            <FormInput
              autoCapitalize="none"
              keyboardType="email-address"
              icon={<Fa5Icon size={20} name="envelope" color="#C8C7CC" />}
              placeholder="Email address"
              onChangeText={this.onInputChange('email')}
              value={this.state.form.email}
            />
          </Content>

          <Footer>
            {this.state.error ? <ErrorMessage>{this.state.error}</ErrorMessage> : null}
            <PillButton
              loading={this.state.loading}
              onPress={this.validateAndCreate}
              shadow
              style={{ alignSelf: 'stretch' }}
            >
              Create
            </PillButton>
          </Footer>
        </Container>
      </TouchableWithoutFeedback>
    )
  }
}

const mapState = state => ({
  user: authSelectors.getUser(state)
})

const mapDispatch = dispatch => ({
  evangelismRequestActions: bindActionCreators(evangelismRequestActions, dispatch)
})

export default connect(
  mapState,
  mapDispatch
)(EvangelismRequestFormScreen)

// SC
const Container = styled.View`
  flex: 1;
  background-color: #fff;
  padding-left: 20;
  padding-right: 20;
`

const Header = styled.View`
  margin-top: 10%;
  align-items: center;
  margin-bottom: 50;
`

const HeaderIcon = styled(CircleIcon).attrs(({ theme }) => ({
  size: 100,
  backgroundColor: theme.background.icon
}))`
  margin-bottom: 20;
`

const Content = styled.View`
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

const ErrorMessage = styled(Typography).attrs({
  type: 'error'
})`
  margin-bottom: 16;
  text-align: center;
`
