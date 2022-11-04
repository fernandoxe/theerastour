export interface Track {
  name: string;
  id: string;
  duration: number;
  explicit: boolean;
}

export interface Album {
  name: string;
  id: string;
  image: string;
  explicit: boolean;
  tracks: Track[];
}

export interface Artist {
  name: string;
  id: string;
  albums: Album[];
};

