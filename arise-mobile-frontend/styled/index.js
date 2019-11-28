import React from 'react'
import { Text, TouchableOpacity, View, TextInput, ActivityIndicator, Platform } from 'react-native'
import styled, { css } from 'styled-components/native'
import { LinearGradient } from 'expo'
import { FeatherIcon, FaIcon, Fa5Icon } from './icons'

// -------------------------------- COMPONENTS --------------------------------

const CircleIconContainer = styled.TouchableOpacity.attrs({
  activeOpacity: 1
})`
  width: ${props => (props.size ? props.size : 35)};
  height: ${props => (props.size ? props.size : 35)};
  background-color: ${props => props.backgroundColor};
  border-radius: 50;
  align-items: center;
  justify-content: center;
`

export const CircleIcon = ({ icon, backgroundColor, size, ...restProps }) => (
  <CircleIconContainer {...restProps} size={size} backgroundColor={backgroundColor}>
    {icon}
  </CircleIconContainer>
)

export const Typography = styled.Text`
  ${() =>
    Platform.OS === 'ios'
      ? css`
          font-family: Avenir Next;
        `
      : css`
          font-family: Montserrat;
        `}
    
  ${({ theme }) => css`
    font-size: ${theme.font.size.body};
    font-weight: ${theme.font.weight.medium};
    color: ${theme.text.body.light};
  `}

  ${({ theme, type }) => {
    switch (type) {
      case 'title': {
        return css`
          font-size: ${theme.font.size.title};
          font-weight: ${theme.font.weight.bold};
          color: ${theme.text.title};
        `
      }
      case 'subtitle': {
        return css`
          font-size: ${theme.font.size.subtitle};
          color: ${theme.text.title};
          font-weight: ${theme.font.weight.bold};
        `
      }
      case 'label': {
        return css`
          color: ${theme.text.label};
        `
      }
      case 'header': {
        return css`
          font-size: ${theme.font.size.header};
          color: ${theme.text.body.dark};
        `
      }
      case 'text': {
        return css`
          font-weight: ${theme.font.weight.regular};
          color: ${theme.text.body.dark};
        `
      }
      case 'body': {
        return css`
          line-height: 26;
        `
      }
      case 'error': {
        return css`
          color: ${theme.text.error};
        `
      }
    }
  }}

  ${({ color }) =>
    color &&
    css`
      color: ${color};
    `}
`

// Touchable Card
const CardTouchable = styled.TouchableOpacity.attrs(({ activeOpacity }) => ({
  activeOpacity: activeOpacity ? activeOpacity : 0.6
}))`
  border-radius: 15;
  box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.09);
  border-radius: 15px;
  background-color: #fff;
  padding-top: 10;
  padding-right: 12;
  padding-bottom: 10;
  padding-left: 12;
`

// View Card
const CardView = styled.View`
  border-radius: 15;
  box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.09);
  border-radius: 15px;
  background-color: #fff;
  padding-top: 10;
  padding-right: 12;
  padding-bottom: 10;
  padding-left: 12;
`

export const Card = ({ onPress, children, ...restProps }) => {
  if (onPress) {
    return (
      <CardTouchable onPress={onPress} {...restProps}>
        {children}
      </CardTouchable>
    )
  }

  return <CardView {...restProps}>{children}</CardView>
}

// Buttons
const ButtonText = styled(Typography)`
  color: ${({ color }) => (color ? color : '#fff')};
  text-align: center;
  font-size: ${({ theme }) => theme.font.size.button};
`

const PillTouchableOpacity = styled.TouchableOpacity`
  ${({ shadow }) =>
    shadow &&
    css`
      box-shadow: 0 5px 5px rgba(238, 46, 46, 0.55);
      elevation: 5;
    `}

  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
`

const FlatButtonTouchable = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  height: 40;

  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
`

export const ButtonContainer = styled.TouchableOpacity.attrs({
  activeOpacity: 0.6
})`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 50;
  padding-left: 25;
  padding-right: 25;
  background-color: rgb(0, 122, 255);
  border-radius: 50;
`

const GradientButtonContainer = ({ children }) => (
  <LinearGradient
    colors={['#EE2E2E', '#ED4D4D', '#EC6D6D']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 2 }}
    style={{
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      height: 50,
      paddingLeft: 25,
      paddingRight: 25,
      borderRadius: 50
    }}
  >
    {children}
  </LinearGradient>
)

const AnonymousButtonContainer = styled(ButtonContainer)`
  background-color: #e5e5e5;
`

const FacebookButtonContainer = styled(ButtonContainer)`
  background-color: rgb(59, 89, 152);
`

const GoogleButtonContainer = styled(ButtonContainer)`
  background-color: rgb(219, 50, 54);
`

// Utils
export const Hr = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.border.light};
  flex: 1;
  color: #c8c7cc;
`

const DividerText = styled.Text`
  margin-left: 15;
  margin-right: 15;
  color: #c8c7cc;
`

const DividerSection = styled.View`
  flex-direction: row;
  align-items: center;
`

const MenuOptionContainer = styled.TouchableOpacity`
  width: 100%;
  height: 60;
  border-color: ${({ theme }) => theme.border.light};
  flex-direction: row;
  align-items: center;
  padding-left: 20;
  padding-right: 10;
`

const MenuOptionIconContainer = styled.View`
  justify-content: center;
  margin-right: 30;
`

const MenuOptionValue = styled(Typography).attrs({
  type: 'label'
})`
  margin-right: 8;
`

// Controls
const InputText = styled.TextInput`
  height: 35;
  flex: 1;
  color: ${({ theme }) => theme.text.body.dark};
  font-size: ${({ theme }) => theme.font.size.body};
`

const InputContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 45;
  padding-left: 25;
  padding-right: 25;
  border-radius: 50;
  border-width: 1.2;
  background-color: #fff;
  border-color: ${({ theme }) => theme.border.light};

  ${({ multiline }) =>
    multiline &&
    css`
      height: 200;
      align-items: flex-start;
      padding-top: 10;
      padding-bottom: 10;
      border-radius: 15;
    `}
`

// -------------------------------- EXPORTS --------------------------------

// Buttons
const LeftIconContainer = styled.View`
  margin-right: 15px;
`

const RightIconContainer = styled.View`
  margin-left: 15px;
`

export const PillButton = ({
  leftIcon,
  rightIcon,
  onPress,
  loading,
  shadow,
  disabled,
  children,
  ...restProps
}) => (
  <PillTouchableOpacity
    disabled={disabled || loading}
    onPress={onPress}
    activeOpacity={0.6}
    shadow={shadow}
    {...restProps}
  >
    <GradientButtonContainer>
      {leftIcon && <LeftIconContainer>{leftIcon}</LeftIconContainer>}
      {loading && <ActivityIndicator color="white" style={{ marginRight: 10 }} />}
      <ButtonText>{children}</ButtonText>
      {rightIcon && <RightIconContainer>{rightIcon}</RightIconContainer>}
    </GradientButtonContainer>
  </PillTouchableOpacity>
)

export const FlatButton = ({ onPress, disabled, color, children, ...restProps }) => (
  <FlatButtonTouchable {...restProps} disabled={disabled} onPress={onPress}>
    <ButtonText color={color}>{children}</ButtonText>
  </FlatButtonTouchable>
)

export const AnonymousButton = ({ icon, onPress, children, ...restProps }) => (
  <AnonymousButtonContainer onPress={onPress} {...restProps}>
    <LeftIconContainer>
      <Fa5Icon name="user" color="#8A8A8F" size={24} />
    </LeftIconContainer>

    <ButtonText color="#8A8A8F">{children}</ButtonText>
  </AnonymousButtonContainer>
)

export const FacebookButton = ({ onPress, children, ...restProps }) => (
  <FacebookButtonContainer onPress={onPress} {...restProps}>
    <LeftIconContainer>
      <Fa5Icon name="facebook-f" color="#fff" size={24} />
    </LeftIconContainer>

    <ButtonText>{children}</ButtonText>
  </FacebookButtonContainer>
)

export const GoogleButton = ({ onPress, children, ...restProps }) => (
  <GoogleButtonContainer onPress={onPress} {...restProps}>
    <LeftIconContainer>
      <Fa5Icon size={24} color="#fff" name="google" />
    </LeftIconContainer>

    <ButtonText>{children}</ButtonText>
  </GoogleButtonContainer>
)

export const DividerWithText = ({ children, ...restProps }) => (
  <DividerSection {...restProps}>
    <Hr />
    <DividerText>{children}</DividerText>
    <Hr />
  </DividerSection>
)

export const Input = ({ icon, style, rightAction, multiline, ...restProps }) => (
  <InputContainer multiline={multiline} style={style}>
    {icon && <LeftIconContainer>{icon}</LeftIconContainer>}
    <View style={{ flex: 1 }}>
      <InputText multiline={multiline} {...restProps} />
    </View>
    {rightAction && <RightIconContainer>{rightAction}</RightIconContainer>}
  </InputContainer>
)

export const MenuOption = ({
  icon,
  onPress,
  rightChevron = true,
  value,
  children,
  ...restProps
}) => (
  <MenuOptionContainer onPress={onPress} {...restProps}>
    <React.Fragment>
      {icon && <MenuOptionIconContainer>{icon}</MenuOptionIconContainer>}
      <View style={{ flex: 1 }}>{children}</View>
      {value && <MenuOptionValue>{value}</MenuOptionValue>}
      {rightChevron && <FeatherIcon size={22} name="chevron-right" color="#C8C7CC" />}
    </React.Fragment>
  </MenuOptionContainer>
)

export const MenuOptionSelect = ({ icon, selected, onPress, children, ...restProps }) => (
  <MenuOptionContainer onPress={onPress} {...restProps}>
    <React.Fragment>
      <View style={{ flex: 1 }}>{children}</View>
      {selected && <FeatherIcon size={22} name="check" color="#4cd964" />}
    </React.Fragment>
  </MenuOptionContainer>
)

export const RadioButton = ({ selected, marginRight }) => (
  <RadioButtonContainer selected={selected} marginRight={marginRight}>
    <RadioButtonFill selected={selected} />
  </RadioButtonContainer>
)

const RadioButtonContainer = styled.View`
  width: 20;
  height: 20;
  border: 2px solid ${({ theme }) => theme.secondary};
  border-radius: 50;
  align-items: center;
  justify-content: center;
  margin-right: ${({ marginRight }) => marginRight && 15};

  ${({ theme, selected }) =>
    selected &&
    css`
      border-color: ${theme.primary};
    `};
`

const RadioButtonFill = styled.View`
  width: 10;
  height: 10;
  background-color: ${({ theme, selected }) => (selected ? theme.primary : '#fff')};
  border-radius: 50;
`

export const TabButton = ({ isSelected, onPress, children, ...restProps }) => (
  <TabButtonContainer {...restProps} isSelected={isSelected} onPress={onPress}>
    <Typography color={isSelected ? '#ee2e2e' : null}>{children}</Typography>
  </TabButtonContainer>
)

const TabButtonContainer = styled.TouchableOpacity`
  padding-left: 20;
  padding-right: 20;
  padding-top: 4;
  padding-bottom: 4;
  align-items: center;
  border-radius: 50;
  background-color: ${({ theme, isSelected }) => (isSelected ? theme.background.tab : '#fff')};
`
