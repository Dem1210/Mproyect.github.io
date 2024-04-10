import { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/tailwind.css';
import ScaleLoader from 'react-spinners/ScaleLoader'

function App() {
  const [artist, setArtist] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [artistImage, setArtistImage] = useState('');
  const [Song, setSong] = useState('');
  const [randomWord, setRandomWord] = useState('');
  const [loading, setLoading] = useState('false')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await playNextArtist()
      setTimeout(() => setLoading(false), 3000);
    };
    fetchData();
  }, []);

  const generateRandomWord = async () => {
    const options = {
      method: 'GET',
      url: 'https://random-word-api.p.rapidapi.com/get_word',
      headers: {
        'X-RapidAPI-Key': 'dc0dc7f07cmsh745ccda39ff2762p183007jsn69875c7456aa',
        'X-RapidAPI-Host': 'random-word-api.p.rapidapi.com'
      }
    };
    try {
      const response = await axios.request(options);
      setRandomWord(response.data.word);
    } catch (error) {
      console.error(error);
    }
  };



  const fetchRandomSong = async () => {
    try {
      await generateRandomWord();

      const response = await axios.get('https://deezerdevs-deezer.p.rapidapi.com/search', {
        params: {
          q: `${randomWord}`
        },
        headers: {
          'X-RapidAPI-Key': 'dc0dc7f07cmsh745ccda39ff2762p183007jsn69875c7456aa',
          'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
        }
      });

      const randomTrack = response.data.data[Math.floor(Math.random() * response.data.data.length)];
      if (randomTrack && randomTrack.artist) {
        setArtist(randomTrack.artist);
        setSong(randomTrack.title);
        setArtistImage(randomTrack.artist.picture_medium);

        const songResponse = await axios.get(`https://deezerdevs-deezer.p.rapidapi.com/track/${randomTrack.id}`, {
          headers: {
            'X-RapidAPI-Key': 'dc0dc7f07cmsh745ccda39ff2762p183007jsn69875c7456aa',
            'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
          }
        });
        setAudioUrl(songResponse.data.preview);
      } else {
        await fetchRandomSong();
      }
    } catch (error) {
      console.error('Error al obtener la información:', error);
    }
  };

  useEffect(() => {
    fetchRandomSong();
  }, []);

  const playNextArtist = async () => {
    await fetchRandomSong();
  };

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white  overflow-y-auto">
      {loading? (
        <>
          <ScaleLoader size={50} color={'#F5F6F8'} />
          <h2>Presione el ícono de siguiente canción para iniciar la aplicación.</h2>
        </>
      ):(

      <section className=' flex flex-col justify-center items-center gap-4 bg-gray-800 p-7 mg-10 rounded-xl shadow-[-10px_10px_17px_#070a10,_10px_-10px_17px_#324258]'>
        <h1 className='md:text-3xl md:font-bold text-center sm:text-xl max-w-sm'>Artista: {artist && artist.name}</h1>
        <img className="w-40 h-40 md:w-60 md:h-60 rounded-full text-center sm:w-40 sm:h-40 bg-gray-100 p-2 shadow-[-21px_21px_42px_#070a10,_21px_-21px_42px_#1b2640]" src={artistImage} alt={artist && artist.name} />
        <p className="md:text-2xl text-center sm:text-xl max-w-sm ">Canción: {Song} </p>
        {audioUrl && (
          <div>
            <audio controls src={audioUrl} onEnded={playNextArtist} autoPlay>
              Tu navegador no soporta el elemento de audio.
            </audio>
          </div>
        )}
        <button className="border hover:scale-95 hover:bg-indigo-950 hover:shadow-[inset_16px_-16px_59px_#070a10,_inset_-16px_16px_59px_#302b78,_-16px_16px_42px_#1b2640,_16px_0px_32px_#070a10] duration-300 relative group cursor-pointer text-sky-50 overflow-hidden h-12 sm:h-14 md:h-16 w-40 sm:w-48 md:w-64 rounded-full bg-gray-900 p-2 flex justify-center items-center font-extrabold shadow-[inset_-16px_16px_32px_#070a10,_inset_16px_-16px_32px_#1b2640,_16px_-0px_42px_#1b2640,_-16px_16px_32px_#070a10] ">
          <a href={artist && artist.link} className="z-10  text-center w-64 sm:w-64 md:w-64 	">Conoce al artista </a>
        </button>

        <button onClick={playNextArtist} className="hover:scale-105 py-1 px-1 rounded-full bg-gray-700 text-3xl shadow-[inset_-16px_16px_32px_#161a20,_inset_16px_-16px_32px_#586882,inset_-16px_16px_32px_#161a20,_inset_-16px_16px_32px_#161a20,_2px_-10px_22px_#586882,_-16px_16px_32px_#161a20] "><svg fill="#ffffff" height="45px" width="45px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <g> <path d="M256,0C114.848,0,0,114.848,0,256s114.848,256,256,256s256-114.848,256-256S397.152,0,256,0z M256,490.667 C126.603,490.667,21.333,385.397,21.333,256S126.603,21.333,256,21.333S490.667,126.603,490.667,256S385.397,490.667,256,490.667 z"></path> <path d="M352,149.333h-32c-5.891,0-10.667,4.776-10.667,10.667v192c0,5.891,4.776,10.667,10.667,10.667h32 c5.891,0,10.667-4.776,10.667-10.667V160C362.667,154.109,357.891,149.333,352,149.333z M341.333,341.333h-10.667V170.667h10.667 V341.333z"></path> <path d="M273.803,248.075l-106.667-96c-4.379-3.941-11.123-3.586-15.064,0.792c-1.762,1.958-2.738,4.499-2.739,7.133v192 c0.002,5.891,4.778,10.665,10.669,10.664c2.634-0.001,5.175-0.976,7.133-2.739l106.667-96c4.377-3.943,4.729-10.687,0.786-15.064 C274.341,248.585,274.078,248.323,273.803,248.075z M170.667,328.075V183.947l80,72.053L170.667,328.075z"></path> </g> </g> </g> </g></svg></button>
      </section>
      ) }
    </main>
  );
}

export default App;