import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as yup from 'yup'
import { HeaderBackButton } from 'shared'
import CreateSuccessScreen from './CreateSuccessScreen'
import * as authSelectors from 'selectors/authSelectors'
import * as prayerActions from 'ducks/prayerDuck'

// styles
import styled from 'styled-components'
import { View, StatusBar, Keyboard, TouchableWithoutFeedback } from 'react-native'
import { Typography, PillButton, Input, CircleIcon } from 'styled'
import { Fa5Icon } from 'styled/icons'

const PRAYER_CREATED_MESSAGE =
  'Your Prayer has been created successfully. Wait for others to join your in prayer, God Bless'

const validationSchemaRequired = yup.object().shape({
  Description: yup
    .string()
    .min(10)
    .required()
})

class PrayerFormScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerLeft: <HeaderBackButton navigation={navigation} text="Cancel" />,
    headerStyle: {
      borderBottomWidth: 0,
      elevation: 0
    }
  })

  state = {
    form: {
      description: ''
    },
    created: false,
    loading: false,
    error: ''
  }

  errorTimer = null

  onDescriptionChanged = text => {
    this.setState(() => ({
      form: {
        description: text
      }
    }))
  }

  dismissKeyboard = () => {
    Keyboard.dismiss()
  }

  validateAndCreate = async () => {
    try {
      const { form } = this.state
      const { user } = this.props

      await validationSchemaRequired.validate({
        Description: form.description
      })

      this.setState({ loading: true })
      await this.props.prayerActions.createPrayer(user.userId, this.state.form.description)
      this.setState({ created: true })
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
    if (this.state.created) return <CreateSuccessScreen message={PRAYER_CREATED_MESSAGE} />
    return (
      <TouchableWithoutFeedback onPress={this.dismissKeyboard}>
        <Container onPress={this.dismissKeyboard}>
          <StatusBar barStyle="default" />

          <Header>
            <HeaderIcon icon={<Fa5Icon size={50} name="praying-hands" color={theme.icon.dark} />} />

            <Typography>Create a prayer and let others join you</Typography>
          </Header>

          <Content>
            <FormInput
              multiline
              placeholder="Prayer description"
              onChangeText={this.onDescriptionChanged}
              value={this.state.form.description}
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
  prayerActions: bindActionCreators(prayerActions, dispatch)
})

export default connect(
  mapState,
  mapDispatch
)(PrayerFormScreen)

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
