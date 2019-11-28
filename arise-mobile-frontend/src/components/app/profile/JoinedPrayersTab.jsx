import React from 'react'
import Post from '../home/post/Post'

// styles
import { Text } from 'react-native'
import styled from 'styled-components'

const JoinedPrayersTab = () => {
  return (
    <React.Fragment>
      {/* <Text>joined tab</Text> */}
      {posts.map((post, index) => (
        <PostContainer key={index}>
          <Post post={post} />
        </PostContainer>
      ))}
    </React.Fragment>
  )
}

export default JoinedPrayersTab

const PostContainer = styled.View`
  margin-top: 25;
  margin-bottom: 25;
`

const posts = [
  {
    userId: 1,
    postId: 1,
    title: 'My title',
    post: 'This is a prayer mocked up',
    type: 'post'
  },
  {
    userId: 2,
    postId: 2,
    title: 'My title',
    post: 'This is a prayer mocked up',
    type: 'post'
  },
  {
    userId: 3,
    postId: 3,
    title: 'My title',
    post: 'This is a prayer mocked up',
    type: 'post'
  },
  {
    userId: 4,
    postId: 4,
    title: 'My title',
    post: 'This is a prayer mocked up',
    type: 'post'
  },
  {
    userId: 5,
    postId: 5,
    title: 'My title',
    post: 'This is a prayer mocked up',
    type: 'post'
  }
]
