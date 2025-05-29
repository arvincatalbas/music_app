import React, { createContext, ReactNode, useContext, useState } from 'react';
import 'react-native-get-random-values'; // For uuid
import { v4 as uuidv4 } from 'uuid';
import { Song } from './PlaybackContext'; // Assuming Song type is exported from PlaybackContext or a shared types file

export interface Playlist {
    id: string;
    name: string;
    songs: Song[];
}

interface PlaylistContextType {
    playlists: Playlist[];
    createPlaylist: (name: string) => Promise<void>;
    addSongToPlaylist: (playlistId: string, song: Song) => Promise<void>;
    removeSongFromPlaylist: (playlistId: string, songId: string) => Promise<void>;
    getPlaylistById: (playlistId: string) => Playlist | undefined;
    // Add more functions as needed (e.g., deletePlaylist, reorderSongs)
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

export const usePlaylists = () => {
    const context = useContext(PlaylistContext);
    if (!context) {
        throw new Error('usePlaylists must be used within a PlaylistProvider');
    }
    return context;
};

interface PlaylistProviderProps {
    children: ReactNode;
}

export const PlaylistProvider: React.FC<PlaylistProviderProps> = ({ children }) => {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);

    const createPlaylist = async (name: string) => {
        const newPlaylist: Playlist = {
            id: uuidv4(), // Generate a unique ID
            name,
            songs: [],
        };
        setPlaylists(prevPlaylists => [...prevPlaylists, newPlaylist]);
        // Here you might want to persist playlists to AsyncStorage
        console.log('Playlist created:', newPlaylist);
    };

    const addSongToPlaylist = async (playlistId: string, song: Song) => {
        setPlaylists(prevPlaylists =>
            prevPlaylists.map(playlist =>
                playlist.id === playlistId
                    ? { ...playlist, songs: [...playlist.songs.filter(s => s.id !== song.id), song] } // Avoid duplicates by ID
                    : playlist
            )
        );
        // Persist changes
        console.log(`Song ${song.name} added to playlist ${playlistId}`);
    };

    const removeSongFromPlaylist = async (playlistId: string, songId: string) => {
        setPlaylists(prevPlaylists =>
            prevPlaylists.map(playlist =>
                playlist.id === playlistId
                    ? { ...playlist, songs: playlist.songs.filter(s => s.id !== songId) }
                    : playlist
            )
        );
        // Persist changes
        console.log(`Song ${songId} removed from playlist ${playlistId}`);
    };

    const getPlaylistById = (playlistId: string): Playlist | undefined => {
        return playlists.find(p => p.id === playlistId);
    };

    // Add useEffect for loading playlists from AsyncStorage when app starts

    return (
        <PlaylistContext.Provider value={{ playlists, createPlaylist, addSongToPlaylist, removeSongFromPlaylist, getPlaylistById }}>
            {children}
        </PlaylistContext.Provider>
    );
};
