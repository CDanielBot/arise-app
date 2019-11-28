import React from 'react'
import { PostVariant } from './types'

// styles
import styled from 'styled-components'
import { Fa5Icon } from 'styled/icons'

const Badge = ({ type, size }) => {
  let BadgeIcon
  switch (type) {
    case 'article': {
      BadgeIcon = () => <Fa5Icon name="scroll" color="#fff" size={size ? size : 18} />
      break
    }
    case 'media': {
      BadgeIcon = () => (
        <Fa5Icon name="play" color="#fff" size={size ? size : 18} style={{ marginLeft: 4 }} />
      )
      break
    }
    case 'event': {
      BadgeIcon = () => <Fa5Icon name="calendar" color="#fff" size={size ? size : 18} />
      break
    }
    case 'post': {
      BadgeIcon = () => <Fa5Icon name="praying-hands" color="#fff" size={size ? size : 18} />
      break
    }
    case 'image': {
      BadgeIcon = () => <Fa5Icon name="camera" color="#fff" size={size ? size : 18} />
      break
    }
  }

  return (
    <Circle size={size}>
      <BadgeIcon />
    </Circle>
  )
}

const Circle = styled.View`
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.secondary};
  border-radius: 50;
  height: ${({ size }) => (size ? size * 2 : 40)};
  width: ${({ size }) => (size ? size * 2 : 40)};
  box-shadow: 0px 4px 7px rgba(0, 0, 0, 0.2);
`

Badge.propTypes = {
  type: PostVariant.isRequired
}

export default Badge
