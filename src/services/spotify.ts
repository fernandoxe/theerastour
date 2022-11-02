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

export const getData = async (accessToken: string) => {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  } ;

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
          explicit: song.explicit,
        });
      }
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