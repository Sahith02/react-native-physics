import React from 'react';
import {
  View
} from 'react-native';

class Box extends React.Component {
  constructor(props) {
    super(props);
    this.getNextVelocity = this.getNextVelocity.bind(this);
  }

  render() {
    let { outline, height, width, position, children } = this.props;
    return (
      <View
        style={{
          position: 'absolute',
          borderWidth: outline ? 1 : 0,
          borderColor: outline === true ? 'red' : outline ? outline : null,
          height: height || this.state.height,
          width: width || this.state.width,
          left: this.state.position.x,
          top: this.state.position.y,
        }}
        onLayout={e => {
          let { width, height } = e.nativeEvent.layout;
          this.setState({
            height: height,
            width: width
          });
        }}
      >
        {children}
      </View>
    );
  }

  componentWillMount() {
    let { position, velocity, acceleration, gravity, bounce, drag, anchor } = this.props;
    this.setState({
      position: {
        x: position.x || 0,
        y: position.y || 0
      },
      velocity: {
        x: velocity.x || 0,
        y: velocity.y || 0
      },
      acceleration: {
        x: acceleration.x / 60 || 0,
        y: acceleration.y / 60 || 0
      },
      drag: {
        x: drag.x || 0,
        y: drag.y || 0
      },
      gravity: {
        x: gravity.x / 60 || 0,
        y: gravity.y / 60 || 0
      },
      bounce: {
        x: bounce.x || 0,
        y: bounce.y || 0
      },
      anchor: {
        x: anchor.x || 0,
        y: anchor.y || 0
      }
    });
  }

  componentDidMount() {
    this.update = setInterval(this.getNextVelocity, 17);
  }

  componentWillUnmount() {
    clearInterval(this.update);
  }

  getNextVelocity() {
    // console.log('STATE:', this.state);
    let { velocity, drag, acceleration, gravity, bounce, position, height, width } = this.state;

    let nextVelocity = {
      x: velocity.x,
      y: velocity.y
    }

    let nextDrag = {
      x: nextVelocity.x === 0 || drag.x === 0 ? 0 : nextVelocity.x > 0 ? -drag.x : nextVelocity.x < 0 ? drag.x : 0,
      y: nextVelocity.y === 0 || drag.y === 0 ? 0 : nextVelocity.y > 0 ? -drag.y : nextVelocity.y < 0 ? drag.y : 0
    }

    let nextAcceleration = {
      x: acceleration.x + nextDrag.x + gravity.x,
      y: acceleration.y + nextDrag.y + gravity.y
    }

    nextVelocity.x += nextAcceleration.x;
    nextVelocity.y += nextAcceleration.y;

    if (this.props.collideWithContainer) {
      if ((position.x <= 0 && velocity.x < 0) || (position.x + width >= this.props.container.width && velocity.x > 0)) {
        nextVelocity.x = velocity.x * -bounce.x;
        this.setState({
          acceleration: {
            x: 0,
            y: acceleration.y
          }
        });
      }
      if ((position.y <= 0 && velocity.y < 0) || (position.y + height >= this.props.container.height && velocity.y > 0)) {
        nextVelocity.y = velocity.y * -bounce.y;
        this.setState({
          acceleration: {
            x: acceleration.x,
            y: 0
          }
        });
      }
    }

    this.setState({
      velocity: {
        x: nextVelocity.x,
        y: nextVelocity.y
      }
    }, this.moveToNewPosition)
  }

  moveToNewPosition() {
    let { position, velocity, width, height } = this.state;
    let { collideWithContainer, container } = this.props;
    let nextPosition = {
      x: position.x + velocity.x,
      y: position.y + velocity.y
    }

    if (collideWithContainer) {
      if (nextPosition.x < 0) {
        nextPosition.x = 0;
      } else if (nextPosition.x + width > container.width) {
        nextPosition.x = container.width - width;
      }
      if (nextPosition.y < 0) {
        nextPosition.y = 0;
      } else if (nextPosition.y + height > container.height) {
        nextPosition.y = container.height - height;
      }
    }

    this.setState({
      position: {
        x: nextPosition.x,
        y: nextPosition.y
      }
    });
  }
}

Box.propTypes = {
  physics: React.PropTypes.bool,
  onCollide: React.PropTypes.func,
  position: React.PropTypes.shape({
    x: React.PropTypes.number,
    y: React.PropTypes.number
  }),
  gravity: React.PropTypes.shape({
    x: React.PropTypes.number,
    y: React.PropTypes.number
  }),
  velocity: React.PropTypes.shape({
    x: React.PropTypes.number,
    y: React.PropTypes.number
  }),
  acceleration: React.PropTypes.shape({
    x: React.PropTypes.number,
    y: React.PropTypes.number
  }),
  drag: React.PropTypes.shape({
    x: React.PropTypes.number,
    y: React.PropTypes.number
  }),
  anchor: React.PropTypes.shape({
    x: React.PropTypes.number,
    y: React.PropTypes.number
  }),
  collideWithContainer: React.PropTypes.bool,
  height: React.PropTypes.number,
  width: React.PropTypes.number,
  interactWith: React.PropTypes.array
};

Box.defaultProps = {
  physics: true,
  container: {},
  position: {},
  gravity: {},
  velocity: {},
  acceleration: {},
  drag: {},
  anchor: {},
  bounce: {},
  outline: false,
  collideWithContainer: false,
  height: null,
  width: null,
};

export default Box;