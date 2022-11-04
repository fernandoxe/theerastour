import axios from 'axios';
import { v4 } from 'uuid';
import { config } from '../config';

export const getStateId = () => {
  let stateId = localStorage.getItem('stateId');
  if(!stateId) {
    stateId = v4();
    // localStorage.setItem('state', stateId);
  }
  return stateId;
}

export const getAccessToken = () => {
  const params = new URLSearchParams(window.location.hash.slice(1));
  const access_token = params.get('access_token');
  return access_token;
};

export const getHeaders = (accessToken: string) => {
  return {
    Authorization: `Bearer ${accessToken}`,
  };
};

export const getData = async (accessToken: string) => {
  const headers = getHeaders(accessToken);

  const params = {
    q: 'taylor swift',
    type: 'artist',
    market: 'US',
  };

  try {
    const { data: artistsData } = await axios.get(`${config.API_URL}/search`, { params, headers });
    const ts = artistsData.artists.items[0];
    const artistId = ts.id;
    const { data: albumsData } = await axios.get(`${config.API_URL}/artists/${artistId}/albums`, {params: {include_groups: 'album', market: 'US', limit: 50}, headers});
    const albums = albumsData.items;
    const albumsRequests = [];
    for (let i = 0; i < albums.length; i++) {
      const albumId = albums[i].id;
      const request = axios.get(`${config.API_URL}/albums/${albumId}/tracks`, {params: {market: 'US', limit: 50}, headers});
      albumsRequests.push(request);
    }

    const albumsTracks = await Promise.all(albumsRequests);
    
    const allAlbums = [];
    for (let i = 0; i < albumsTracks.length; i++) {
      const album = albumsTracks[i].data;
      const allTracks = [];
      for (let j = 0; j < album.items.length; j++) {
        const song = album.items[j];
        allTracks.push({
          name: song.name,
          id: song.id,
          duration: song.duration_ms,
          explicit: song.explicit,
        });
      }

      if(!new RegExp('(karaoke|machine|tour|sessions|live)', 'gi').test(albums[i].name.toLowerCase()))
      allAlbums.push({
        name: albums[i].name,
        id: albums[i].id,
        image: albums[i].images[1].url,
        explicit: allTracks.some(track => track.explicit),
        tracks: allTracks,
      });
    }
    console.log(allAlbums);
    const allArtists = [];
    allArtists.push({
      name: artistsData.artists.items[0].name,
      id: artistsData.artists.items[0].id,
      albums: allAlbums,
    });
    console.log(allArtists);
    return allArtists;
  } catch (error) {
    
  }
};

const getUser = async (accessToken: string) => {
  const headers = getHeaders(accessToken);

  const { data } = await axios.get(`${config.API_URL}/me`, { headers });
  return data;
};

export const createPlaylist = async (accessToken: string) => {
  const user = await getUser(accessToken);
  const headers = getHeaders(accessToken);
  const body = {
    name: 'The Eras Tour',
  };

  // await new Promise(resolve => setTimeout(resolve, 1000));
  // throw new Error('Playlist not created');

  const { data } = await axios.post(`${config.API_URL}/users/${user.id}/playlists`, body, { headers });
  return data;
};

const getURIs = (tracks: string[]) => {
  return tracks.map(track => `spotify:track:${track}`);
};

export const addTracks = async (accessToken: string, playlistId: string, tracks: string[]) => {
  const headers = getHeaders(accessToken);

  const body = {
    uris: getURIs(tracks),
  };

  // await new Promise(resolve => setTimeout(resolve, 1000));
  // throw new Error('Tracks not added');

  const { data } = await axios.post(`${config.API_URL}/playlists/${playlistId}/tracks`, body, { headers });
  return data;
};
