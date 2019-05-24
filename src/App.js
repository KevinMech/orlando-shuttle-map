import React, { Component } from 'react';
import './App.css';
import Header from './components/header.js';
import MapArea from './components/maparea.js';

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      lnglat: [-81.37923649999999, 28.5383355],
      zoom: 15,
      busstops: [],
      busroutes: []
    }
  }

  render() {
    return (
      <div className="App">
        <Header/>
        <MapArea lnglat={this.state.lnglat} zoom={this.state.zoom} busstops={this.state.busstops} busroutes={this.state.busroutes}/>
      </div>
    );
  }
}

export default App;
