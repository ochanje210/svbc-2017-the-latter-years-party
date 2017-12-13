import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as WORDS from './words';
import {Helmet} from 'react-helmet';

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      rotation: null,
      landscape: false,
      accelerationIncludingGravity: null,
      acceleration: {x: 0, y: 0, z: 0},
      background: 'black',
      onGame: false,
      count: 2,
    }

    this.lastShakeTime = 0;
    this.handleAcceleration = this.handleAcceleration.bind(this)
    this.handleOrientation = this.handleOrientation.bind(this)
    this.renderGame = this.renderGame.bind(this)
  }
  componentDidMount () {
    this.handleOrientation()
    window.addEventListener('devicemotion', this.handleAcceleration)
    window.addEventListener('orientationchange', this.handleOrientation)
  }

  componentWillUpdate(nextProps, nextState) {
    const { x, y, z } = nextState.acceleration;
    const div = document.getElementById("App");
    const newColor = '#'+Math.floor(Math.random()*16777215).toString(16);
    const delta = 10;
    if ((x > delta || y > delta || z > delta)
        &&
        ((Date.now() - this.lastShakeTime) > 1000)) {
      this.lastShakeTime = Date.now();
      div.style.background = newColor;
      this.setState({
        count: this.state.count + 1,
        background: newColor,
      });
    }
  }

  componentWillUnmount () {
    window.removeEventListener('devicemotion', this.handleAcceleration)
    window.removeEventListener('orientationchange', this.handleOrientation)
  }
  handleOrientation (event) {
    const { orientation } = window
    this.setState({ landscape: orientation === 90 || orientation === -90 })
  }

  handleAcceleration (event) {
    const { landscape } = this.state
    const { useGravity, multiplier } = this.props
    const acceleration = useGravity ? event.accelerationIncludingGravity : event.acceleration
    const rotation = event.rotationRate || null
    const { x, y, z } = acceleration

    this.setState({
      rotation,
      accelerationIncludingGravity: event.accelerationIncludingGravity,
      acceleration: event.acceleration,
    })
  }
  renderGame() {
    return (!this.state.onGame) ?
      <div onClick={() => this.setState({onGame: true})}
        style={{
          width: '100%',
          height: '100%',
          background: 'transparent',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <span className="shake shake-constant" style={{
          color: 'white',
          fontSize: '7vw',
        }}>Tap To Start!</span>
      </div>
      :
      <div style={{
        width: '100%',
        height: '100%',
        background: 'transparent',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <span style={{color: 'white', fontSize: '20vw'}}>
          {WORDS.list[(this.state.count - 1) % WORDS.list.length]}
        </span>
      </div>
  }
  render() {
    return (
      <div id="App" className="App"
        style={{
          background: this.state.background,
          width: '100vw',
          height: '100vh',
        }}>
        <Helmet>
        <link rel="stylesheet" type="text/css" href="http://csshake.surge.sh/csshake.min.css"/>
        </Helmet>
        {this.renderGame()}
      </div>
    );
  }
}

export default App;
