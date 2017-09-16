import React, {Component} from 'react';
import Hammer from 'hammerjs';
import ReactDOM from 'react-dom';
import BaseCard from './BaseCard';
import {translate3d} from './utils';

class DraggableCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
      initialPosition: {x: 0, y: 0},
      startPosition: {x: 0, y: 0},
      animation: false,
      pristine: true,
      ready: true,
      dragging: false,
    };
    this.resetPosition = this.resetPosition.bind(this);
    this.handlePan = this.handlePan.bind(this);

    this.resetAnimation = this.resetAnimation.bind(this);
  }
  resetPosition() {
    const {x, y} = this.props.containerSize;
    const card = ReactDOM.findDOMNode(this);

    const initialPosition = {
      x: Math.round((x - card.offsetWidth) / 2),
      y: Math.round((y - card.offsetHeight) / 2),
    };

    this.setState({
      x: initialPosition.x,
      y: initialPosition.y,
      initialPosition: initialPosition,
      startPosition: {x: 0, y: 0},
    });
  }

  resetAnimation() {
    const {x, y, animation, initialPosition} = this.state;
    if (animation && initialPosition.x === x && initialPosition.y === y) {
      this.setState({
        animation: false,
        ready: true,
      });
    }
  }

  panstart() {
    const {x, y} = this.state;
    this.setState({
      animation: false,
      startPosition: {x, y},
      pristine: false,
      ready: false,
      dragging: true,
    });
  }
  panend(ev) {
    const screen = this.props.containerSize;
    const swipeTolerance = this.props.swipeTolerance;
    const card = ReactDOM.findDOMNode(this);

    const getDirection = () => {
      switch (true) {
        case this.state.x < swipeTolerance:
          return 'Left';
        case this.state.x + card.offsetWidth > screen.x - swipeTolerance:
          return 'Right';
        case this.state.y < swipeTolerance:
          return 'Top';
        case this.state.y + card.offsetHeight > screen.y - swipeTolerance:
          return 'Bottom';
        default:
          return false;
      }
    };
    const direction = getDirection();

    if (this.props[`onSwipe${direction}`]) {
      this.props[`onSwipe${direction}`]();
      this.props[`onOutScreen${direction}`](this.props.index);
    } else {
      this.setState({
        animation: true,
        dragging: false,
      });
      this.resetPosition();
    }
  }
  panmove(ev) {
    this.setState(this.calculatePosition(ev.deltaX, ev.deltaY));
  }
  pancancel(ev) {
    console.log(ev.type);
  }

  handlePan(ev) {
    ev.preventDefault();
    this[ev.type](ev);
    return false;
  }

  handleSwipe(ev) {
    console.log(ev.type);
  }

  calculatePosition(deltaX, deltaY) {
    const {initialPosition: {x, y}} = this.state;
    return {
      x: x + deltaX,
      y: y + deltaY,
    };
  }

  componentDidMount() {
    this.hammer = new Hammer.Manager(ReactDOM.findDOMNode(this));
    this.hammer.add(new Hammer.Pan({threshold: 2}));

    this.hammer.on('panstart panend pancancel panmove', this.handlePan);
    this.hammer.on(
      'swipestart swipeend swipecancel swipemove',
      this.handleSwipe,
    );

    this.resetPosition();
    window.addEventListener('resize', this.resetPosition);
  }
  componentWillUnmount() {
    if (this.hammer) {
      this.hammer.stop();
      this.hammer.destroy();
      this.hammer = null;
    }
    window.removeEventListener('resize', this.resetPosition);
  }
  render() {
    const {
      x,
      y,
      animation,
      pristine,
      ready,
      dragging,
      initialPosition,
    } = this.state;
    const translate = translate3d(x, y);
    const style = {...this.props.style, ...translate};

    return (
      <BaseCard
        onCardReturn={this.resetAnimation}
        animation={animation}
        pristine={pristine}
        dragging={dragging}
        ready={ready}
        x={x}
        y={y}
        style={style}
        {...this.props}
      />
    );
  }
}

export default DraggableCard;
