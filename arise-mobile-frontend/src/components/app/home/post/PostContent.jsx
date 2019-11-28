import React from 'react'
import { withNavigation } from 'react-navigation'

// styled
import styled from 'styled-components'
import { View, Image, WebView, StatusBar } from 'react-native'
import { Typography } from 'styled'
import Lightbox from 'react-native-lightbox'

const getContentBasedOnPostType = type => {
  switch (type) {
    case 'article': {
      return ArticleContent
    }
    case 'media': {
      return VideoContent
    }
    case 'event': {
      return EventContent
    }
    case 'post': {
      return PrayerContent
    }
    case 'image': {
      return ImageContent
    }
  }
}

const PostContent = withNavigation(({ post, navigation }) => {
  navigateTo = (screen, params = {}) => () => navigation.navigate(screen, params)

  const Content = getContentBasedOnPostType(post.type)
  return <Content navigateTo={navigateTo} post={post} />
})

const ArticleContent = ({ post, navigateTo }) => (
  <MinHeightContainer onPress={navigateTo('Content', { post })}>
    <React.Fragment>
      <Typography numberOfLines={2} style={{ marginBottom: 12 }} type="subtitle">
        {post.title}
      </Typography>
      <Typography numberOfLines={6}>
        {post.post}
      </Typography>
    </React.Fragment>
  </MinHeightContainer>
)

const PrayerContent = ({ post, navigateTo }) => (
  <MinHeightContainer onPress={navigateTo('Content', { post })}>
    <React.Fragment>
      {/* <Typography numberOfLines={2} style={{ marginBottom: 12 }} type="subtitle">
          My prayer post with a long title so it does the ellipsis on two lines
        </Typography> */}
      <Typography numberOfLines={6} type="body">
        {post.post}
      </Typography>
    </React.Fragment>
  </MinHeightContainer>
)

const EventContent = ({ post, navigateTo }) => (
  <MinHeightContainer onPress={navigateTo('Content', { post })}>
    <React.Fragment>
      <Typography numberOfLines={2} style={{ marginBottom: 12 }} type="subtitle">
        {post.title}
      </Typography>
      <Typography numberOfLines={6} type="body">
        {post.post}
      </Typography>
    </React.Fragment>
  </MinHeightContainer>
)

const FixedHeightContainer = styled.View`
  height: 350;
`

const ImageContent = ({ post }) => {
  const PostImage = styled.Image`
    flex: 1;
    width: null;
    height: null;
    resize-mode: contain;
    margin-left: -20;
    margin-right: -20;
  `

  return (
    <Lightbox>
      <PostImage style={{ height: 300 }} source={{ uri: post.imgSrc }} />
    </Lightbox>
  )
}

const VideoContent = () => (
  <FixedHeightContainer>
    <WebView
      style={{ flex: 1, marginLeft: -20, marginRight: -20 }}
      javaScriptEnabled={true}
      onNavigationStateChange={() =>
        setTimeout(() => {
          StatusBar.setHidden(false)
        }, 500)
      }
      source={{
        uri: 'https://www.youtube.com/embed/gftwQpQPlL4'
      }}
    />
  </FixedHeightContainer>
)

const MinHeightContainer = styled.TouchableOpacity.attrs({
  activeOpacity: 1
})`
  min-height: 100;
`

export default PostContent
