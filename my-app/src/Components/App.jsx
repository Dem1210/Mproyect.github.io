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

        <button onClick={playNextArtist} className="hover:scale-105 py-1 px-1 rounded-full bg-gray-700 text-3xl shadow-[inset_-16px_16px_32px_#161a20,_inset_16px_-16px_32px_#586882,inset_-16px_16px_32px_#161a20,_inset_-16px_16px_32px_#161a20,_2px_-10px_22px_#586882,_-16px_16px_32px_#161a20] "><img src="../../public/nextIcon.svg" alt="" /></button>
      </section>
      ) }
    </main>
  );
}

export default App;