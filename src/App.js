import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as WORDS from './words';
import {Helmet} from 'react-helmet';

const STEP = {
  ONTEAM: 0,
  ONREADY: 1,
  ONGAME: 2,
}

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      rotation: null,
      landscape: false,
      acceleration: {x: 0, y: 0, z: 0},
      background: 'black',
      step: STEP.ONTEAM,
      count1: 0,
      count2: 0,
      count3: 0,
      team: null,
    }

    this.lastShakeTime = 0;
    this.handleAcceleration = this.handleAcceleration.bind(this)
    this.handleOrientation = this.handleOrientation.bind(this)
    this.renderTeamCard = this.renderTeamCard.bind(this)
    this.renderGame = this.renderGame.bind(this)
    this.renderTeam = this.renderTeam.bind(this)

    this.color = [];
  }
  componentDidMount () {
    this.handleOrientation();
    window.addEventListener('devicemotion', this.handleAcceleration);
    window.addEventListener('orientationchange', this.handleOrientation);

    for(let i=0;i<WORDS.team1.length;i++) {
      this.color.push('#'+Math.floor(Math.random()*16777215).toString(16));
    }
  }

  componentWillUpdate(nextProps, nextState) {
    const { x, y, z } = nextState.acceleration;
    const div = document.getElementById("App");
    const delta = 10;
    if ((x > delta || y > delta || z > delta)
        &&
        ((Date.now() - this.lastShakeTime) > 1000)) {
      this.lastShakeTime = Date.now();

      if (this.state.step === STEP.ONGAME) {

        if (this.state.team === 1) {
          if (this.state.count1 === 0) {
            this.setState({step: this.state.step - 1});
          } else {
            this.setState({
              count1: this.state.count1 - 1,
              background: this.color[this.state.count1 - 1],
            });
          }
        } else if (this.state.team === 2) {
          if (this.state.count2 === 0) {
            this.setState({step: this.state.step - 1});
          } else {
            this.setState({
              count2: this.state.count2 - 1,
              background: this.color[this.state.count2 - 1],
            });
          }
        } else if (this.state.team === 3) {
          if (this.state.count3 === 0) {
            this.setState({step: this.state.step - 1});
          } else {
            this.setState({
              count3: this.state.count3 - 1,
              background: this.color[this.state.count3 - 1],
            });
          }
        }
      } else if (this.state.step > STEP.ONTEAM) {
        this.setState({step: this.state.step - 1});
      }
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
    // const acceleration = useGravity ? event.accelerationIncludingGravity : event.acceleration
    const rotation = event.rotationRate || null
    
    this.setState({
      acceleration: event.acceleration,
    })
  }
  renderGame() {
    const i = (this.state.team === 1) ? this.state.count1 + 1 :
              (this.state.team === 2) ? this.state.count2 + 1 :
                                this.state.count3 + 1;
    if (this.state.step === STEP.ONTEAM) return null;

    const count = (this.state.team === 1) ? this.state.count1 :
                  (this.state.team === 2) ? this.state.count2 :
                                            this.state.count3;
    const list = (this.state.team === 1) ? WORDS.team1 :
                 (this.state.team === 2) ? WORDS.team2 :
                                           WORDS.team3;
    console.log(list[(count) % list.length]);
    return (this.state.step === STEP.ONREADY) ?
      <div onClick={() => this.setState({step: this.state.step + 1})}
        style={{
          width: '100%',
          height: '100%',
          background: 'transparent',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}>
        <span style={{
          color: 'white',
          fontSize: '7vw',
          marginBottom: '32px',
        }}>Team {this.state.team}</span>
        <span className="shake shake-constant" style={{
          color: 'white',
          fontSize: '7vw',
        }}>Tap To Start!</span>
      </div>
      : (this.state.step === STEP.ONGAME) ?
      <div id="currentgamecard" style={{
        width: '100%',
        height: '100%',
        background: 'transparent',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }} onClick={()=>{
        if (this.state.team === 1 && this.state.count1 < WORDS.team1.length - 1) {
          this.setState({
            count1: this.state.count1 + 1,
            background: this.color[this.state.count1 + 1],
          });
        } else if (this.state.team === 2 && this.state.count2 < WORDS.team2.length - 1) {
          this.setState({
            count2: this.state.count2 + 1,
            background: this.color[this.state.count2 + 1],
          });
        } else if (this.state.team === 3 && this.state.count3 < WORDS.team3.length - 1) {
          this.setState({
            count3: this.state.count3 + 1,
            background: this.color[this.state.count3 + 1],
          });
        }
      }}>
        <span style={{
          color: 'white',
          fontSize: '10vw',
          position: 'fixed',
          top: '20vh',
        }}>{(i >= 10) ? i : '0' + i}</span>
        <span style={{color: 'white', fontSize: '20vw'}}>
          {(i > WORDS.team1.length - 1) ? "끗!" : list[count]}
        </span>
      </div>
      : null;
  }
  renderTeamCard(teamNum) {
    return (
      <div className={(teamNum === 1) ? "shake-slow shake-constant" :
                      (teamNum === 2) ? "shake-vertical shake-constant" :
                      "shake-rotate shake-constant"} style={{
        flex: 1,
        margin: '12px',
        background: 'black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: '5px',
        borderTopRightRadius: '5px',
        borderBottomLeftRadius: '5px',
        borderBottomRightRadius: '5px',
      }} onClick={() => this.setState({
        step: this.state.step + 1,
        team: teamNum,
        })}>
        <span style={{
          color: 'white',
          fontSize: '14vw',
          margin: '0 20px',
        }}>Team {teamNum}</span>
      </div>
    );
  }
  renderTeam() {
    return (this.state.step === STEP.ONTEAM) ?
      <div style={{
        width: '100%',
        height: '100%',
        background: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}>
        {this.renderTeamCard(1)}
        {this.renderTeamCard(2)}
        {this.renderTeamCard(3)}
      </div>
      : null;
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
          <meta property="og:title" content="2017 SVBC 말년회" />
          <meta property="og:url" content="https://s3.ap-northeast-2.amazonaws.com/elasticbeanstalk-ap-northeast-2-746998027382/IMG_0321.JPG" />
          <meta property="og:description" 
                content='매년 돌아오는 놓칠면 후회하는 2017 실콘붓캠 연말파티에 오세요!' />
        </Helmet>
        {this.renderGame()}
        {this.renderTeam()}
      </div>
    );
  }
}

export default App;
