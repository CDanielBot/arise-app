import React from 'react'
import LoadingScreen from 'shared/LoadingScreen'
import Post from './post/Post'

// Redux
import * as postSelectors from 'selectors/postSelectors'
import * as authSelectors from 'selectors/authSelectors'
import * as authActions from 'ducks/authDuck'
import * as postActions from 'ducks/postDuck'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { tabWithStatusBarColor } from '../../hocs'

// Styles
import { View, Platform, FlatList, ActivityIndicator, Animated, RefreshControl } from 'react-native'
import { Typography } from 'styled'
import { Fa5Icon } from 'styled/icons'
import styled from 'styled-components'
import { LinearGradient } from 'expo'

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)

class HomeScreen extends React.Component {
  state = {
    isLoading: false,
    isRefreshing: false,
    animatedValue: new Animated.Value(0)
  }

  componentWillMount() {
    this.getInitialPosts()
  }

  keyExtractor = (item, index) => `${item.postId}`

  getInitialPosts = async () => {
    const { userId } = this.props.user
    this.props.postActions.getPosts(userId)
  }

  loadMorePosts = async () => {
    if (!this.onEndReachedCalledDuringMomentum) {
      if (this.state.isLoading || this.state.isRefreshing) return

      this.setState({ isLoading: true })
      const { batchSize, lastLoadedPostId } = this.props.posts
      const { userId } = this.props.user

      await this.props.postActions.loadMorePosts({ userId, batchSize, lastLoadedPostId })
      this.onEndReachedCalledDuringMomentum = true
      this.setState({ isLoading: false })
    }
  }

  render() {
    if (!this.props.user || (!this.props.posts && !this.props.posts.items)) return <LoadingScreen />

    const translateY = this.state.animatedValue.interpolate({
      inputRange: [0, 100],
      outputRange: [0, -80],
      extrapolate: 'clamp'
    })

    const fontSizeAnimated = this.state.animatedValue.interpolate({
      inputRange: [30, 100],
      outputRange: [50, 20],
      extrapolate: 'clamp'
    })

    const fadeOutAnimated = this.state.animatedValue.interpolate({
      inputRange: [0, 60],
      outputRange: [1, 0],
      extrapolate: 'clamp'
    })

    const marginTopAnimated = this.state.animatedValue.interpolate({
      inputRange: [0, 100],
      outputRange: [150, 70],
      extrapolate: 'clamp'
    })

    return (
      <View style={{ flex: 1 }}>
        {/* <BackgroundContainer>
          <Gradient />
          <Background />
          {Platform.OS === 'ios' && <IosBottomColorForScrollOverflow />}
        </BackgroundContainer> */}

        <AnimatedFlatList
          style={{ marginTop: marginTopAnimated, paddingLeft: 16, paddingRight: 16 }}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event([
            { nativeEvent: { contentOffset: { y: this.state.animatedValue } } }
          ])}
          refreshing={this.state.isRefreshing}
          onRefresh={this.getInitialPosts}
          onEndReachedThreshold={0.3}
          onEndReached={this.loadMorePosts}
          onMomentumScrollBegin={() => {
            this.onEndReachedCalledDuringMomentum = false
          }}
          data={this.props.posts.items}
          renderItem={({ item }) => (
            <PostContainer>
              <Post post={item} key={item.postId} />
            </PostContainer>
          )}
          keyExtractor={this.keyExtractor}
          ListFooterComponent={this.state.isLoading && <FooterLoading />}
        />

        <AnimatedHeader style={{ transform: [{ translateY }] }}>
          <HeaderContainer>
            <AnimatedTitle style={{ fontSize: fontSizeAnimated }}>3,421</AnimatedTitle>

            <HeaderAbsolute>
              <Animated.View style={{ opacity: fadeOutAnimated }}>
                <Fa5Icon size={20} color="#C8C7CC" name="hands-helping" />
              </Animated.View>

              <Animated.View style={{ opacity: fadeOutAnimated }}>
                <Typography type="label">requests</Typography>
              </Animated.View>
            </HeaderAbsolute>
          </HeaderContainer>
        </AnimatedHeader>
      </View>
    )
  }
}

const FooterLoading = () => (
  <View style={{ flex: 1, padding: 10, paddingBottom: 30 }}>
    <ActivityIndicator size="small" />
  </View>
)

const mapState = state => ({
  user: authSelectors.getUser(state),
  posts: {
    items: postSelectors.getItems(state),
    batchSize: postSelectors.getBatchSize(state),
    lastLoadedPostId: postSelectors.getLastLoadedPostId(state)
  }
})

const mapDispatch = dispatch => ({
  authActions: bindActionCreators(authActions, dispatch),
  postActions: bindActionCreators(postActions, dispatch)
})

export default compose(
  connect(
    mapState,
    mapDispatch
  ),
  tabWithStatusBarColor('dark')
)(HomeScreen)

// SC
const AnimatedHeader = styled(Animated.View)`
  position: absolute;
  background-color: white;
  height: 150;
  left: 0;
  right: 0;
  align-items: flex-end;
  flex-direction: row;
`

const PostContainer = styled.View`
  margin-top: 25;
  margin-bottom: 25;
`

const HeaderContainer = styled.View`
  align-items: flex-end;
  padding-bottom: 15;
  flex-direction: row;
`

const HeaderAbsolute = styled.View`
  position: absolute;
  left: 32;
  right: 32;
  height: 100%;
  padding-bottom: 40;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
`

const AnimatedTitle = styled(Animated.Text)`
  flex: 1;
  text-align: center;
  color: #1a1c1c;
`

const BackgroundContainer = styled.View`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`

const IosBottomColorForScrollOverflow = styled.View`
  height: 1000;
  position: absolute;
  bottom: -1000;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.background.screen};
`

const Background = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background.screen};
`

const Gradient = styled(LinearGradient).attrs({
  colors: ['#FFFFFF', '#F4EFEF'],
  start: { x: 1, y: 0 },
  end: { x: 1, y: 1 }
})`
  height: 800;
`
