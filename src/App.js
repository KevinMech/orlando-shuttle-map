import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './components/header.js';
import MapArea from './components/maparea.js';

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      routes: [{name: "Route 13", stops: [-81.19093559682369, 28.612872530295824]}]
    }
  }
  render() {
    return (
      <div className="App">
        <Header/>
        <MapArea routes={this.state.routes}/>
      </div>
    );
  }
}

export default App;
