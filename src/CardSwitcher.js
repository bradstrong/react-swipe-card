import React, { createElement } from 'react'

import BaseCard from './BaseCard'
import DraggableCard from './DraggableCard'

const Card = ({ active = false, ...props }) => {
  const component = active ? DraggableCard : BaseCard
  return createElement(component, props)
}

export default Card
