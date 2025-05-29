import AsyncStorage from '@react-native-async-storage/async-storage';

const PLAYLIST_KEY = '@playlists';

export interface Playlist {
  id: string;
  name: string;
  songs: string[]; // Array of song URIs
  createdAt: number;
}

export const savePlaylist = async (playlist: Playlist) => {
  try {
    const existing = await getPlaylists();
    const updated = [...existing, playlist];
    await AsyncStorage.setItem(PLAYLIST_KEY, JSON.stringify(updated));
    return playlist;
  } catch (error) {
    console.error('Error saving playlist:', error);
    throw error;
  }
};

export const getPlaylists = async (): Promise<Playlist[]> => {
  try {
    const json = await AsyncStorage.getItem(PLAYLIST_KEY);
    return json ? JSON.parse(json) : [];
  } catch (error) {
    console.error('Error getting playlists:', error);
    return [];
  }
};

export const updatePlaylist = async (id: string, updates: Partial<Playlist>) => {
  try {
    const playlists = await getPlaylists();
    const updated = playlists.map(p => 
      p.id === id ? { ...p, ...updates } : p
    );
    await AsyncStorage.setItem(PLAYLIST_KEY, JSON.stringify(updated));
    return updated.find(p => p.id === id);
  } catch (error) {
    console.error('Error updating playlist:', error);
    throw error;
  }
};

export const deletePlaylist = async (id: string) => {
  try {
    const playlists = await getPlaylists();
    const updated = playlists.filter(p => p.id !== id);
    await AsyncStorage.setItem(PLAYLIST_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error deleting playlist:', error);
    throw error;
  }
};