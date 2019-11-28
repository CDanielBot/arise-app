import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Button } from 'react-native'

class BookPickerScreen extends React.Component {

  navigation = undefined

  constructor(props) {
    super(props)
    this.navigation = props.navigation
    this.state = {
      activeBook: props.activeBook,
      activeChapter: props.activeChapter
    }
  }

  navigateTo = screen => () => {
    const { navigate } = this.props.navigation
    navigate(screen)
  }

  render() {
    const { activeBook, activeChapter } = this.state

    if (!activeBook) {
      return null
    }
    const chapters = []
    for (let i = 0; i < activeBook.total; i++) {
      chapters.push(i)
    }
    return (
      <ModalView>
        <CardWrapView>
          <TitleText>{activeBook.name_id}</TitleText>
          <CardView>
            <ScrollViewFlex>
              <ContentView>
                {chapters.map((chapter, i) => {
                  const currentChapter = i + 1
                  const isActive = currentChapter === activeChapter
                  return (
                    <ChangeChapterButton
                      key={i}
                      isActive={isActive}
                      onPress={() => {
                        this.setState({ activeChapter: currentChapter })
                      }}
                    >
                      <ChapterText isActive={isActive}>{currentChapter}</ChapterText>
                    </ChangeChapterButton>
                  )
                })}
              </ContentView>
            </ScrollViewFlex>

            <ActionsView>
              <CancelButton onPress={() => this.setState({ activeBook: null })}>
                <Icon size={18} name="x-circle" color="#282C32" />
                <CancelText>Cancel</CancelText>
              </CancelButton>
              <OkButton
                style={[styles.okBtn, styles.defaultBtn]}
                onPress={() => {
                  this.props.bibleActions.setActiveBook(activeBook)
                  this.props.bibleActions.setActiveChapter(activeChapter)
                  this.setState({ activeBook: null })
                  navigateTo('Bible')
                }}
              >
                <Icon size={18} name="check-circle" color="#fff" />
                <OkText>OK</OkText>
              </OkButton>
            </ActionsView>
          </CardView>
        </CardWrapView>
      </ModalView>
    )
  }
}

export default connect(
  null,
  null
)(BookPickerScreen)

const ModalView = styled.View`
  flexDirection: 'row'
  alignItems: 'flex-end'
  position: 'absolute'
  left: 0
  right: 0
  bottom: 0
  top: 0
  backgroundColor: rgba(0,0,0,0.7)
`

const CardWrapView = styled.View`
  height: 380
  flex: 1
`

const CardView = styled.View`
  flex: 1
  marginHorizontal: 16
  marginBottom: 16
  backgroundColor: '#fff'
  borderRadius: 12
  padding: 16
`

const ScrollViewFlex = styled.View`
  flex: 1
`

const ContentView = styled.View`
  flexWrap: wrap
  flexDirection: row
`

const ActionsView = styled.View`
  height: 48
  flexDirection: row
  marginTop: 16
`

const TitleText = styled.Text`
  color: #fff
  fontFamily: Lato-Black
  marginHorizontal: 16
  marginBottom: 16
  fontSize: 20
`

// BorderlessButton
const ChangeChapterButton = styled(Button)`
  width: 48
  height: 48
  alignItems: center
  justifyContent: center
  ${({ isActive }) => isActive && `  
    backgroundColor: #282C32,
    borderRadius: 24
  `}
`

const ChapterText = styled.Text`
  fontFamily: Lato-Black
  fontSize: 16
  ${({ isActive }) => isActive && `
    color: #fff
  `}
`

const OkButton = styled(Button)`
  flex: 1
  flexDirection: row
  alignItems: center
  justifyContent: center
  borderRadius: 6
`

const CancelButton = styled(Button)`
  flex: 1
  flexDirection: row
  alignItems: center
  justifyContent: center
  borderRadius: 6
`

const CancelText = styled.Text`
  color: #282C32
  fontFamily: Lato-Black
  marginLeft: 10
`

const OkText = styled.Text`
  color: #fff
  fontFamily: Lato-Black
  marginLeft: 10
`
