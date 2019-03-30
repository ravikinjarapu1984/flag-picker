import React, { Component } from "react";
import _ from 'lodash';

let instanceCount = 0;

class Typeahead extends Component {

    static getInstanceCount() {
        instanceCount += 1;
        return instanceCount;
    }

    constructor(props) {
        super(props);
        const actualData = props.data.map((item) => {
            return {
                ...item,
                selected: false
            }
        });
        this.state = {
            textInput: '',
            filteredData: [],
            actualData,
            open: false,
            cursor: 0
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleWindowClose = this.handleWindowClose.bind(this);
        this.handleOptionClick = this.handleOptionClick.bind(this);
        this.handleKeyUpDown = this.handleKeyUpDown.bind(this);
    }

    componentDidMount() {
        const uniqueId = Typeahead.getInstanceCount();
        this.optionsId = `typeahead-${uniqueId}`;
        const addEvent = window.addEventListener;
        const handleWindowClose = this.handleWindowClose;
        addEvent('click', handleWindowClose, false);
    }
    
    componentWillReceiveProps(nextProps) {
        if(!_.isEqual(nextProps.data, this.props.data)) {
            const actualData = nextProps.data.map((item) => {
                return {
                    ...item,
                    selected: false
                }
            });
            this.setState({
                actualData,
                filteredData: [],
                textInput: '',
                cursor: 0
            })
        }

    }

    componentWillUnmount() {
        const removeEvent = window.removeEventListener;
        const handleWindowClose = this.handleWindowClose;
    
        removeEvent('click', handleWindowClose, false);
    }

    handleOptionClick(selectedIndex, event) {
        const val = this.state.filteredData[selectedIndex][this.props.searchKey];
        this.onClick(val,selectedIndex);
    }

    /**
     * Filtered the data based on input value
     * @param {*} event 
     */
    handleChange(event) {       
        const input = event.target.value;
        const filtered = (input !== '' || this.props.multiple) && this.state.actualData.filter((item) => {
            return (item[this.props.searchKey]).toLowerCase().includes(input.toLowerCase())
        });
        this.setState({
            textInput: input,
            filteredData: filtered || [],
            open: filtered && filtered.length > 0
        });
    };

    /**
     * Keyup, keyDown and Enter keystrokes
     * @param {*} event 
     */
    handleKeyUpDown(event) {
        if(this.props.multiple) {
            return;
        }
        const { cursor, filteredData } = this.state
        if (event.keyCode === 13) {
            const text = filteredData[cursor][this.props.searchKey]
            this.setState({
              cursor: 0,
              textInput: text,
              open: false
            });           
            this.onClick(text, cursor);         
        }
        if (event.keyCode === 38 && cursor > 0) {
            this.setState( prevState => ({
                cursor: prevState.cursor - 1,
                textInput: filteredData[prevState.cursor - 1][this.props.searchKey]
            }))
        } else if (event.keyCode === 40 && cursor < filteredData.length - 1) {
            this.setState( prevState => ({
                cursor: prevState.cursor + 1,
                textInput: filteredData[prevState.cursor+1][this.props.searchKey]
            }))
        }        
    }

    /**
     * Close the Typeahead dropdown when we will click on outside.
     * @param {*} event 
     */
    handleWindowClose(event) {
        const target = event.target;
        if (target !== window && !this.container.contains(target)) {
            this.setState({
                open: false
            });
        }
      }

    onClick(value, i) {
        const data = this.state.actualData.filter((item) => {
            return item[this.props.searchKey] === value
        })
        data[0].selected = !data[0].selected;

        if(!this.props.multiple) {
            this.setState({
                textInput: value,
                open: false
            });
            this.props.onSelect(data[0]);
        } else {
            const arr = this.state.actualData.filter((item) => {
                return item.selected
            })
            this.props.onSelect(arr);

        }
        
    }

    render() {
        const { cursor } = this.state; 
        return (
            <div ref={(container) => { this.container = container; }}
            className="search-wrapper">
            <label htmlFor={this.optionsId} className="searchLabel">{this.props.label}&nbsp;:</label>
            <input id={this.optionsId} className="inputText" value={this.state.textInput} type="text" autoComplete="new-password" spellCheck="off" placeholder={this.props.placeholder} onChange={this.handleChange}  onKeyDown= {this.handleKeyUpDown}/>
            {this.state.open && <ul className="search-list">
                {
                    this.state.filteredData.map((item, i) => {
                        return (
                            <li key={i} className={cursor === i && !this.props.multiple ? 'active' : null} > 
                               <span onClick={this.handleOptionClick.bind(this, i)} >{this.props.multiple &&  <input type="checkbox" checked={item.selected}/>} 
                                {item[this.props.searchKey]}</span>
                            </li>
                        )
                    })
                }
            </ul>}
        </div>
        )
        
    }
}

export default Typeahead;