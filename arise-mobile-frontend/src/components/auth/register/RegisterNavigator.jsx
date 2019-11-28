import { createStackNavigator } from 'react-navigation'
import { zoomOut, fromRight } from 'react-navigation-transitions'
import RegisterStep1Screen from './RegisterStep1Screen'
import RegisterStep2Screen from './RegisterStep2Screen'
import RegisterFinalScreen from './RegisterFinalScreen'

const transitionTime = 350

const applyCustomTransitions = ({ scenes }) => {
  const prevScene = scenes[scenes.length - 2]
  const nextScene = scenes[scenes.length - 1]

  if (
    prevScene &&
    prevScene.route.routeName === 'Step2' &&
    nextScene.route.routeName === 'StepFinal'
  ) {
    return zoomOut(transitionTime)
  }

  return fromRight(transitionTime)
}

export default createStackNavigator(
  {
    Step1: RegisterStep1Screen,
    Step2: RegisterStep2Screen,
    StepFinal: RegisterFinalScreen
  },
  {
    headerLayoutPreset: 'center',
    cardShadowEnabled: false,
    transitionConfig: navigation => applyCustomTransitions(navigation)
  }
)
