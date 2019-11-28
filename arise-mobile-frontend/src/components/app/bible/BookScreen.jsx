import Books from './Books'
import React from 'react'
import {
  FlatList, ImageBackground, SafeAreaView,
  StatusBar, TextInput
} from 'react-native'
import { FlatButton } from 'styled'
import { Transition } from 'react-navigation-fluid-transitions'
import { connect } from 'react-redux'
import styled from 'styled-components'

class BookScreen extends React.Component {

  state = {
    searchText: '',
    activeBook: null,
    activeChapter: 1,
  }

  render() {
    const { searchText } = this.state
    const data = Books.filter(book => {
      const { searchText } = this.state
      if (searchText === '') {
        return true
      }
      return book.name_id.toLowerCase().indexOf(searchText.toLocaleLowerCase()) !== -1
    }).map(book => ({ ...book, key: book.value }))
    return (
      <SafeAreaContainer>
        <StatusBar backgroundColor="#282C32" barStyle="light-content" />
        <HeaderView>
          <HeaderText>Bibleify</HeaderText>
        </HeaderView>
        <SearchView>
          <SearchField
            placeholder={'Search...'}
            placeholderTextColor={'#999'}
            value={searchText}
            onChangeText={searchText => this.setState({ searchText })}
          />
        </SearchView>

        <FlatList
          data={data}
          renderItem={({ item, index }) => {
            const book = item
            return (
              <ItemWrapView key={index}>
                <ItemImgButton
                  onPress={() => {
                    this.setState({ activeBook: book })
                  }}
                >
                  <Transition shared={`book-${book.value}`}>
                    <ImageBackground source={book.image} style={styles.item}>
                      <ItemText>{book.name_id}</ItemText>
                    </ImageBackground>
                  </Transition>
                </ItemImgButton>
              </ItemWrapView>
            )
          }}
        />

        {this.renderChapterPicker()}
      </SafeAreaContainer>
    )
  }
}

export default connect(
  state => ({ state: state.bible }),
  dispatch => ({ dispatch }),
)(BookScreen)

const SafeAreaContainer = styled(SafeAreaView)`
  flex: 1
  backgroundColor: '#282C32'
`

const HeaderView = styled.View`
  paddingHorizontal: 32
  paddingTop: 32
`

const HeaderText = styled.Text`
  fontSize: 32
  fontFamily: 'Lato-Black
  color: '#fff'
`

const SearchView = styled.View`
  paddingHorizontal: 32
  marginBottom: 20
  marginTop: 8
`

const SearchField = styled(TextInput)`
  height: 38
  borderRadius: 8
  backgroundColor: 'rgba(255,255,255,0.1)'
  paddingHorizontal: 10
  fontFamily: 'Lato-Regular'
  color: '#fff'
  lineHeight: 20
`

const ItemWrapView = styled.View`
  marginBottom: 4
`

const ItemImgButton = styled(FlatButton)`
  borderRadius: 12
  overflow: 'hidden'
`

const ItemText = styled.Text`
  color: '#fff'
  fontFamily: 'Lato-Black'
  fontSize: 18
  position: 'absolute'
  bottom: 16
  left: 16
`