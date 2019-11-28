import React from 'react'
import { HeaderBackButton } from 'shared'

// styles
import styled from 'styled-components'
import { View } from 'react-native'
import { Typography, Input, PillButton } from 'styled'

const ProfileSettingsScreen = () => {
  return (
    <Container>
      <FormContainer>
        <Subtitle type="header">Password</Subtitle>

        <InputContainer>
          <Label>Password</Label>
          <FormInput secureTextEntry />
        </InputContainer>

        <InputContainer>
          <Label>New Password</Label>
          <FormInput secureTextEntry />
        </InputContainer>

        <InputContainer>
          <Label>Confirm Password</Label>
          <FormInput secureTextEntry />
        </InputContainer>
      </FormContainer>

      <Footer>
        <PillButton shadow>Reset</PillButton>
      </Footer>
    </Container>
  )
}

ProfileSettingsScreen.navigationOptions = ({ navigation }) => ({
  title: 'Reset Password',
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
  width: 118;
`

export default ProfileSettingsScreen
