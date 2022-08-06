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

    
    
    handleClick = async (name, title, album, artist, albumArtist) => {

      let defaultAlbum = "SLAMMING BEATS";
      let defaultArtist = "DJ JOBBO";
      let defaultAlbumArtist = "DJ JOBBO";

      if (name.includes("mailto"))
      {
        window.location.href = name;
      }
      else
      {
          this.setState({
            processing: true
          });

          // fetch('http://localhost:3001/api/' + name + '/' + title, {

          fetch('https://jobboserver-dot-jobbo-tunez.ew.r.appspot.com/api/' + name + '/' + title, {
              method: 'POST',
              body: JSON.stringify({tags: {
                   title: `${title}`,
                   artist: `${artist ? artist : defaultArtist}`,
                   performerInfo: `${albumArtist ? albumArtist : defaultAlbumArtist}`,
                   album: `${album ? album : defaultAlbum}`
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
                        :  <button onClick={() => {this.handleClick(item.href, item.Title, item.Album, item.Artist, item.AlbumArtist);}}>PLAY</button> 
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