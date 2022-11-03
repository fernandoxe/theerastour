import { Album, Track } from '../interfaces/Spotify';

export const getEmptyAllCheckedState = (albums: Album[]) => albums.map(album => new Array(album.tracks.length).fill(false));

export const getSelectedTracks = (checkedState: boolean[][], albums: Album[]) => {
  const tracks = checkedState.map((album, i) =>
    album.reduce((prev, current, j) => {
      if(current) prev.push(albums[i].tracks[j])
      return prev;
    }, [] as Track[])
  );
  return tracks.flat();
};