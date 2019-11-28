import React from 'react'
import { HeaderBackButton, HeaderActionButton } from 'shared'
import { connect } from 'react-redux'
import * as authSelectors from 'selectors/authSelectors'
import * as evangelismRequestSelectors from 'selectors/evangelismRequestSelectors'
import * as evangelismRequestActions from 'ducks/evangelismRequestDuck'
import { LoadingScreen } from 'shared'

// styles
import { View, Text, ScrollView } from 'react-native'
import styled from 'styled-components'
import { Typography } from 'styled'
import { AntIcon } from 'styled/icons'
import { bindActionCreators } from 'redux'
import EvangelismRequest from './EvangelismRequest'
import { EntypoIcon } from 'styled/icons'

class MyEvangelismRequestsScreen extends React.Component {
  state = {
    loading: true
  }

  async componentDidMount() {
    const { user, evangelismRequestActions } = this.props
    await evangelismRequestActions.getEvangelismRequests(user.userId)
    this.setState({ loading: false })
  }

  navigateTo = screen => () => {
    this.props.navigation.navigate(screen)
  }

  render() {
    const { items, count } = this.props.evangelismRequests

    if (this.state.loading) return <LoadingScreen />

    return (
      <ViewContainer>
        <Header>
          <BigNumber>{count}</BigNumber>
          <View>
            <SmallLine />
            <Typography>Evangelism</Typography>
            <Typography>requests</Typography>
          </View>
        </Header>

        {count ? (
          <ScrollContent showsVerticalScrollIndicator={false}>
            {items &&
              items.map(evangelismRequest => (
                <EvangelismRequest
                  key={evangelismRequest.id}
                  evangelismRequest={evangelismRequest}
                />
              ))}
          </ScrollContent>
        ) : (
          <EmptyContent>
            <Description>
              <Typography>You have no evangelism requests</Typography>
              <Typography>Click the button below and create one</Typography>
            </Description>

            <IconContainer>
              <PlusIcon onPress={this.navigateTo('EvangelismRequestForm')} />
            </IconContainer>
          </EmptyContent>
        )}
      </ViewContainer>
    )
  }
}

MyEvangelismRequestsScreen.navigationOptions = ({ navigation, ...rest }) => {
  return {
    title: 'My Requests',
    headerLeft: <HeaderBackButton navigation={navigation} showIcon />,
    headerRight: (
      <HeaderActionButton
        icon={<EntypoIcon size={25} name="plus" />}
        screen="EvangelismRequestForm"
        navigation={navigation}
      />
    ),
    headerStyle: {
      borderBottomWidth: 0,
      elevation: 0
    }
  }
}

const mapState = state => ({
  user: authSelectors.getUser(state),
  evangelismRequests: {
    items: evangelismRequestSelectors.getItems(state),
    count: evangelismRequestSelectors.getCount(state)
  }
})

const mapDispatch = dispatch => ({
  evangelismRequestActions: bindActionCreators(evangelismRequestActions, dispatch)
})

export default connect(
  mapState,
  mapDispatch
)(MyEvangelismRequestsScreen)

// SC
const ViewContainer = styled.View`
  flex: 1;
`

const ScrollContent = styled.ScrollView.attrs({
  contentContainerStyle: {
    paddingTop: 40
  }
})`
  padding-left: 20;
  padding-right: 20;
`

const EmptyContent = styled.View`
  flex: 1;
  padding-top: 30%;
  align-items: center;
`

const IconContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`

const PlusIcon = styled(AntIcon).attrs(({ theme }) => ({
  size: 60,
  name: 'pluscircle',
  color: theme.primary
}))``

const Description = styled.View`
  margin-bottom: 20;
`

const Header = styled.View`
  margin-top: 30;
  flex-direction: row;
  align-items: center;
  padding-left: 50;
`

const BigNumber = styled(Typography).attrs({
  type: 'header'
})`
  font-size: 120;
  margin-right: 20;
`

const SmallLine = styled.View`
  height: 7;
  width: 30;
  margin-bottom: 5;
  margin-top: 20;
  border-radius: 15;
  background-color: ${({ theme }) => theme.primary};
`
