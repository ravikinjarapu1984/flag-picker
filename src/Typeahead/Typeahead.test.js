import React from 'react';
import ReactDOM from 'react-dom';
import Typeahead from './Typeahead';
import list from "../Mockdata/continents.json";
// setup file
import { configure,shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });


describe("Typeahead component", () => {
  let wrapper; 
  
    beforeEach(() => {
        const props = {            
            searchKey: 'continent',
            label: 'continent',
            data: list,
            onSelect: jest.fn()
        };       
        wrapper = shallow(<Typeahead {...props}/>);          
    });   
    it("Search the continent through handleChange", () => {
          const handleChange = jest.fn();
          const mockedData = "Africa";
          wrapper.find('.inputText').simulate('change', { target: { value: 'Africa' }});
          handleChange();  
          expect(wrapper.state().filteredData[0].continent).toEqual(mockedData);;        
    })
    it("Search the continet through handleChange with wrong data", () => {
        const handleChange = jest.fn();
        const mockedData = [];
        wrapper.find('.inputText').simulate('change', { target: { value: 'rrrr' }});
        handleChange();  
        expect(wrapper.state().filteredData).toEqual(mockedData);      
    })
    it("Search the continet through handleChange with more results", () => {
        const handleChange = jest.fn();
        wrapper.find('.inputText').simulate('change', { target: { value: 'a' }});
        handleChange();  
        expect(wrapper.state().filteredData).toHaveLength(4);      
    })

    it("Search the continet through handleKeyUpDown for enter", () => {
        const handleKeyUpDown = jest.fn();
        const handleChange = jest.fn();
        const state = {
            cursor: 0,
            textInput: '',
            open: false
        };
        wrapper.find('.inputText').simulate('change', { target: { value: 'a' }});
        handleChange();
        wrapper.find('.inputText').simulate('keyDown', { keyCode: 13});
        handleKeyUpDown();              
        expect(wrapper.state().textInput).toEqual(list[0].continent);      
    })

    it("Search the continet through handleKeyUpDown for down arrow", () => {
        const handleKeyUpDown = jest.fn();
        const handleChange = jest.fn();
        wrapper.find('.inputText').simulate('change', { target: { value: 'a' }});
        handleChange();
        wrapper.find('.inputText').simulate('keyDown', { keyCode: 40});
        handleKeyUpDown();              
        expect(wrapper.state().textInput).toEqual(list[1].continent);      
    })

    it("Search the continet through handleKeyUpDown for up arrow", () => {
      const handleKeyUpDown = jest.fn();
      const handleChange = jest.fn();
      wrapper.find('.inputText').simulate('change', { target: { value: 'a' }});
      handleChange();
      wrapper.find('.inputText').simulate('keyDown', { keyCode: 40});
      handleKeyUpDown();
      wrapper.find('.inputText').simulate('keyDown', { keyCode: 38});
      handleKeyUpDown();                 
      expect(wrapper.state().textInput).toEqual(list[0].continent);      
  })
  
});