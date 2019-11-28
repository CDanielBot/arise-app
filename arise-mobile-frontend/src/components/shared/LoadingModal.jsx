import React from 'react'
import Modal from 'react-native-modal'

// styles
import styled from 'styled-components'
import { Card } from 'styled'
import { ActivityIndicator } from 'react-native'

export default ({ isVisible }) => {
  return (
    <Modal
      animationIn="fadeIn"
      style={{ justifyContent: 'center', alignItems: 'center' }}
      isVisible={isVisible}
      backdropOpacity={0.3}
    >
      <LoadingCard>
        <ActivityIndicator size="small" />
      </LoadingCard>
    </Modal>
  )
}

// SC
const LoadingCard = styled(Card)`
  padding-top: 30;
  padding-right: 30;
  padding-bottom: 30;
  padding-left: 30;
`
