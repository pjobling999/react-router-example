import React from 'react'
import JobboMixes from "./jobboMixes";
import JobboSingles from "./jobboSingles";
import './App.module.css'; 

export class App extends React.Component {
  
    handleClick = (name) => {
      window.location.href = name;
    };
  
    render() { 
    
    return (
    
    <div>
      <h2>JOBBO MIXES</h2>
      <div >
      
        <ul className='tilesWrap'>
          {JobboMixes.map((item, index) => {
            
            return (
            
              <li onClick={() => {this.handleClick(item.href);}} key={index}>
                <h2>{index}</h2>
                <h3>{item.Title}</h3>
                <p>
                
                </p>
                <button>Click to Play</button>
              </li>
              
            )
            
          })}

          </ul>

      </div>

      <h2>JOBBO TUNES AND JOBBO REMIXES</h2>
      <div >
         
      <ul className='tilesWrap'>
          {JobboSingles.map((item, index) => {
            
            return (
            
              <li onClick={() => {this.handleClick(item.href);}} key={index}>
                <h2>{index}</h2>
                <h3>{item.Title}</h3>
                <p>
                
                </p>
                <button>Click to Play</button>
              </li>
              
            )
            
          })}

          </ul>

      </div>

      
    </div>
  )
  }



};