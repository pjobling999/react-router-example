import React from 'react'
import Jobbo from "./jobboStuff";
import './App.module.css'; 

export class App extends React.Component {
    constructor(props) {
      super(props);
      
      this.state = {
        processing: false
      }

    }
    
    handleClick = async (name, title) => {

      if (name.includes("mailto"))
      {
        window.location.href = name;
      }
      else
      {
          this.setState({
            processing: true
          });

          fetch('https://jobboserver-dot-jobbo-tunez.ew.r.appspot.com/api/' + name + '/' + title)
            .then((result) => result.text())
            .then((data) => {
              
              console.log(data);
              window.location.href = data;
              
              this.setState({
                processing: false
              });
          })

          fetch('http://localhost:3001/api/' + name + '/' + title, {
              method: 'POST',
              body: JSON.stringify({tags: {
                   title: `${title}`,
                   artist: `DJ JOBBO`,
                   performerInfo: `DJ JOBBO`,
                   album: `SLAMMING BEATS`
              }}),
              headers: {"Content-Type": "application/json"}
            })
            .then((result) => result.text())
            .then((data) => {
              
              console.log(data);
              window.location.href = data;
              
              this.setState({
                processing: false
              });
          })

      }

    }; //https://jobboserver-dot-jobbo-tunez.ew.r.appspot.com 
    
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
                      <h3  >{item.Title}</h3>
                      <p>
                      </p>
                     
                      {this.state.processing 
                        ? <p>Loading Please Wait...</p>
                        :  <button onClick={() => {this.handleClick(item.href, item.Title);}}>PLAY</button> 
                      }
                          
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