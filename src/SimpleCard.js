import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { translate3d } from './utils'
import styled from 'styled-components'

const SimpleCard = styled.div`
  -webkit-touch-callout: none;
  user-select: none;

  background-color: white;
  background-size: cover;
  position: absolute;
  background: #F8F3F3;
  height: 200px;
  width: 180px;
  margin: 0 auto;
  text-align: center;

  cursor: pointer;
  transform: ${props => `translate3d(${props.initialX}px, ${props.initialY}px, 0px)`};
  transform: ${props => `translate3d(${props.x}px, ${props.y}px, 0px)`};
  z-index: ${props => `${props.index}`};

  // dragging
  ${props => props.dragging ? `transition: box-shadow .3s; box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);` : ''}

  // animating
  ${props => props.animation ? `
  transition: transform .3s;
  transition-timing-function: ease-in-out;
  box-shadow: none;
  filter: blur(1px);`
  : ''}
  
  // ready
  ${props => props.ready ? `box-shadow: none;` : ''}

`
SimpleCard.displayName = 'SimpleCard';

class Card extends Component {
  constructor (props) {
    super(props)
    this.state = { initialPosition: { x: 0, y: 0 } }
    this.setPosition = this.setPosition.bind(this)
    this.handleTransitionEnd = this.handleTransitionEnd.bind(this)
  }
  setPosition () {
    const initialPosition = {
      x: Math.round((this.props.containerSize.x - this.simpleCardElement.offsetWidth) / 2),
      y: Math.round((this.props.containerSize.y - this.simpleCardElement.offsetHeight) / 2)
    }
    this.setState({ initialPosition })
  }

  componentDidMount () {
    this.setPosition()
    window.addEventListener('resize', this.setPosition)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.setPosition)
  }

  handleTransitionEnd (ev) {
    if (ev.propertyName === 'transform') {
    this.props.onCardReturn();
    }
  }

  render () {
    const { initialPosition: { x, y } } = this.state
    const { className = 'inactive', animation, pristine, dragging, ready, index} = this.props

    return (
      <SimpleCard
      {...this.props}
        animation={animation}
        pristine={pristine}
        dragging={dragging}
        ready={ready}
        innerRef={el => this.simpleCardElement = el}
        onTransitionEnd={this.handleTransitionEnd}
        initialX={x}
        initialY={y}
        index={index}>
        {this.props.children}
      </SimpleCard>
    )
  }
}

export default Card
