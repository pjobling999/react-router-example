import React from 'react'
import Jobbo from "./jobboStuff";
import './App.module.css'; 

export class App extends React.Component {
    constructor(props) {
      super(props);
      
      this.checkClick = this.checkClick.bind(this);

      this.state = {
        processing: false,
        randomUrl: "",
        checked: false
      }

    }
    
    handleClick = async (name, title, album, artist, albumArtist, redirect = true) => {

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

              if (redirect)
                window.location.href = data;
              
              this.setState({
                processing: false,
                randomUrl: data
              });

              return data;
          })

      }

    }; //https://jobboserver-dot-jobbo-tunez.ew.r.appspot.com 
    
    randalClick =  async () => {

      const cleaned = Jobbo[0].tunes.slice(1, -1)
      const keys = Object.keys(cleaned);
      const randIndex = Math.floor(Math.random() * keys.length);
      const randKey = keys[randIndex];
      const name = cleaned[randKey];
      
      this.handleClick(name.href, name.Title, name.Album, name.Artist, name.AlbumArtist, false);

    }

    checkClick =  (e) => {

      let clickedValue = e.target.checked;
      this.setState({
        checked: clickedValue
      });

    }

    tuneEnded =  () => {

      if (this.state.checked)
      {
        this.randalClick();
      }  

    }
    
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

        <div>
          <p><button onClick={() => {this.randalClick();}}>Click for a random tune...</button> 
          <input type="checkbox" id="checkbox" onChange={this.checkClick} checked={this.state.checked}/><label style={{color:'white'}}>Random Radio Mode</label>  </p>
          <p><audio onEnded={this.tuneEnded} src={this.state.randomUrl} controls autoPlay /></p>
          <p style={{color:'white'}} >{this.state.randomUrl}</p>
        </div>
      </div>
      
    )
  }

};