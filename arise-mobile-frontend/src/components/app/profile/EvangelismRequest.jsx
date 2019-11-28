import React from 'react'
import { LoadingModal } from 'shared'
import { connect } from 'react-redux'
import { deleteEvangelismRequest } from 'ducks/evangelismRequestDuck'
import moment from 'moment'

// styles
import { Animated, Alert } from 'react-native'
import { Typography, Card } from 'styled'
import styled from 'styled-components'
import { CircleIcon } from 'styled'
import { Fa5Icon, EntypoIcon } from 'styled/icons'
import { bindActionCreators } from 'redux'

class EvangelismRequest extends React.PureComponent {
  state = {
    cardHeight: new Animated.Value(20),
    detailViewOpacity: new Animated.Value(0),
    isCardOpen: false,
    showDeleteIcon: false,
    isLoading: false
  }

  showDeleteIcon = () => this.setState({ showDeleteIcon: true })
  hideDeleteIcon = () => this.setState({ showDeleteIcon: false })

  toggleCard = () => {
    this.hideDeleteIcon()

    if (this.state.isCardOpen) {
      this.animateCardHeightTo(20)
      this.animateDetailViewOpacityTo(0)
      this.setState({ isCardOpen: false })
      return
    }

    this.animateCardHeightTo(110)
    this.animateDetailViewOpacityTo(1)
    this.setState({ isCardOpen: true })
  }

  animateCardHeightTo = height => {
    Animated.timing(this.state.cardHeight, {
      toValue: height,
      duration: 300
    }).start()
  }

  deleteEvangelismRequest = async () => {
    try {
      this.setState({ isLoading: true })
      const { userId, id } = this.props.evangelismRequest

      this.props.evangelismRequestActions.deleteEvangelismRequest(userId, id)
      this.setState({ isLoading: false })
    } catch (error) {}
  }

  animateDetailViewOpacityTo = opacity => {
    Animated.timing(this.state.detailViewOpacity, {
      toValue: opacity,
      duration: 300
    }).start()
  }

  showDeleteAlert = () => {
    Alert.alert(
      'Are you sure?',
      '',
      [
        {
          text: 'Delete',
          onPress: this.deleteEvangelismRequest,
          style: 'destructive'
        },
        { text: 'Cancel', style: 'cancel' }
      ],
      { cancelable: false }
    )
  }

  getDateFormatedFromProps = () =>
    moment(this.props.evangelismRequest.creationDate).format('DD/MM/YYYY')

  render() {
    return (
      <RequestCard onPress={this.toggleCard}>
        <ContainerAnimatedView style={{ height: this.state.cardHeight }}>
          <EvangelismIcon />
          {this.state.showDeleteIcon ? (
            <TrashIcon onPress={this.showDeleteAlert} />
          ) : (
            <OptionsIcon onPress={this.showDeleteIcon} />
          )}

          <Content>
            <Typography style={{ color: 'black' }}>
              Date: {this.getDateFormatedFromProps()}
            </Typography>
            <Animated.View style={{ opacity: this.state.detailViewOpacity, marginTop: 10 }}>
              <Typography type="body">
                Email: {this.props.evangelismRequest.applicantEmail}
              </Typography>
              <Typography type="body">
                Name: {this.props.evangelismRequest.applicantName}
              </Typography>
              <Typography type="body">
                Phone: {this.props.evangelismRequest.applicantPhone}
              </Typography>
            </Animated.View>
          </Content>
        </ContainerAnimatedView>

        {this.state.isLoading && <LoadingModal isVisible={this.state.isLoading} />}
      </RequestCard>
    )
  }
}

const mapDispatch = dispatch => ({
  evangelismRequestActions: bindActionCreators({ deleteEvangelismRequest }, dispatch)
})

export default connect(
  null,
  mapDispatch
)(EvangelismRequest)

// SC
const RequestCard = styled(Card)`
  margin-bottom: 16;
  margin-left: 10;
  margin-right: 10;
`

const ContainerAnimatedView = styled(Animated.View)`
  position: relative;
`

const Content = styled.View`
  margin-left: 30;
`

const EvangelismIcon = styled(CircleIcon).attrs(({ theme }) => ({
  size: 30,
  backgroundColor: theme.primary,
  icon: <Fa5Icon size={15} name="hands-helping" color="#fff" />
}))`
  position: absolute;
  left: -25;
  top: -5;
`

const OptionsIcon = styled(CircleIcon).attrs(({ theme }) => ({
  size: 30,
  backgroundColor: theme.background.icon,
  icon: <EntypoIcon size={15} name="dots-three-horizontal" color={theme.icon.dark} />
}))`
  position: absolute;
  right: -25;
  top: -5;
`

const TrashIcon = styled(CircleIcon).attrs(({ theme }) => ({
  size: 30,
  backgroundColor: theme.primary,
  icon: <Fa5Icon size={15} name="trash" color="#fff" />
}))`
  position: absolute;
  right: -25;
  top: -5;
`
