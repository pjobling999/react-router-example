import React from 'react'
import Jobbo from "./jobboStuff";
import './App.module.css'; 

var wakeLock = null;

function updatePositionState() {
  
  const audio = document.querySelector('audio');

  if ('setPositionState' in navigator.mediaSession) {
    navigator.mediaSession.setPositionState({
      duration: audio.duration,
      playbackRate: audio.playbackRate,
      position: audio.currentTime,
    });
  }
}

export class App extends React.Component {
    constructor(props) {
      super(props);
      
      this.checkClick = this.checkClick.bind(this);

      this.state = {
        processing: false,
        randomUrl: "",
        checked: false,
        notPlayed: Jobbo[0].tunes.slice(1, -1)
      }
      
      navigator.mediaSession.setActionHandler('play', async () => {
        // Resume playback
        const audio = document.querySelector('audio');
        await audio.play();
        updatePositionState();
      });

      navigator.mediaSession.setActionHandler('pause', () => {
        // Pause active playback
        const audio = document.querySelector('audio');
        audio.pause();
        updatePositionState();
      });
      
      navigator.mediaSession.setActionHandler('seekbackward', (details) => {
        const audio = document.querySelector('audio');
        const skipTime = details.seekOffset || 10;
        audio.currentTime = Math.max(audio.currentTime - skipTime, 0);
        updatePositionState();
      });
      
      navigator.mediaSession.setActionHandler('seekforward', (details) => {
        const audio = document.querySelector('audio');
        const skipTime = details.seekOffset || 10;
        audio.currentTime = Math.min(audio.currentTime + skipTime, audio.duration);
        updatePositionState();
      });

      navigator.mediaSession.setActionHandler('seekto', (details) => {
        const audio = document.querySelector('audio');
        if (details.fastSeek && 'fastSeek' in audio) {
          // Only use fast seek if supported.
          audio.fastSeek(details.seekTime);
        }
        else
        {
          audio.currentTime = details.seekTime;
        }
        updatePositionState();
      });
    }
    
    playEvent = () => {
      navigator.mediaSession.playbackState = 'playing';
    };
    
    pauseEvent = () => {
      navigator.mediaSession.playbackState = 'paused';
    };

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

      var keys = Object.keys(this.state.notPlayed);
      if (keys.length===0)
        keys = Object.keys(Jobbo[0].tunes.slice(1, -1));

      const randIndex = Math.floor(Math.random() * keys.length);
      const randKey = keys[randIndex];
      const name = this.state.notPlayed[randKey];
      
      await this.handleClick(name.href, name.Title, name.Album, name.Artist, name.AlbumArtist, false);

      const notPlayedNew = this.state.notPlayed;
      notPlayedNew.splice(randKey, 1);

      this.setState({
        notPlayed: notPlayedNew
      });
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
          <p><audio id="myPlayer"  src={this.state.randomUrl} controls autoPlay onTimeUpdate={this.updatePositionState}  /></p>
          <p><label ref={ (ref) => this.myRef=ref } style={{color:'white'}} >{this.state.randomUrl}</label></p>
        
        </div>
      </div>
      
    )
  }

};