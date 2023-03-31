import React from 'react'
import Jobbo from "./jobboStuff";
import './App.module.css'; 

var wakeLock = null;

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
    
    // Function that attempts to request a screen wake lock.
    requestWakeLock = async () => {
      try {
        wakeLock = await navigator.wakeLock.request();
        wakeLock.addEventListener('release', () => {
          console.log('Screen Wake Lock released:', wakeLock.released);
        });
        console.log('Screen Wake Lock released:', wakeLock.released);
      } catch (err) {
        console.error(`${err.name}, ${err.message}`);
      }
    };

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

          await fetch('https://jobboserver-dot-jobbo-tunez.ew.r.appspot.com/api/' + name + '/' + title, {
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
              {
                this.executeScroll();
              }

              this.setState({
                processing: false,
                randomUrl: data
              });
              
              navigator.mediaSession.metadata = new window.MediaMetadata({
                title: `${title}`,
                artist: `${artist ? artist : defaultArtist}`,
                album: `${album ? album : defaultAlbum}`
              });
              navigator.mediaSession.playbackState = "playing";
              
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
      
      await this.handleClick(name.href, name.Title, name.Album, name.Artist, name.AlbumArtist, false);

    }
    
    checkClick =  (e) => {

      let clickedValue = e.target.checked;

      if (clickedValue)
      {
        // Request a screen wake lock… and add listener
        this.requestWakeLock();
        document.getElementById("myPlayer").addEventListener("ended", this.randalClick);
      }
      else
      {
        wakeLock.release();
        wakeLock = null;
        document.getElementById("myPlayer").removeEventListener("ended", this.randalClick);
      }
      
      this.setState({
        checked: clickedValue
      });

    }

    updatePlay = () => {

      navigator.mediaSession.setPositionState({
                  duration: document.getElementById("myPlayer").duration,
                  playbackRate: document.getElementById("myPlayer").playbackRate,
                  position: document.getElementById("myPlayer").currentTime
                });
    }

    executeScroll = () => this.myRef.scrollIntoView()

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
          <p><audio id="myPlayer"  src={this.state.randomUrl} controls autoPlay onPlay={this.updatePlay} /></p>
          <p><label ref={ (ref) => this.myRef=ref } style={{color:'white'}} >{this.state.randomUrl}</label></p>
        
        </div>
      </div>
      
    )
  }

};