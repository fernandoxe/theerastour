import { useEffect, useState } from 'react';
import { config } from '../../config';
import { addTracks, createPlaylist, getAccessToken, getStateId } from '../../services/spotify';
import { artists } from '../../data';
import { Step } from '../Step';

const albums = artists[0].albums;

const getEmptyAllCheckedState = () => albums.map(album => new Array(album.tracks.length).fill(false));

const getSelectedTracks = (checkedState: boolean[][]) => {
  const tracks = checkedState.map((album, i) => album.filter(track => track).map((track, j) => albums[i].tracks[j]));
  return tracks.flat();
};

export const Home = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [step, setStep] = useState(0);
  const [allCheckedState, setAllCheckedState] = useState(getEmptyAllCheckedState());
  const [accessToken, setAccessToken] = useState('');
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [playlistURL, setPlaylistURL] = useState('');

  const handleLogin = () => {
    const stateId = getStateId();
    
    let url = config.AUTH_URL;
    url += `?response_type=token`;
    url += `&client_id=${encodeURIComponent(config.CLIENT_ID)}`;
    url += `&scope=${encodeURIComponent('user-read-private user-read-email playlist-modify-public')}`;
    url += `&redirect_uri=${encodeURIComponent(config.REDIRECT_URL)}`;
    url += `&state=${encodeURIComponent(stateId)}`;
    
    window.location.href = url;
  };

  useEffect(() => {
    const accessToken = getAccessToken();
    if(accessToken) {
      setShowLogin(false);
      setAccessToken(accessToken);
      window.history.replaceState('', '', window.location.href.split('#')[0]);
    }
  }, []);

  const handleStepChange = (checkedState: boolean[], stepNumber: number) => {
    const newCheckedState = allCheckedState.map((item, i) => i === stepNumber ? checkedState : item);
    setAllCheckedState(newCheckedState);
  };

  const handlePrev = () => {
    setStep(step - 1);
  };

  const handleNext = () => {
    setStep(step + 1);console.log('next access token', accessToken);
  };

  const handleCreatePlaylist = async () => {
    console.log('create playlist access token', accessToken);
    try {
      const playlist = await createPlaylist(accessToken);console.log(accessToken);
      const tracks = getSelectedTracks(allCheckedState);
      const tracksIds = tracks.map(track => track.id);
      await addTracks(accessToken, playlist.id, tracksIds);
      setPlaylistURL(playlist.external_urls.spotify);
    } catch (error) {
      
    }
  };

  const handleFinish = () => {
    setShowPlaylist(true);console.log('finish access token', accessToken);
  };

  return (
    <>
      <div className="flex justify-center gap-4">
        {showLogin &&
          <button
            className="bg-slate-300 p-2 rounded"
            onClick={handleLogin}
          >
            Login with Spotify
          </button>}
      </div>
      {!showLogin && !showPlaylist &&
        <div>
          <div className="mb-4">
            <Step
              album={albums[step]}
              checkedState={allCheckedState[step]}
              onChange={(checkedState) => handleStepChange(checkedState, step)}
            />
          </div>
          <div className="flex justify-center gap-4">
            {step > 0 &&
              <button
                className="bg-slate-300 p-2 rounded"
                onClick={handlePrev}
              >
                Prev
              </button>
            }
            {step !== albums.length - 1 &&
              <button
                className="bg-slate-300 p-2 rounded"
                onClick={handleNext}
              >
                Next
              </button>
            }
            {step === albums.length - 1 &&
              <button
                className="bg-slate-300 p-2 rounded"
                onClick={handleFinish}
              >
                Finish
              </button>
            }
          </div>
        </div>
      }
      {!showLogin && showPlaylist &&
        <>
          {!playlistURL &&
            <div className="flex justify-center gap-4">
              <button
                className="bg-slate-300 p-2 rounded"
                onClick={handleCreatePlaylist}
              >
                Create Playlist
              </button>
            </div>
          }
          {playlistURL &&
            <div>
              <a href={playlistURL}>{playlistURL}</a>
            </div>
          }
        </>
      }
    </>
  );
};
