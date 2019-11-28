import React from 'react'
import MyPrayersTab from './MyPrayersTab'

// styles
import { Typography, TabButton } from 'styled'
import { View, ScrollView } from 'react-native'
import styled from 'styled-components'
import { HeaderBackButton } from 'shared'
import JoinedPrayersTab from './JoinedPrayersTab'

class MyPrayersScreen extends React.Component {
  state = {
    selectedTab: 0
  }

  setSelectedTab = tabIndex => () => {
    this.setState({
      selectedTab: tabIndex
    })
  }

  render() {
    return (
      <Container>
        <Content>
          <TabsContainer>
            <MyPrayersTabButton
              onPress={this.setSelectedTab(0)}
              isSelected={this.state.selectedTab === 0}
            >
              My Prayers
            </MyPrayersTabButton>

            <JoinedPrayersTabButton
              onPress={this.setSelectedTab(1)}
              isSelected={this.state.selectedTab === 1}
            >
              Joined Prayers
            </JoinedPrayersTabButton>
          </TabsContainer>

          {this.state.selectedTab === 0 ? <MyPrayersTab /> : <JoinedPrayersTab />}
        </Content>
      </Container>
    )
  }
}

MyPrayersScreen.navigationOptions = ({ navigation }) => ({
  title: 'Prayers',
  headerLeft: <HeaderBackButton navigation={navigation} showIcon />,
  headerStyle: {
    borderBottomWidth: 0
  }
})

export default MyPrayersScreen

// SC
const Container = styled.View`
  margin-top: 15;
  flex: 1;
`

const TabsContainer = styled.View`
  flex-direction: row;
  padding-left: 20;
  padding-right: 20;
  padding-bottom: 30;
`

const MyPrayersTabButton = styled(TabButton)`
  margin-right: 10;
  flex: 1;
`

const JoinedPrayersTabButton = styled(TabButton)`
  margin-left: 10;
  flex: 1;
`

const Content = styled.ScrollView.attrs({
  contentContainerStyle: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 16
  }
})``
