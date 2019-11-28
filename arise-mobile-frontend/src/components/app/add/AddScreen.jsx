import React from 'react'

// styles
import styled from 'styled-components'
import { View } from 'react-native'
import { Card, Typography, CircleIcon } from 'styled'
import { Fa5Icon } from 'styled/icons'
import theme from 'theme'

const AddScreen = ({ navigation }) => {
  navigateTo = screen => () => {
    navigation.navigate(screen)
  }

  return (
    <ViewContainer>
      <Typography style={{ marginBottom: 50 }} type="title">
        Create new
      </Typography>

      <Container>
        <CreateCard onPress={navigateTo('EvangelismRequestForm')}>
          <CardIcon
            size={60}
            backgroundColor={theme.background.icon}
            icon={<Fa5Icon size={30} name="hands-helping" color={theme.icon.dark} />}
          />
          <Typography>Evangelism Request</Typography>
        </CreateCard>

        <CreateCard onPress={navigateTo('PrayerForm')}>
          <CardIcon
            size={60}
            backgroundColor={theme.background.icon}
            icon={<Fa5Icon size={30} name="praying-hands" color={theme.icon.dark} />}
          />
          <Typography>Prayer</Typography>
        </CreateCard>
      </Container>
    </ViewContainer>
  )
}

export default AddScreen

// SC
const ViewContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`

const Container = styled.View`
  width: 100%;
  padding-left: 20;
  padding-right: 20;
`

const CreateCard = styled(Card)`
  flex-direction: row;
  align-items: center;
  border-radius: 50;
  padding-right: 17;
  margin-bottom: 20;
`

const CardIcon = styled(CircleIcon)`
  margin-right: 10;
`
