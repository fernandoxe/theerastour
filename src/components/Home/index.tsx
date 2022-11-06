import { useEffect, useState } from 'react';
import { config } from '../../config';
import { addCover, addTracks, createPlaylist, getAccessToken, getStateId } from '../../services/spotify';
import { artists } from '../../data';
import { Step } from '../Step';
import { Button } from '../Button';
import { Track } from '../../interfaces/Spotify';
import { Reorder } from '../Reorder';
import { getEmptyAllCheckedState, getSelectedTracks, getTotalDuration } from '../../services/tracks';
import { ReactComponent as SpotifyLogo } from '../../icons/spotify.svg';
import { Share } from '../Share';
import { Setlist } from '../Setlist';
import { cover } from '../../icons/cover';
import { clickCreatePlaylist, clickLogin, clickNext, clickPrev, clickViewPlaylist, showSetlist, successfulLogin } from '../../services/gtm';
import * as Sentry from "@sentry/browser";

const albums = artists[0].albums;

export const Home = () => {
  const [step, setStep] = useState(0);
  const [allCheckedState, setAllCheckedState] = useState(getEmptyAllCheckedState(albums));
  const [accessToken, setAccessToken] = useState('');
  const [playlistURL, setPlaylistURL] = useState('');
  const [playlistId, setPlaylistId] = useState('');
  const [uploadedCover, setUploadedCover] = useState(false);
  const [addedTracks, setAddedTracks] = useState(false);
  const [selectedTracks, setSelectedTracks] = useState<Track[]>([]);
  const [playlistError, setPlaylistError] = useState(false);
  const [isLoadingSpotify, setIsLoadingSpotify] = useState(false);

  const handleLogin = () => {
    clickLogin();
    const stateId = getStateId();
    
    let url = config.AUTH_URL;
    url += `?response_type=token`;
    url += `&client_id=${encodeURIComponent(config.CLIENT_ID)}`;
    url += `&scope=${encodeURIComponent('user-read-private user-read-email playlist-modify-public ugc-image-upload')}`;
    url += `&redirect_uri=${encodeURIComponent(config.REDIRECT_URL || '/')}`;
    url += `&state=${encodeURIComponent(stateId)}`;
    
    window.location.href = url;
  };

  useEffect(() => {
    const accessToken = getAccessToken();
    if(accessToken) {
      setStep(1);
      setAccessToken(accessToken);
      window.history.replaceState('', '', window.location.href.split('#')[0]);
      successfulLogin();
    }
  }, []);

  const handleStepChange = (checkedState: boolean[], stepNumber: number) => {
    const newCheckedState = allCheckedState.map((item, i) => i === stepNumber ? checkedState : item);
    setAllCheckedState(newCheckedState);
  };

  const handlePrev = () => {
    setStep(step - 1);
    clickPrev(step);
  };

  const handleNext = () => {
    const newStep = step + 1;
    setStep(step + 1);
    if(newStep === 11) {
      const newSelectedTracks = getSelectedTracks(allCheckedState, albums);
      setSelectedTracks(newSelectedTracks);
    };
    window.scrollTo(0, 0);
    clickNext(step);
  };

  const handleFinish = () => {
    setStep(step + 1);
    window.scrollTo(0, 0);
    showSetlist(selectedTracks.length, getTotalDuration(selectedTracks));
  };

  const handleCreatePlaylist = async () => {
    setPlaylistError(false);
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
        setPlaylistURL(purl);
      }
      if(pid && !uploadedCover) {
        addCover(accessToken, pid, cover)
          .then(response => setUploadedCover(true))
          .catch(error => Sentry.captureException(error));
      }
      if(pid && !atracks) {
        const tracksIds = selectedTracks.map(track => track.id);console.log('trying add tracks');
        await addTracks(accessToken, pid, tracksIds);
        atracks = true;
        setAddedTracks(atracks);
      }
      window.open(purl);
    } catch (error: any) {
      setPlaylistError(true);
      Sentry.captureException(error);
    } finally {
      setIsLoadingSpotify(false);
      clickCreatePlaylist();
    }
  };

  const handleViewPlaylist = () => {
    window.open(playlistURL);
    clickViewPlaylist();
  };

  return (
    <div className="max-w-2xl mx-auto">
      {step === 0 &&
        <div className="fixed top-0 right-0 bottom-0 left-0 flex flex-col items-center justify-center">
          <div className="w-48 h-48 mb-4">
            <img
              src={cover}
              alt="The Eras Tour Cover"
            />
          </div>
          <div className="font-bold text-2xl text-white mb-4">
            The Eras Tour setlist
          </div>
          <div className="text-white">
            Make your own setlist
          </div>
          <div className="text-white mb-4">
            selecting up to 3 songs per album
          </div>
          <Button
            onClick={handleLogin}
          >
            <div className="flex gap-2">
              <div className="w-5 h-5">
                <SpotifyLogo />
              </div>
              <div className="text-sm">
                Start
              </div>
            </div>
          </Button>
        </div>
      }
      {step > 0 && step <= 10 &&
        <>
          <div className="mb-4">
            <Step
              album={albums[step - 1]}
              checkedState={allCheckedState[step - 1]}
              onChange={(checkedState) => handleStepChange(checkedState, step - 1)}
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
            {step >= 1 &&
              <div className="only:ml-auto">
                <Button
                  onClick={handleNext}
                >
                  Next
                </Button>

              </div>
            }
          </div>
        </>
      }
      {step === 11 &&
        <>
          <div className="mb-4">
            <Reorder
              selectedTracks={selectedTracks}
              onReorder={setSelectedTracks}
            />
          </div>
          <div className="flex justify-between gap-4">
            <Button
              variant="secondary"
              onClick={handlePrev}
            >
              Previous
            </Button>
            <Button
              onClick={handleFinish}
            >
              Finish
            </Button>
          </div>
        </>
      }
      {step === 12 &&
        <>
          <div>
            <Setlist selectedTracks={selectedTracks} totalDuration={getTotalDuration(selectedTracks)} />
          </div>
          <div className="flex flex-col items-center gap-4">
            {!addedTracks &&
              <div>
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
                  <div className="text-xs text-white">
                    Error creating the playlist, try again
                  </div>
                }
              </div>
            }
            {addedTracks &&
              <Button
                onClick={handleViewPlaylist}
              >
                <div className="flex gap-2">
                  <div className="w-5 h-5">
                    <SpotifyLogo />
                  </div>
                  <div className="text-sm">
                    View playlist
                  </div>
                </div>
              </Button>
            }
            <div>
              <Share selectedTracks={selectedTracks} spotifyPlaylist={playlistURL} />
            </div>
          </div>
        </>
      }
    </div>
  );
};
