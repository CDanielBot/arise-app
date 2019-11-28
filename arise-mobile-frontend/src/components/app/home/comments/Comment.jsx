import React from 'react'

// styles
import { View, Text } from 'react-native'
import { Card, Typography } from 'styled'
import { Fa5Icon } from 'styled/icons'
import styled from 'styled-components'

const Comment = ({ comment }) => {
  return (
    <Container>
      <AvatarIcon size={50} />

      <CommentCard>
        <LightText>{comment.name}</LightText>
        <Typography>{comment.comment}</Typography>
      </CommentCard>
    </Container>
  )
}

export default Comment

// SC
const Container = styled.View`
  flex-direction: row;
`

const CommentCard = styled(Card)`
  flex: 1;
`

const LightText = styled.Text`
  margin-bottom: 5;
`

const AvatarIcon = styled(Fa5Icon).attrs({
  name: 'user-circle'
})`
  color: ${({ theme }) => theme.icon.light};
  margin-right: 8;
`
