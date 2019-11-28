import React from 'react'
import PostSettingsModal from './PostSettingsModal'
import { withNavigation } from 'react-navigation'

// styles
import styled from 'styled-components'
import { AntIcon, FaIcon, Fa5Icon, EntypoIcon } from 'styled/icons'
import { Typography } from 'styled'
import { PostType } from './types'
import { View } from 'react-native'

class PostActions extends React.Component {
  state = {
    showOptionsModal: false
  }

  triggerOptionsModal = () => {
    this.setState(prevState => ({
      showOptionsModal: !prevState.showOptionsModal
    }))
  }

  navigateTo = (screen, params = {}) => () => this.props.navigation.navigate(screen, params)

  render() {
    const { post } = this.props

    return (
      <ActionsContainer>
        {post.type !== 'post' ? (
          <Action>
            <LikeIcon
              isLiked={post.userReaction === 'like' ? true : false}
              onPress={() => console.log('Hit LIKE button')}
            />
            <Typography onPress={() => console.log('Hit LIKE count')}>
              {post.reactionsCounter} Likes
            </Typography>
          </Action>
        ) : (
          <Action>
            <PrayIcon
              isPraying={post.userReaction === 'pray' ? true : false}
              onPress={() => console.log('Hit PRAY button')}
            />
            <Typography onPress={() => console.log('Hit PRAY count')}>
              {post.reactionsCounter} Praying
            </Typography>
          </Action>
        )}

        <Action>
          <CommentIcon
            onPress={this.navigateTo('Comments', {
              postId: post.postId
            })}
          />
          <Typography
            onPress={this.navigateTo('Comments', {
              postId: post.postId
            })}
          >
            {post.commentsCounter} Comments
          </Typography>
        </Action>

        {this.props.showPostOptions && (
          <React.Fragment>
            <Action>
              <OptionsIcon onPress={this.triggerOptionsModal} />
            </Action>

            <PostSettingsModal
              isVisible={this.state.showOptionsModal}
              onClose={this.triggerOptionsModal}
            />
          </React.Fragment>
        )}
      </ActionsContainer>
    )
  }
}

PostActions.propTypes = {
  post: PostType
}

export default withNavigation(PostActions)

// SC
const LikeIcon = styled(AntIcon).attrs(({ size, isLiked }) => ({
  name: isLiked ? 'heart' : 'hearto',
  color: isLiked ? '#F15454' : theme.icon.dark,
  size: size || 24
}))`
  margin-right: 12;
  margin-top: 2;
`

const PrayIcon = styled(Fa5Icon).attrs(({ size, isPraying }) => ({
  name: 'praying-hands',
  color: isPraying ? '#F15454' : theme.icon.dark,
  size: size || 21
}))`
  margin-right: 12;
`

const CommentIcon = styled(FaIcon).attrs({
  name: 'comment-o',
  size: 26
})`
  color: ${({ theme }) => theme.icon.dark};
  margin-right: 12;
  padding-bottom: 4;
`

const OptionsIcon = styled(EntypoIcon).attrs({
  name: 'dots-three-horizontal',
  size: 24
})`
  color: ${({ theme }) => theme.icon.dark};
  padding-top: 4;
  padding-right: 4;
  padding-bottom: 4;
  padding-left: 4;
`

const Action = styled.View`
  flex-direction: row;
  align-items: center;
`

const ActionsContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: space-around;
`
