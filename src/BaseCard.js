import React, {Component} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const BaseCard = styled.div`
  -webkit-touch-callout: none;
  user-select: none;

  background-color: #f8f3f3;
  background-size: cover;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  position: absolute;
  height: 50%;
  width: 50%;
  margin: 0;

  text-align: center;

  &:hover {
    cursor: grab;
  }

  // &:active {
  //   cursor: grabbing
  // }

  transform: ${props =>
    `translate3d(${props.initialX}px, ${props.initialY}px, 0px)`};
  z-index: ${props => `${props.index}`};

  // dragging
  ${props =>
    props.dragging
      ? `transition: box-shadow .3s; box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);`
      : ''} ${props =>
      props.animation
        ? `
  transition: transform .3s;
  transition-timing-function: ease-in-out;
  box-shadow: none;
  filter: blur(1px);`
        : ''} ${props => (props.ready ? `box-shadow: none;` : '')};
`;
BaseCard.displayName = 'BaseCard';

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {initialPosition: {x: 0, y: 0}};
    this.setPosition = this.setPosition.bind(this);
    this.handleTransitionEnd = this.handleTransitionEnd.bind(this);
  }
  setPosition() {
    const initialPosition = {
      x: Math.round(
        (this.props.containerSize.x - this.BaseCardElement.offsetWidth) / 2,
      ),
      y: Math.round(
        (this.props.containerSize.y - this.BaseCardElement.offsetHeight) / 2,
      ),
    };
    this.setState({initialPosition});
  }

  componentDidMount() {
    this.setPosition();
    window.addEventListener('resize', this.setPosition);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setPosition);
  }

  handleTransitionEnd(ev) {
    if (ev.propertyName === 'transform') {
      this.props.onCardReturn();
    }
  }

  render() {
    const {initialPosition: {x, y}} = this.state;
    const {animation, pristine, dragging, ready, index} = this.props;
    return (
      <BaseCard
        animation={animation}
        pristine={pristine}
        dragging={dragging}
        ready={ready}
        innerRef={el => (this.BaseCardElement = el)}
        onTransitionEnd={this.handleTransitionEnd}
        initialX={x}
        initialY={y}
        index={index}
        className={this.constructor.displayName}
        {...this.props}>
        {this.props.children}
      </BaseCard>
    );
  }
}

Card.defaultProps = {};

Card.propTypes = {
  children: PropTypes.node,
  containerSize: PropTypes.object,
  className: PropTypes.string,
  animation: PropTypes.bool,
  pristine: PropTypes.bool,
  dragging: PropTypes.bool,
  ready: PropTypes.bool,
  index: PropTypes.number,
  onCardReturn: PropTypes.func,
};

export default Card;
