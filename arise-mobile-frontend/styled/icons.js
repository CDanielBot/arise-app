import { React } from 'react'
import { Platform } from 'expo-core'
import styled from 'styled-components'
import Icon from '../node_modules/react-native-vector-icons/Feather'
import FontAwesome5 from '../node_modules/react-native-vector-icons/FontAwesome5'

export { default as FaIcon } from '@expo/vector-icons/FontAwesome'
export { default as FeatherIcon } from '@expo/vector-icons/Feather'
export { default as FoundationIcon } from '@expo/vector-icons/Foundation'
export { default as MatIcon } from '@expo/vector-icons/MaterialIcons'
export { default as MatComIcon } from '@expo/vector-icons/MaterialCommunityIcons'
export { default as AntIcon } from '@expo/vector-icons/AntDesign'
export { default as EntypoIcon } from '@expo/vector-icons/Entypo'


const FontAwesome5Android = styled(FontAwesome5).attrs({
  solid: true
})``

const Fa5Icon = Platform.OS === 'ios' ? FontAwesome5 : FontAwesome5Android

const ChevronRightIcon = ({ size, color }) => (
   <Icon size={size} name="chevron-right" color={color} />
)

const ChevronLeftIcon =  ({ size, color }) => (
   <Icon size={size} name="chevron-left" color={color} />
)

export { Fa5Icon, ChevronRightIcon, ChevronLeftIcon }
