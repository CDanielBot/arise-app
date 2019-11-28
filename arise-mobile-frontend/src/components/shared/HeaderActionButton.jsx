import React from 'react'
import { FeatherIcon } from 'styled/icons'
import styled from 'styled-components'

const HeaderActionButton = ({ navigation, screen, icon }) => {
  navigateTo = screen => () => navigation.navigate(screen)

  return <Container onPress={navigateTo(screen)}>{icon && icon}</Container>
}

const Container = styled.TouchableOpacity`
  padding-left: 40;
  padding-right: 10;
  flex-direction: row;
  align-items: flex-end;
`

export default HeaderActionButton
