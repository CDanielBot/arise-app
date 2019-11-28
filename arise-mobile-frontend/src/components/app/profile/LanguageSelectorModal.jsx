import React from 'react'
import Modal from 'react-native-modal'
import { connect } from 'react-redux'
import * as authSelectors from 'selectors/authSelectors'
import * as authActions from 'ducks/authDuck'
import { bindActionCreators } from 'redux'

// styles
import styled, { css } from 'styled-components'
import { TouchableOpacity, View, ScrollView, Dimensions } from 'react-native'
import { Typography, Hr, RadioButton } from 'styled'

const screenHeight = Dimensions.get('window').height

class LanguageSelectorModal extends React.Component {
  state = {
    selectedLanguage: this.props.user.language
  }

  setLanguageAndClose = language => async () => {
    try {
      this.setState({ selectedLanguage: language })
      await this.props.authActions.updateLanguage(this.props.user.userId, {
        language: language
      })
      this.props.onClose()
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    return (
      <Modal
        animationIn="fadeIn"
        animationOut="fadeOut"
        isVisible={this.props.isVisible}
        backdropOpacity={0.3}
        onBackdropPress={this.props.onClose}
      >
        <Container>
          <Header>
            <Typography type="header">Select Language</Typography>
          </Header>

          <LineContainer>
            <Hr />
          </LineContainer>

          <Content>
            <SelectButton onPress={this.setLanguageAndClose('ro')}>
              <RadioButton selected={this.state.selectedLanguage === 'ro'} marginRight />
              <Typography type="header">Romanian</Typography>
            </SelectButton>

            <SelectButton onPress={this.setLanguageAndClose('en')}>
              <RadioButton selected={this.state.selectedLanguage === 'en'} marginRight />
              <Typography type="header">English</Typography>
            </SelectButton>
          </Content>
        </Container>
      </Modal>
    )
  }
}

// SC
const Container = styled.View`
  background-color: white;
  border-radius: 10;
  overflow: hidden;
`

const LineContainer = styled.View`
  flex-direction: row;
`

const Header = styled.View`
  justify-content: center;
  padding-top: 20;
  padding-bottom: 20;
  padding-left: 20;
  padding-right: 20;
`

const Content = styled.ScrollView`
  padding-left: 20;
  padding-right: 20;
  max-height: ${() => screenHeight / 2};
`

const SelectButton = styled.TouchableOpacity`
  height: 60;
  flex-direction: row;
  align-items: center;
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
)(LanguageSelectorModal)
