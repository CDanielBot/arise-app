import React from 'react'

// styles
import { View, Text } from 'react-native'
import { Fa5Icon } from 'styled/icons'
import { Typography, CircleIcon } from 'styled'
import styled from 'styled-components'

const CreateSuccessScreen = ({ message }) => (
  <Container>
    <Header>
      <HeaderIcon icon={<Fa5Icon size={50} name="check" color="#fff" />} />
      <Description type="body">
        {message}
      </Description>
    </Header>
  </Container>
)

export default CreateSuccessScreen

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
`

const HeaderIcon = styled(CircleIcon).attrs(({ theme }) => ({
  size: 100,
  backgroundColor: theme.success
}))`
  margin-bottom: 20;
`

const Description = styled(Typography)`
  text-align: center;
`
