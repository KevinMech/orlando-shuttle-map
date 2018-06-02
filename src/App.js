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
      busstops: [],
      routes: []
    }
  }

  componentDidMount(){
    this.generateBusStops();
  }

  generateBusStops(){
    const features = busroutes.features;

    let id = 0;
    let stops = [];
    for(let x = 0; x < features.length; x++){
      if(features[x].geometry.type === 'MultiPoint'){
        for(let y = 0; y < features[x].geometry.coordinates.length; y++){
          stops.push(<Feature key={id} properties={features[x].properties.name} coordinates={features[x].geometry.coordinates[y]}/>);
          id++;
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
