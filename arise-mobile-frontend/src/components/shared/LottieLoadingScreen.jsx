import React from 'react'
import LottieView from 'lottie-react-native'
import styled from 'styled-components/native'
import { View, StatusBar } from 'react-native'

const LottieLoadingScreen = () => (
  <ViewContainer>
    <LottieView source={require('./lottie_loader.json')} autoPlay loop />
  </ViewContainer>
)

const ViewContainer = styled.View`
  flex: 1;
  background-color: #fff;
  align-items: center;
  justify-content: center;
`

export default LottieLoadingScreen
