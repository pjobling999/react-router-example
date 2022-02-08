import React from 'react'
import Jobbo from "./jobboStuff";
import './App.module.css'; 

export class App extends React.Component {

    
    // handleClick = (name) => {

    //   fetch("/api")
    //   .then( res => res.blob() )
    //   .then( blob => {
    //     var file = window.URL.createObjectURL(blob);
    //     window.location.assign(file);
    //   });

    //   //window.location.href = '/api';
    // };
    
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
                      <h3 ><a style={{color: "#b7b7b7"}} download href={'/api/' + item.href + '/' + item.Title} >{item.Title}</a></h3>
                      <p>
                      </p>
                      {/* <button onClick={() => {this.handleClick(item.href);}}>Download</button> */}
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