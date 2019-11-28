import React from 'react'
import { withNavigation } from 'react-navigation'
import PostActions from './post/PostActions'
import Badge from './post/Badge'

// styled
import { ScrollView, View, Text } from 'react-native'
import { Typography } from 'styled'
import { Fa5Icon } from 'styled/icons'
import { HeaderBackButton } from 'shared'
import styled from 'styled-components'

const ContentScreen = ({ navigation }) => {
  const post = navigation.getParam('post')

  return (
    <ScrollContainer>
      <BadgeContainer>
        <Badge size={40} type={post.type} />
      </BadgeContainer>

      {post.title ? <Subtitle>{post.title}</Subtitle> : null}

      <UserContainer>
        <AvatarIcon size={18} />
        <Text>
          {post.firstName} {post.lastName}
        </Text>
      </UserContainer>

      <ContentContainer>
        <Typography type="body">{post.post}</Typography>
      </ContentContainer>

      <ActionsContainer>
        <PostActions post={post} />
      </ActionsContainer>
    </ScrollContainer>
  )
}

ContentScreen.navigationOptions = ({ navigation }) => ({
  // title: 'Article ID',
  headerLeft: <HeaderBackButton navigation={navigation} showIcon />,
  headerStyle: {
    borderBottomWidth: 0
  }
})

export default withNavigation(ContentScreen)

// SC
const ScrollContainer = styled.ScrollView.attrs({
  contentContainerStyle: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    flexGrow: 1
  }
})`
  flex-grow: 1;
`

const BadgeContainer = styled.View`
  align-items: center;
  margin-bottom: 50;
`

const Subtitle = styled(Typography).attrs({
  size: 18,
  type: 'subtitle'
})`
  margin-bottom: 20;
`

const UserContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 20;
`

const AvatarIcon = styled(Fa5Icon).attrs({
  name: 'user-circle'
})`
  color: ${({ theme }) => theme.icon.light};
  margin-right: 8;
`

const ContentContainer = styled.View`
  flex: 1;
`

const ActionsContainer = styled.View`
  padding-top: 20;
  padding-bottom: 20;
`
