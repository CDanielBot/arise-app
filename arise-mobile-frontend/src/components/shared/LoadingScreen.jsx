import React from 'react'
import { View, ActivityIndicator, StatusBar } from 'react-native'
import styled from 'styled-components/native'

export default (LoadingScreen = () => (
  <ViewContainer>
    <ActivityIndicator />
    <StatusBar barStyle="default" />
  </ViewContainer>
))

const ViewContainer = styled.View`
  flex: 1;
  background-color: #fff;
  align-items: center;
  justify-content: center;
`
