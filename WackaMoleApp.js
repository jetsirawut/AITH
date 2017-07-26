import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  TouchableHighlight,
  AsyncStorage,
} from 'react-native';

var timeInterval = null;
var timeLimit = 30;

var Mole = React.createClass({
  render() {
    return (
      <TouchableHighlight onPress={this.props.onPress}>
        <Text style={{ fontSize: 50 }}>{this.props.show ? '🐻' : ''}</Text>
      </TouchableHighlight>
    )
  }
})
const STORAGE_KEY = '@highScore:data'
export default class game extends Component {
  constructor() {
    super();
    this.state = {
      highScore: 0,
      timeCount: 0,
      score: 0,
      gameState: false, //false = not playing , true = is playing
      holes: [false, false, false, false, false, false, false, false, false],// false = hidden , true = popup
    }
  }
  componentDidMount() {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        this.setState({
          highScore: (value == null) ? 0 : JSON.parse(value),
        })
      })
      .catch((error) => console.log('AsyncStorage:' + error.message))
  }
  _save() {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.state.highScore))
      .then(() => console.log('Your highScore ' + this.state.highScore + ' has been saved'))
      .catch((error) => console.log('AsyncStorage: ' + error.message))
      .done();
  }
  _startGame() {
    this.setState({
      timeCount: timeLimit,
      gameState: true,
      score: 0,
    });
    myGame = setInterval(() => {
      this.setState({
        holes: [false, false, false, false, false, false, false, false, false],
      })
      var currentHoles = this.state.holes;
      currentHoles[Math.floor(Math.random() * 9)] = true;
      this.setState({
        holes: currentHoles,
      })
    }, 800);

    timeInterval = setInterval(() => {
      this.setState({
        timeCount: this.state.timeCount - 1,
      });
      if (this.state.timeCount == 0) {
        this._stopGame();
      }
    }, 1000);
  }
  _wack(holeNumber) {
    if (this.state.holes[holeNumber]){
      this.setState({
        score: this.state.score + 1,
        holes: [false, false, false, false, false, false, false, false, false],
      })
      var currentHoles = this.state.holes;
      currentHoles[Math.floor(Math.random() * 9)] = true;
    }
  }
  _stopGame() {
    clearInterval(timeInterval);
    clearInterval(myGame);

    (this.state.score > this.state.highScore) ? alert('New high score : ' + this.state.score) : null

    this.setState({
      holes: [false, false, false, false, false, false, false, false, false],
      gameState: false,
      highScore: (this.state.score > this.state.highScore) ? this.state.score : this.state.highScore,
    })
    this._save();
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.scorePanel}>
          <View style={styles.topContainer}>
            <Text>High Score</Text>
            <Text style={styles.numberCount}>{this.state.highScore}</Text>
          </View>
          <View style={styles.topContainer}>
            <Text>Time</Text>
            <Text style={styles.numberCount}>{this.state.timeCount}</Text>
          </View>
          <View style={styles.topContainer}>
            <Text>Score</Text>
            <Text style={styles.numberCount}>{this.state.score}</Text>
          </View>
        </View>
        <View style={styles.holeContainer}>
          <View style={styles.hole}>
            <Mole onPress={() => this._wack(0)} show={this.state.holes[0]} />
          </View>
          <View style={styles.hole}>
            <Mole onPress={() => this._wack(1)} show={this.state.holes[1]} />
          </View>
          <View style={styles.hole}>
            <Mole onPress={() => this._wack(2)} show={this.state.holes[2]} />
          </View>
        </View>
        <View style={styles.holeContainer}>
          <View style={styles.hole}>
            <Mole onPress={() => this._wack(3)} show={this.state.holes[3]} />
          </View>
          <View style={styles.hole}>
            <Mole onPress={() => this._wack(4)} show={this.state.holes[4]} />
          </View>
          <View style={styles.hole}>
            <Mole onPress={() => this._wack(5)} show={this.state.holes[5]} />
          </View>
        </View>
        <View style={styles.holeContainer}>
          <View style={styles.hole}>
            <Mole onPress={() => this._wack(6)} show={this.state.holes[6]} />
          </View>
          <View style={styles.hole}>
            <Mole onPress={() => this._wack(7)} show={this.state.holes[7]} />
          </View>
          <View style={styles.hole}>
            <Mole onPress={() => this._wack(8)} show={this.state.holes[8]} />
          </View>
        </View>

        <View style={styles.buttonPanel}>
          <Button
            title="Wack-a-Mole!"
            onPress={this._startGame.bind(this)}
            disabled={this.state.gameState}
            color='#7c573d'
          />
        </View>

      </View>

    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  }, numberCount: {
    fontSize: 30,
  },
  scorePanel: {
    flex: 1,
    backgroundColor: '#846C5B',
    flexDirection: 'row',
  },topContainer: {
    flex: 1,
    backgroundColor: '#CEA07E',
    alignItems: 'center',
    borderRadius: 20,
    margin: 10,
  },
  holeContainer: {
    backgroundColor: '#7c573d',
    flex: 2,
    flexDirection: 'row',

  }, hole: {
    flex: 1,
    backgroundColor: '#EDD9A3',
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPanel: {
    flex: 1,
    backgroundColor: '#846C5B',
    width:'100%',
    alignItems: 'center',
    justifyContent:'center',
    flexDirection: 'column',
  },

});
