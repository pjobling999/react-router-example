import React from 'react'
import JobboMixes from "./jobboMixes";
import JobboSingles from "./jobboSingles";

export class App extends React.Component {
    
    render() { 
    
    return (
    
    <div>
      <h2>JOBBO MIXES</h2>
      <div style={{ width: 400 }}>
      
              {JobboMixes.map((item, index) => {
                    
                    return <p key={index}><a href={item.href}>{item.Title}</a></p>;
                        
                })}
      </div>

      <h2>JOBBO SINGLES</h2>
      <div style={{ width: 400 }}>
         
              {JobboSingles.map((item, index) => {
                    
                    return <p key={index}><a href={item.href}>{item.Title}</a></p>;
                        
                })}

      </div>
    </div>
  )
  }



};