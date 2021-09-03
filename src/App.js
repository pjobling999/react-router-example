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
      <div>
        <header>
          <h1 className="">THE TUNE ZONE</h1>
        </header>
      </div>

      <main>
        <p className="sectionHeaders">JOBBO MIXES</p>
        <div >
          
          <ul className='tilesWrap'>
            {JobboMixes.map((item, index) => {
              
              return (
              
                <li  key={index}>
                  <h2>{index}</h2>
                  <h3 ><a style={{color: "#b7b7b7"}} href={item.href}>{item.Title}</a></h3>
                  <p>
                  
                  </p>
                  <button onClick={() => {this.handleClick(item.href);}}>Click to Play</button>
                </li>
                
              )
              
            })}

            </ul>

        </div>

        <p className="sectionHeaders">JOBBO ORIGINAL TUNES AND JOBBO REMIXES</p>
        <div >
          
        <ul className='tilesWrap'>
            {JobboSingles.map((item, index) => {
              
              return (
              
                <li  key={index}>
                  <h2>{index}</h2>
                  <h3 ><a style={{color: "#b7b7b7"}} href={item.href}>{item.Title}</a></h3>
                  <p>
                  
                  </p>
                  <button onClick={() => {this.handleClick(item.href);}}>Click to Play</button>
                </li>
                
              )
              
            })}

            </ul>

        </div>
      </main>
      
    </div>
  )
  }



};