import React from 'react'
import { SafeAreaView, ScrollView, Text } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from 'ducks/authDuck'
import * as bibleActions from 'ducks/bibleDuck'
import * as bibleSelectors from 'selectors/bibleSelectors'
import * as authSelectors from 'selectors/authSelectors'
import LoadingScreen from 'shared/LoadingScreen'
import { ButtonContainer } from 'styled'
import { ChevronLeftIcon, ChevronRightIcon } from 'styled/icons'
import styled from 'styled-components'

class BibleScreen extends React.Component {
  static navigationOptions = {
    title: 'Passage',
    tabBarIcon: PassageIcon,
  }

  navigateTo = screen => () => {
    const { navigate } = this.props.navigation
    navigate(screen)
  }

  componentDidMount() {
    const { activeVersion } = this.props.bible
    this.props.bibleActions.loadVersion(activeVersion)
    setTimeout(() => {
      this.props.bibleActions.fetchVerses(this.props.bible)
    }, 800)
  }

  componentDidUpdate(prevProps) {
    const { activeChapter, activeBook, activeVersion } = this.props.bible
    if (
      activeBook != prevProps.bible.activeBook ||
      activeChapter != prevProps.bible.activeChapter ||
      activeVersion != prevProps.bible.activeVersion
    ) {
      this.props.bibleActions.fetchVerses(this.props.bible)
    }
  }
  render() {
    const { user, bible } = this.props
    if (!user) return <LoadingScreen />
    return (
      <SafeAreaViewColored>
        <ViewContainer>
          <ScrollViewFlex>
            <TextActiveBook onPress={this.navigateTo('BookPicker')}>{bible.activeBook.name_id}</TextActiveBook>
            <ViewContent>
              {bible.verses.map((verse, i) => {
                if (verse.type === 'title') {
                  return (
                    <ViewItem key={i}>
                      <TextVerseTitle>{verse.content}</TextVerseTitle>
                    </ViewItem>
                  )
                } else {
                  return (
                    <ViewItem key={i}>
                      <ViewItemText>
                        <TextVerseNo>{verse.verse} </TextVerseNo>
                        <TextVerseContent>{verse.content}</TextVerseContent>
                      </ViewItemText>
                    </ViewItem>
                  )
                }
              })}
            </ViewContent>
          </ScrollViewFlex>
          <ViewActions pointerEvents={'box-none'}>
            <ActionButton onPress={() => this.onPrevious()}>
              <ChevronLeftIcon size="18" color="#fff" />
            </ActionButton>

            <ActionButton onPress={() => this.onNext()}>
              <ChevronRightIcon size="18" color="#fff" />
            </ActionButton>
          </ViewActions>
        </ViewContainer>
      </SafeAreaViewColored>
    )
  }

  onPrevious() {
    const { activeChapter } = this.props.bible
    this.props.bibleActions.goToPreviousChapter(activeChapter)
  }

  onNext() {
    const { activeChapter } = this.props.bible
    this.props.bibleActions.nextChapter(activeChapter)
  }
}

const mapState = state => ({
  user: authSelectors.getUser(state),
  bible: bibleSelectors.getBible(state)
})

const mapDispatch = dispatch => ({
  authActions: bindActionCreators(authActions, dispatch),
  bibleActions: bindActionCreators(bibleActions, dispatch)
})

export default connect(
  mapState,
  mapDispatch
)(BibleScreen)

const PassageIcon = ({ focused }) => {
  if (focused) {
    return <Icon name="book" size={18} color="#fff" />
  } else {
    return <Icon name="book" size={18} color="#ffffff66" />
  }
}

const SafeAreaViewColored = styled(SafeAreaView)`
  flex: 1
  backgroundColor: #fff
`

const ViewContainer = styled.View`
  flex: 1
  background-color: #fff
`

const ScrollViewFlex = styled(ScrollView)`
  flex: 1
`

const ViewActions = styled.View`
  position: absolute
  bottom: 0
  left: 0
  right: 0
  zIndex: 10
  flexDirection: row
  justifyContent: space-between
  padding: 10
`

const ActionButton = styled(ButtonContainer)`
  width: 48
  height: 48
  borderRadius: 24
  backgroundColor: #3B3F4A77
  justifyContent: 'center'
  alignItems: 'center'
`

const ViewContent = styled.View`
  paddingRight: 16
  paddingTop: 32
  paddingBottom: 48
`
const ViewItem = styled.View`
  paddingHorizontal: 16
  paddingVertical: 0
`

const ViewItemText = styled.View`
  flexDirection: row
`

const TextActiveBook = styled.Text`
  color: #282C32
  fontFamily: 'Montserrat-Bold'
  fontSize: 18
  position: absolute
  bottom: 16
  left: 16
`

const TextVerseTitle = styled.Text`
  marginTop: 16
  marginBottom: 16
  fontSize: 26
  color: #282C32,
  fontFamily: Montserrat-Medium,
`

const TextVerseContent = styled.Text`
  fontSize: 13
  color: #282C32
  lineHeight: 24
  fontFamily: Montserrat-Regular
`

const TextVerseNo = styled.Text`
  color: #ffffff66
  fontFamily: Montserrat-Medium
`