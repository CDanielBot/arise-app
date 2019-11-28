import React from 'react'
import { FeatherIcon } from 'styled/icons'
import styled from 'styled-components'
import { NavigationActions } from 'react-navigation'
import { TouchableOpacity } from 'react-native'
import { Typography } from 'styled'

const backAction = NavigationActions.back({
  key: null
})

const HeaderBackButton = ({ navigation, showIcon, text }) => {
  const goBack = () => navigation.dispatch(backAction)

  return (
    <Container onPress={goBack}>
      {showIcon && <FeatherIcon name="arrow-left" size={25} />}
      {text && <Typography type="header">{text}</Typography>}
    </Container>
  )
}

const Container = styled.TouchableOpacity`
  padding-left: 10;
  padding-right: 40;
  flex-direction: row;
  align-items: flex-end;
`

export default HeaderBackButton
