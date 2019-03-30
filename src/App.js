import React, { Component } from "react";
import Header from "./Header/Header";
import Typeahead from './Typeahead/Typeahead';
import list from "./Mockdata/continents.json";
import "./App.css";


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flag:[],
      countryObj: {},
    };
    this.onFlagChange = this.onFlagChange.bind(this);
  }

  showFlags() {
    const flag = this.state.flag || [];
    if(flag.length > 0) {
      return (
        <div className="flagSection">
        <div className="flagLabel">Display Flags for selected countries&nbsp;:</div>
        <div className="flagValue">{flag.map((val, i) => {
          return <div key={i}>{val.flag}</div>      
        })}
        </div>
        </div>
      );
    }
    return null;
  }

  onSelect = (data)=>{
    this.setState({
      countryObj: data
    })
  }

  onFlagChange(data) {
    this.setState({
      flag: data || []
    })
  }
 

  render() {
    return (
      <div className="container">
        <Header />
        <div className="searchInput">
        <Typeahead data={list} searchKey="continent" onSelect={this.onSelect} label="Continent" placeholder="Search by Continent"/>
        <Typeahead data={this.state.countryObj.countries || []} searchKey="name" onSelect={this.onFlagChange} multiple label="Country" placeholder="Search by Country"/>
        </div>
        {this.showFlags()}
      </div>
    );
  }
}
export default App;
