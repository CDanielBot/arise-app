import React from 'react'
import { HeaderBackButton } from 'shared'
import EmptyScreen from './EmptyScreen'
import { Header } from 'react-navigation'
import Comment from './Comment'
import { LoadingScreen } from 'shared'
import * as commentActions from 'ducks/commentDuck'
import * as commentSelectors from 'selectors/commentSelectors'
import * as authSelectors from 'selectors/authSelectors'
import { connect } from 'react-redux'

// styles
import { View, KeyboardAvoidingView, ScrollView, Keyboard } from 'react-native'
import { Input, FlatButton } from 'styled'
import { Fa5Icon } from 'styled/icons'
import styled from 'styled-components'
import { bindActionCreators } from 'redux'

class CommentsScreen extends React.Component {
  state = {
    empty: false,
    isLoading: true,
    commentInput: ''
  }

  async componentDidMount() {
    this.keyboardSub = Keyboard.addListener('keyboardWillShow', () => {
      this.scrollView.scrollToEnd({ animated: true })
    })

    try {
      this.postId = this.props.navigation.getParam('postId')
      await this.props.commentActions.getComments(this.postId)
      this.setState({ isLoading: false })
    } catch (error) {
      console.log(error)
      console.log('error in COMMENTS SCREEN COMPONENT DID MOUNT')
    }
  }

  componentWillUnmount() {
    this.props.commentActions.clearComments()
    this.keyboardSub.remove()
  }

  onCommentInputChange = text => {
    this.setState(() => ({ commentInput: text }))
  }

  addComment = async () => {
    try {
      const { user } = this.props
      const commentInput = this.state.commentInput
      this.setState({ commentInput: '' })

      await this.props.commentActions.addComment(user.userId, user.user, this.postId, commentInput)

      this.scrollToEnd()
      this.dismissKeyboard()
    } catch (error) {
      console.log(error)
      console.log('error in COMMENTS SCREEN ADD COMMENT')
    }
  }

  scrollToEnd = () => {
    this.scrollView.scrollToEnd()
  }

  dismissKeyboard = () => {
    Keyboard.dismiss()
  }

  renderScreen = () => {
    if (this.state.isLoading) return <LoadingScreen />
    if (this.props.comments.items.length === 0) return <EmptyScreen />

    return <CommentsList comments={this.props.comments.items} />
  }

  render() {
    // console.log(this.props.comments.items)

    return (
      <View style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior="padding"
          style={{ flex: 1, justifyContent: 'center' }}
          keyboardVerticalOffset={Header.HEIGHT}
        >
          <CommentsScrollView
            ref={scrollView => {
              this.scrollView = scrollView
            }}
          >
            {this.renderScreen()}
          </CommentsScrollView>

          <InputContainer>
            <AvatarIcon size={40} />
            <InputComment
              placeholder="Add a comment..."
              onChangeText={this.onCommentInputChange}
              value={this.state.commentInput}
              rightAction={
                <AddButton disabled={this.state.commentInput === ''} onPress={this.addComment}>
                  Add
                </AddButton>
              }
            />
          </InputContainer>
        </KeyboardAvoidingView>
      </View>
    )
  }
}

CommentsScreen.navigationOptions = ({ navigation }) => {
  return {
    title: 'Comments',
    headerLeft: <HeaderBackButton navigation={navigation} showIcon />,
    headerStyle: {
      borderBottomWidth: 0,
      elevation: 0
    }
  }
}

// TODO: CHANGE KEY BELOW FROM INDEX TO COMMENTID -> TALK TO DANIEL
const CommentsList = ({ comments }) => (
  <React.Fragment>
    {comments.map((comment, index) => (
      <CommentContainer key={index}>
        <Comment comment={comment} />
      </CommentContainer>
    ))}
  </React.Fragment>
)

const mapState = state => ({
  user: authSelectors.getUser(state),
  comments: {
    items: commentSelectors.getItems(state)
  }
})

const mapDispatch = dispatch => ({
  commentActions: bindActionCreators(commentActions, dispatch)
})

export default connect(
  mapState,
  mapDispatch
)(CommentsScreen)

// SC
const InputContainer = styled.View`
  border-top-width: 1;
  border-color: ${({ theme }) => theme.border.light};
  padding-top: 8;
  padding-bottom: 8;
  padding-right: 20;
  padding-left: 20;
  flex-direction: row;
  align-items: center;
`

const CommentsScrollView = styled(ScrollView).attrs({
  contentContainerStyle: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 16
  }
})``

const InputComment = styled(Input)`
  flex: 1;
`

const AvatarIcon = styled(Fa5Icon).attrs({
  name: 'user-circle'
})`
  color: ${({ theme }) => theme.icon.light};
  margin-right: 8;
`

const AddButton = styled(FlatButton).attrs(({ theme }) => ({
  color: theme.primary
}))``

const CommentContainer = styled.View`
  margin-bottom: 16;
`
