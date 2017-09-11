import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { translate3d } from './utils'

class Card extends Component {
  constructor (props) {
    super(props)
    this.state = { initialPosition: { x: 0, y: 0 } }
    this.setPosition = this.setPosition.bind(this)
    this.handleTransitionEnd = this.handleTransitionEnd.bind(this)
  }
  setPosition () {
    const card = ReactDOM.findDOMNode(this)
    const initialPosition = {
      x: Math.round((this.props.containerSize.x - card.offsetWidth) / 2),
      y: Math.round((this.props.containerSize.y - card.offsetHeight) / 2)
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
    const { className = 'inactive' } = this.props
    var style = {
      ...translate3d(x, y),
      zIndex: this.props.index,
      ...this.props.style
    }

    return (
      <div style={style} className={`card ${className}`} onTransitionEnd={this.handleTransitionEnd}>
        {this.props.children}
      </div>
    )
  }
}

export default Card
