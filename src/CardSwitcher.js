import {createElement} from 'react';
import BaseCard from './BaseCard';
import DraggableCard from './DraggableCard';
import PropTypes from 'prop-types';

const Card = ({active = false, ...props}) => {
  const component = active ? DraggableCard : BaseCard;
  return createElement(component, props);
};

Card.propTypes = {
  /** Used to identify the top most card in the stack */
  active: PropTypes.bool,
};

Card.defaultProps = {
  active: false,
};

export default Card;
