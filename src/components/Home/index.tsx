import { useEffect, useState } from 'react';
import { config } from '../../config';
import { addTracks, createPlaylist, getAccessToken, getStateId } from '../../services/spotify';
import { artists } from '../../data';
import { Step } from '../Step';
import { Button } from '../Button';
import { Track } from '../../interfaces/Spotify';
import { Setlist } from '../Setlist';
import { getEmptyAllCheckedState, getSelectedTracks } from '../../services/tracks';
import { ReactComponent as SpotifyLogo } from '../../icons/spotify.svg';

const albums = artists[0].albums;

export const Home = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [step, setStep] = useState(0);
  const [allCheckedState, setAllCheckedState] = useState(getEmptyAllCheckedState(albums));
  const [accessToken, setAccessToken] = useState('');
  const [showSetlist, setShowSetlist] = useState(false);
  const [playlistURL, setPlaylistURL] = useState('');
  const [playlistId, setPlaylistId] = useState('');
  const [addedTracks, setAddedTracks] = useState(false);
  const [selectedTracks, setSelectedTracks] = useState<Track[]>([]);
  const [playlistError, setPlaylistError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoadingSpotify, setIsLoadingSpotify] = useState(false);

  const handleLogin = () => {
    const stateId = getStateId();
    
    let url = config.AUTH_URL;
    url += `?response_type=token`;
    url += `&client_id=${encodeURIComponent(config.CLIENT_ID)}`;
    url += `&scope=${encodeURIComponent('user-read-private user-read-email playlist-modify-public')}`;
    url += `&redirect_uri=${encodeURIComponent(config.REDIRECT_URL || '/')}`;
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
    window.scrollTo(0, 0);
  };

  const handleCreatePlaylist = async () => {
    setIsLoadingSpotify(true);
    try {
      let pid = playlistId;
      let purl = playlistURL;
      let atracks = addedTracks;
      if(!pid) {
        const playlist = await createPlaylist(accessToken);
        pid = playlist.id;
        purl = playlist.external_urls.spotify;
        setPlaylistId(pid);
      }
      if(pid && !atracks) {
        const tracksIds = selectedTracks.map(track => track.id);
        await addTracks(accessToken, pid, tracksIds);
        atracks = true;
        setPlaylistURL(purl);
        setAddedTracks(atracks);
        setPlaylistError(false);
      }
      window.open(purl);
    } catch (error: any) {
      setPlaylistError(true);
      setErrorMessage(error.message);
    } finally {
      setIsLoadingSpotify(false);
    }
  };

  const handleFinish = () => {
    const newSelectedTracks = getSelectedTracks(allCheckedState, albums);
    setSelectedTracks(newSelectedTracks);
    setShowSetlist(true);
    window.scrollTo(0, 0);
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
      {!showLogin && !showSetlist &&
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
      {!showLogin && showSetlist &&
        <>
          <div className="mb-4">
            <Setlist
              selectedTracks={selectedTracks}
              disableDrag={addedTracks}
              onReorder={setSelectedTracks}
            />
          </div>
          {/* {playlistURL && */}
            <div className="flex flex-col items-center gap-1">
              <Button
                loading={isLoadingSpotify}
                onClick={handleCreatePlaylist}
              >
                <div className="flex gap-2">
                  <div className="w-5 h-5">
                    <SpotifyLogo />
                  </div>
                  <div className="text-sm">
                    Create playlist
                  </div>
                </div>
              </Button>
              {playlistError &&
                <div className="text-xs">
                  Error creating the playlist, try again
                </div>
              }
              {errorMessage &&
                <div className="text-xs">
                  {errorMessage}
                </div>
              }
            </div>
          {/* } */}
        </>
      }
    </div>
  );
};
