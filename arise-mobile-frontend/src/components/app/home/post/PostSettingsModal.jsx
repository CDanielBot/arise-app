import React from 'react'
import Modal from 'react-native-modal'

// styles
import styled from 'styled-components'
import { Typography } from 'styled'
import { View, TouchableOpacity } from 'react-native'

const PostSettingsModal = ({ onClose, isVisible }) => {
  return (
    <Modal
      style={{ justifyContent: 'flex-end' }}
      isVisible={isVisible}
      backdropOpacity={0.3}
      onBackdropPress={onClose}
    >
      <React.Fragment>
        <OptionContainer>
          <OptionButton>
            <Typography type="header">Hello there</Typography>
          </OptionButton>
          <OptionButton>
            <Typography type="header">Hello there</Typography>
          </OptionButton>
          <OptionButton>
            <Typography type="header">Hello there</Typography>
          </OptionButton>
        </OptionContainer>

        <OptionContainer style={{ marginTop: 10 }}>
          <OptionButton onPress={onClose}>
            <Typography type="header">Cancel</Typography>
          </OptionButton>
        </OptionContainer>
      </React.Fragment>
    </Modal>
  )
}

export default PostSettingsModal

// SC
const OptionContainer = styled.View`
  background-color: white;
  border-radius: 10;
  overflow: hidden;
`

const OptionButton = styled.TouchableOpacity`
  height: 60;
  align-items: center;
  justify-content: center;
`
