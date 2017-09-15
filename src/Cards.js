import React, { Component, cloneElement } from 'react'
import ReactDOM from 'react-dom'
import { DIRECTIONS } from './utils'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const AlertWrapper = styled.div`
  width: 45%;
  min-height: 10%;
  position: absolute;
  z-index: 9999;
  opacity: 0;
  color: white;
  vertical-align: middle;
  line-height: 3rem;
  transition-property: opacity; transition-duration: .5s;

  // visible
  ${props => props.visible ? `opacity: 1; transition-property: opacity; transition-duration: .5s;` : ''}

  // top
  ${props => props.position === 'top' ? `
    background: purple;
    border-radius: 50px;
    transform: translate(-50%, 0);
    margin-left: 50%;
    ` : ''}


  // right
  ${props => props.position === 'right' ? `
    top: 0;
    right: 0;
    background: green;
    border-top-left-radius: 50px;
    border-bottom-left-radius: 50px;
    ` : ''}
  
  // bottom
  ${props => props.position === 'bottom' ? `
    bottom: 0;
    background: blue;
    border-top-left-radius: 50px;
    border-radius: 50px;
    transform: translate(-50%, 0);
    margin-left: 50%;
    ` : ''}

   // left
   ${props => props.position === 'left' ? `
   top: 0;
   left: 0;
   background: red;
   border-top-right-radius: 50px;
   border-bottom-right-radius: 50px;
    ` : ''}
`
AlertWrapper.displayName = 'AlertWrapper';

const Stage = styled.div`
  margin: 20px auto;
  position: relative;
  min-height: 300px;
  overflow: hidden;
`
Stage.displayName = 'Stage';

const Stack = styled.div``
Stack.displayName = 'Stack';

class SwipeCards extends Component {
  constructor (props) {
    super(props)
    this.state = {
      index: 0,
      alertLeft: false,
      alertRight: false,
      alertTop: false,
      alertBottom: false,
      containerSize: { x: 0, y: 0 }
    }
    this.removeCard = this.removeCard.bind(this)
    this.displayAlert = this.displayAlert.bind(this)
    this.setSize = this.setSize.bind(this)
  }

  displayAlert (side, cardId) {
    const { alertDuration } = this.props
    setTimeout(() => this.setState({ [`alert${side}`]: false }), alertDuration)
    this.setState({
      [`alert${side}`]: true
    })
  }

  removeCard (side, cardId) {
    const { children, onEnd } = this.props
    if (children.length === (this.state.index + 1) && onEnd) onEnd()
    
    this.displayAlert(side, cardId)

    this.setState({
      index: this.state.index + 1,
    })
  }
  
  componentDidMount () {
    this.setSize()
    window.addEventListener('resize', this.setSize)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.setSize)
  }

  setSize () {
    const container = this.stageElement;
    const containerSize = {
      x: container.offsetWidth,
      y: container.offsetHeight
    }
    this.setState({ containerSize })
  }

  render () {
    const { index, containerSize } = this.state
    const { children, className, onSwipeTop, onSwipeBottom, swipeTolerance, style } = this.props
    if (!containerSize.x || !containerSize.y) return  <Stage innerRef={el => this.stageElement = el}/>

    const renderAlerts = DIRECTIONS.map(d => 
      <AlertWrapper
        key={d}
        position={`${d.toLowerCase()}`}
        visible={this.state[`alert${d}`]}>
        {this.props[`alert${d}`]}
      </AlertWrapper>
    )

    const renderCards = children.reduce((memo, c, i) => {
      if (index > i) return memo
      const props = {
        key: i,
        containerSize,
        index: children.length - i,
        swipeTolerance,
        ...DIRECTIONS.reduce((m, d) => 
          ({ ...m, [`onOutScreen${d}`]: () => this.removeCard(d) }), {}),
        active: index === i
      }
      return [ cloneElement(c, props), ...memo ]
    }, [])
    
    return (
      <Stage innerRef={el => this.stageElement = el}>
        {renderAlerts}
        <Stack>{renderCards}</Stack>
      </Stage>
    )
  }
}

SwipeCards.defaultProps = {
  swipeTolerance : 50,
  alertDuration: 300
}

SwipeCards.propTypes = {
  /** Distance from edge of stage a card must be in order to be 'swiped' */
  swipeTolerance: PropTypes.number.isRequired,

   /** Time (in milliseconds) that alerts will be visible on screen */
  alertDuration: PropTypes.number.isRequired,

  /** Function to fire when no cards remain */
  onEnd: PropTypes.func
}

export default SwipeCards