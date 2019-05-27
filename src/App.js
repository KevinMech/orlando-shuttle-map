import React, { Component } from 'react';
import './App.css';
import Header from './components/header.js';
import MapArea from './components/maparea.js';
import axios from 'axios';

class App extends Component {
  constructor(props){
    super(props);

    this.getShuttles = this.getShuttles.bind(this);

    this.state = {
      lnglat: [-81.37923649999999, 28.5383355],
      zoom: 15,
      availableshuttles: [],
      shownshuttles: []
    }

    this.getShuttles();
  }

  getShuttles(){
    axios.get('https://orlando-shuttle-api.herokuapp.com/api/shuttle/')
    .then(response => {
      const shuttles = response.data;
      let allshuttles = [{id: 0}];
      for (const shuttle in shuttles) {
        allshuttles.push(shuttles[shuttle]);
      }
      console.log(allshuttles);
      this.setState({
        availableshuttles: allshuttles
      });
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  render() {
    return (
      <div className="App">
        <Header/>
        <MapArea lnglat={this.state.lnglat} zoom={this.state.zoom} available={this.state.availableshuttles} shown={this.state.shownshuttles}/>
      </div>
    );
  }
}

export default App;
