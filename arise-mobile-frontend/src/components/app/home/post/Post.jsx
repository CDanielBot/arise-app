import React from 'react'
import { PostType } from './types'
import PostActions from './PostActions'
import Badge from './Badge'
import PostContent from './PostContent'

// styles
import styled from 'styled-components'
import { Text, View } from 'react-native'
import { Fa5Icon } from 'styled/icons'
import { Card } from 'styled'

class Post extends React.PureComponent {
  render() {
    const { post } = this.props

    return (
      <PostCard elevation={2}>
        <BadgeContainer>
          <Badge type={post.type} />
        </BadgeContainer>

        <Header>
          <Fa5Icon style={{ marginRight: 14 }} name="user-circle" size={40} color="#C8C7CC" />
          <Text>{`${post.firstName} ${post.lastName}`}</Text>
        </Header>
        <Content>
          <PostContent post={post} />
        </Content>

        <PostActions post={post} showPostOptions={this.props.showPostOptions} />
      </PostCard>
    )
  }
}

Post.propTypes = {
  post: PostType.isRequired
}

export default Post

// SC
const BadgeContainer = styled.View`
  position: absolute;
  align-items: center;
  justify-content: center;
  right: 40;
  top: -20;
`

const Header = styled.View`
  padding-bottom: 25;
  flex-direction: row;
  align-items: center;
`

const Content = styled.View`
  padding-bottom: 30;
`

const PostCard = styled(Card)`
  position: relative;
  border-radius: 50;
  box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.09);
  border-radius: 25px;
  background-color: #fff;
  padding-top: 16;
  padding-left: 20;
  padding-right: 20;
  padding-bottom: 38;
`
