import { useEffect, useState } from 'react';
import { config } from '../../config';
import { addTracks, createPlaylist, getAccessToken, getStateId } from '../../services/spotify';
import { artists } from '../../data';
import { Step } from '../Step';
import { Button } from '../Button';
import { Track } from '../../interfaces/Spotify';
import { Setlist } from '../Setlist';

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
  const [selectedTracks, setSelectedTracks] = useState<Track[]>([]);

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
    setStep(step + 1);
  };

  const handleCreatePlaylist = async () => {
    try {
      const playlist = await createPlaylist(accessToken);
      const tracksIds = selectedTracks.map(track => track.id);
      await addTracks(accessToken, playlist.id, tracksIds);
      setPlaylistURL(playlist.external_urls.spotify);
    } catch (error) {
      
    }
  };

  const handleFinish = () => {
    setSelectedTracks(getSelectedTracks(allCheckedState));
    setShowPlaylist(true);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {showLogin &&
        <div className="fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center gap-4">
          <Button
            onClick={handleLogin}
          >
            Start
          </Button>
        </div>
      }
      {!showLogin && !showPlaylist &&
        <>
          <div className="mb-4">
            <Step
              album={albums[step]}
              checkedState={allCheckedState[step]}
              onChange={(checkedState) => handleStepChange(checkedState, step)}
            />
          </div>
          <div className="flex justify-between gap-4">
            {step > 0 &&
              <Button
                variant="secondary"
                onClick={handlePrev}
              >
                Previous
              </Button>
            }
            {step !== albums.length - 1 &&
              <div className="only:ml-auto">
                <Button
                  onClick={handleNext}
                >
                  Next
                </Button>

              </div>
            }
            {step === albums.length - 1 &&
              <Button
                onClick={handleFinish}
              >
                Finish
              </Button>
            }
          </div>
        </>
      }
      {!showLogin && showPlaylist &&
        <>
          {!playlistURL &&
            <Setlist
              selectedTracks={selectedTracks}
              onReorder={setSelectedTracks}
              onCreatePlaylist={handleCreatePlaylist}
            />
          }
          {playlistURL &&
            <div>
              <a href={playlistURL}>{playlistURL}</a>
            </div>
          }
        </>
      }
    </div>
  );
};
