import React from 'react'

// styles
import { View } from 'react-native'
import { Typography } from 'styled'
import { FaIcon } from 'styled/icons'
import styled from 'styled-components'

const EmptyScreen = () => {
  return (
    <View style={{ alignItems: 'center' }}>
      <CommentIcon size={75} />
      <Typography>Be the first to comment</Typography>
    </View>
  )
}

const CommentIcon = styled(FaIcon).attrs({
  name: 'comment-o'
})`
  color: ${({ theme }) => theme.icon.medium};
  margin-bottom: 20;
  margin-top: 30%;
`

export default EmptyScreen
