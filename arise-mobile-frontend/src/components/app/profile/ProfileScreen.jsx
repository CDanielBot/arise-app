import React from 'react'
import { tabWithStatusBarColor } from '../../hocs'
import { connect } from 'react-redux'
import * as authSelectors from 'selectors/authSelectors'
import { compose } from 'redux'

// styles
import { View, ScrollView } from 'react-native'
import styled from 'styled-components'
import { Typography, MenuOption, Hr, CircleIcon } from 'styled'
import { Fa5Icon } from 'styled/icons'

const ProfileScreen = ({ navigation, user }) => {
  navigateTo = screen => () => {
    navigation.navigate(screen)
  }

  return (
    <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'space-between' }}>
      <Header>
        <ProfileIconContainer>
          <Fa5Icon name="user-circle" size={80} color="#C8C7CC" />
        </ProfileIconContainer>

        <ProfileInfoContainer>
          <Username>{user.user}</Username>
          <Email>{user.email}</Email>
        </ProfileInfoContainer>
      </Header>

      <Content>
        <LineContainer>
          <Hr />
        </LineContainer>

        <MenuOption
          onPress={this.navigateTo('MyEvangelismRequests')}
          icon={
            <CircleIcon
              size={35}
              backgroundColor="#EE2E2E"
              icon={<Fa5Icon size={15} name="hands-helping" color="#fff" />}
            />
          }
        >
          <Typography type="header">Evanghelism Requests</Typography>
        </MenuOption>

        <MenuOption
          onPress={this.navigateTo('Prayers')}
          icon={
            <CircleIcon
              size={35}
              backgroundColor="#EE2E2E"
              icon={<Fa5Icon size={15} name="praying-hands" color="#fff" />}
            />
          }
        >
          <Typography type="header">Prayers</Typography>
        </MenuOption>

        <MenuOption
          onPress={this.navigateTo('Settings')}
          icon={
            <CircleIcon
              size={35}
              backgroundColor="#EE2E2E"
              icon={<Fa5Icon size={15} name="cog" color="#fff" />}
            />
          }
        >
          <Typography type="header">Settings</Typography>
        </MenuOption>
      </Content>
    </ScrollView>
  )
}

const mapState = state => ({
  user: authSelectors.getUser(state)
})

export default compose(
  connect(mapState),
  tabWithStatusBarColor('dark')
)(ProfileScreen)

// SC
const Header = styled.View`
  flex-direction: row;
  margin-top: 80;
  padding-left: 20;
  padding-right: 20;
`

const LineContainer = styled.View`
  margin-top: 40;
  margin-bottom: 40;
  flex-direction: row;
  padding-left: 20;
  padding-right: 20;
`

const Content = styled.View`
  position: relative;
  align-items: center;
  flex: 1;
  padding-left: 5;
`

const ProfileIconContainer = styled.View`
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 50;
`

const ProfileInfoContainer = styled.View`
  justify-content: center;
  margin-left: 16;
`

const Username = styled(Typography).attrs({
  type: 'title'
})`
  margin-bottom: 4;
`

const Email = styled(Typography)`
  margin-bottom: 4;
  margin-left: 4;
`
