import { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';



function App() {
  const CLIENT_ID = '914560b878e3419db0e348ed3b09dacd'
  const REDIRECT_URI = 'http://localhost:3000'
  const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize'
  const RESPONSE_TYPE = 'token'

  const [token, setToken] = useState('')
  const [searchKey, setSearchKey] = useState('')
  const [songs, setSongs] = useState([])

  
  useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")

    /**
     * If we don't have a token but we have a hash
     * extract the token from the hash and set the has to be empty
     */
    if (!token && hash) {
      token = hash.substring(1).split('&').find(elem => elem.startsWith('access_token')).split('=')[1]

      window.location.hash = ''//we don't want our access_token to be visible
      window.localStorage.setItem("token", token)

    }
    setToken(token)
  }, [])
  const logout = () => {
    setToken('')
    setSongs([])
    window.localStorage.removeItem('token')
  }

  const searchArtists = async (e) => {
    setSongs([])
    e.preventDefault()
    const { data } = await axios.get('https://api.spotify.com/v1/search', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        q: searchKey,
        type: "track",
        limit: 50
      }
    })
    setSongs(data.tracks.items)
  }
  const showPrompt = () => {
    return (
      
      <p id='prompt'>If there's a preview <br></br>Click this one to play the preview !</p>

    )
  }
  const renderSongs = (token) => {
    return token ? songs.map(song => (
      <>
        <SwiperSlide>
          <div >
            {song.album.images.length ? <img width={"100%"} src={song.album.images[0].url} alt='' /> : <div>No Image</div>}
            {song.preview_url ? <audio src={song.preview_url} type="mp3" controls></audio> : null}
            
            <p>
              {song.name}
              <br></br>
              {song.album.release_date}
            </p>

          </div>

        </SwiperSlide>

      </>
    ))
      :
      null
  }

  return (
    <div className="App">
      <header className="App-header">
        <>
          <a href='https://github.com/DaraAdekore' id="logo"><h1 >Dara</h1></a>
          <div>
            <h1 id="header">Spotify swipe With React</h1>
            <img src='https://i.imgur.com/Eo2zVse.png'></img>
          </div>


          {!token ?

            <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login to spotify</a>
            :
            <button onClick={logout}>Logout </button>

          }
          {
            token ?

              <form onSubmit={searchArtists}>
                <input type='text' onChange={e => setSearchKey(e.target.value)} placeholder='search for a song or artist' />
                <button type='{submit}'>Search</button>
              </form>
              
              :
              <h2>Please login</h2>
          }
        { songs.length? showPrompt(): null}
        </>
        <Swiper
          // install Swiper modules
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={50}
          slidesPerView={6}
          navigation
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
          onSwiper={(swiper) => console.log(swiper)}
          onSlideChange={() => console.log('slide change')}
        >
          {
            renderSongs(token)
          }
        </Swiper>

      </header>
    </div>
  );

}



export default App;
