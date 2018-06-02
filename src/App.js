import React, { Component } from 'react';
import ReactMapBoxGl, {Feature} from 'react-mapbox-gl';
import './App.css';
import busroutes from './config/busroutes.json';
import Header from './components/header.js';
import MapArea from './components/maparea.js';

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      routes: busroutes.features,
      busstops: []
    }
  }

  componentDidMount(){
    this.generateBusStops();
  }

  generateBusStops(){
    let stops = [];
    for(let x = 0; x < this.state.routes.length; x++){
      if(this.state.routes[x].geometry.type === 'MultiPoint'){
        for(let y = 0; y < this.state.routes[x].geometry.coordinates.length; y++){
          stops.push(<Feature coordinates={this.state.routes[x].geometry.coordinates[y]} properties={this.state.routes[x].properties.name}/>);
        }
      }
    }
    this.setState({busstops: stops});
  }

  render() {
    return (
      <div className="App">
        <Header/>
        <MapArea busstops={this.state.busstops}/>
      </div>
    );
  }
}

export default App;
