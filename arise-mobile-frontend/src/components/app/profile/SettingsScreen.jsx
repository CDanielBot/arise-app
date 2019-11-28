import React from 'react'
import * as authActions from 'ducks/authDuck'
import LanguageSelectorModal from './LanguageSelectorModal'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

// styles
import { View } from 'react-native'
import * as authSelectors from 'selectors/authSelectors'
import { Typography, MenuOption, FlatButton } from 'styled'
import { HeaderBackButton } from 'shared'
import styled from 'styled-components'

class SettingsScreen extends React.Component {
  state = {
    showLanguageSelectorModal: false
  }

  navigateTo = screen => () => {
    this.props.navigation.navigate(screen)
  }

  logout = () => {
    this.props.authActions.logout()
    this.props.navigation.navigate('Login')
  }

  showLanguageSelectorModal = () => {
    this.setState({
      showLanguageSelectorModal: true
    })
  }

  closeLanguageSelectorModal = () => {
    this.setState({
      showLanguageSelectorModal: false
    })
  }

  render() {
    const { user } = this.props

    return (
      <Container>
        <MenuOption
          rightChevron={false}
          onPress={this.showLanguageSelectorModal}
          value={this.props.user.language}
        >
          <Typography type="header">Language</Typography>
        </MenuOption>

        <MenuOption onPress={this.navigateTo('ProfileSettings')} selected={true}>
          <Typography type="header">Profile Information</Typography>
        </MenuOption>

        {!user.isSocialAccount && (
          <MenuOption onPress={this.navigateTo('ResetPassword')}>
            <Typography type="header">Reset Password</Typography>
          </MenuOption>
        )}

        <LanguageSelectorModal
          isVisible={this.state.showLanguageSelectorModal}
          onClose={this.closeLanguageSelectorModal}
        />

        <Footer>
          <FlatButton onPress={this.logout} color="#8A8A8F">
            Logout
          </FlatButton>
        </Footer>
      </Container>
    )
  }
}

SettingsScreen.navigationOptions = ({ navigation }) => ({
  title: 'Settings',
  headerLeft: <HeaderBackButton navigation={navigation} showIcon />,
  headerStyle: {
    borderBottomWidth: 0,
    elevation: 0
  }
})

const mapState = state => ({
  user: authSelectors.getUser(state)
})

const mapDispatch = dispatch => ({
  authActions: bindActionCreators(authActions, dispatch)
})

export default connect(
  mapState,
  mapDispatch
)(SettingsScreen)

// SC
const Container = styled.View`
  flex: 1;
  margin-top: 32;
`

const Footer = styled.View`
  flex: 1;
  justify-content: flex-end;
  align-items: center;
  padding-bottom: 20;
`
