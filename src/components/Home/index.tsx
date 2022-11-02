import { useEffect, useState } from 'react';
import { config } from '../../config';
import { getAccessToken, getStateId } from '../../services/spotify';
import { artists } from '../../data';

const albums = artists[0].albums;

export const Home = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [step, setStep] = useState(0);

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
      window.history.replaceState('', '', window.location.href.split('#')[0]);
    }
  }, []);

  const renderStep = () => {
    const album = albums[step];

    return (
      <div>
        <h3>{album.name}</h3>
        {album.tracks.map(track =>
          <div>{track.name}</div>
        )}
      </div>
    );
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  return (
    <>
      <div>
        {showLogin &&
          <button onClick={handleLogin}>
            Login with Spotify
          </button>}
      </div>
      {!showLogin &&
        <div>
          <div>{renderStep()}</div>
          {step !== albums.length - 1 &&
            <div>
              <button onClick={handleNext}>
                Next
              </button>
            </div>
          }
        </div>
      }
    </>
  );
};
