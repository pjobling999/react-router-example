import React from 'react'
import Jobbo from "./jobboStuff";
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

        {Jobbo.map((topItem, i) => {

          return (
  
          <div key={i}>
            <div>
              <p className="sectionHeaders">{topItem.category}</p>
            
              <ul className='tilesWrap'>

                {topItem.tunes.map((item, index) => {
                  
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
          </div>
      
        )
        })}


        </main>
      </div>
    )
  }

};