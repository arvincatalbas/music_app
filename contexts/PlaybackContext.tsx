import { Audio, AVPlaybackStatusSuccess } from 'expo-av';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// Define the shape of a Song object (can be imported if defined elsewhere)
export type Song = {
    id: string;
    name: string;
    uri: string;
};

interface PlaybackContextType {
    currentSong: Song | null;
    isPlaying: boolean;
    soundObject: Audio.Sound | null;
    currentQueue: Song[];
    positionMillis: number;
    durationMillis: number;
    loadAndPlaySong: (song: Song, queue?: Song[]) => Promise<void>;
    togglePlayPause: () => Promise<void>;
    playNext: () => Promise<void>;
    playPrevious: () => Promise<void>;
    seekTo: (millis: number) => Promise<void>;
    // Add other controls here later e.g., seek, next, previous
}

const PlaybackContext = createContext<PlaybackContextType | undefined>(undefined);

export const usePlayback = () => {
    const context = useContext(PlaybackContext);
    if (!context) {
        throw new Error('usePlayback must be used within a PlaybackProvider');
    }
    return context;
};

interface PlaybackProviderProps {
    children: ReactNode;
}

export const PlaybackProvider: React.FC<PlaybackProviderProps> = ({ children }) => {
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [soundObject, setSoundObject] = useState<Audio.Sound | null>(null);
    const [currentQueue, setCurrentQueue] = useState<Song[]>([]);
    const [positionMillis, setPositionMillis] = useState(0);
    const [durationMillis, setDurationMillis] = useState(0);

    useEffect(() => {
        // Cleanup sound object when it changes or component unmounts
        return () => {
            soundObject?.unloadAsync();
        };
    }, [soundObject]);

    const actualPlaySong = async (song: Song) => {
        if (soundObject) {
            await soundObject.unloadAsync();
            // Reset position and duration for the old song
            setPositionMillis(0);
            setDurationMillis(0);
        }
        console.log('Context: Playing', song.name);
        try {
            const { sound, status } = await Audio.Sound.createAsync(
                { uri: song.uri },
                { shouldPlay: true }
            );
            setSoundObject(sound);
            setCurrentSong(song);
            setIsPlaying(true);
            if ((status as AVPlaybackStatusSuccess).isLoaded) {
                setDurationMillis((status as AVPlaybackStatusSuccess).durationMillis || 0);
                setPositionMillis((status as AVPlaybackStatusSuccess).positionMillis || 0);
            }

            sound.setOnPlaybackStatusUpdate(async (statusUpdate) => {
                if (statusUpdate.isLoaded) {
                    setIsPlaying(statusUpdate.isPlaying);
                    setPositionMillis(statusUpdate.positionMillis);
                    setDurationMillis(statusUpdate.durationMillis || 0);

                    if (statusUpdate.didJustFinish) {
                        console.log('Context: Song finished, trying to play next');
                        await sound.unloadAsync();
                        setSoundObject(null);
                        setPositionMillis(0);
                        setDurationMillis(0);
                        playNext(true);
                    }
                }
            });
        } catch (error) {
            console.error("Context: Error playing song:", error);
            setCurrentSong(null);
            setIsPlaying(false);
            setSoundObject(null);
            setPositionMillis(0);
            setDurationMillis(0);
        }
    }

    const loadAndPlaySong = async (song: Song, queue?: Song[]) => {
        if (queue) {
            setCurrentQueue(queue);
        }
        await actualPlaySong(song);
    };

    const togglePlayPause = async () => {
        if (!soundObject || !currentSong) return; // Ensure currentSong exists
        if (isPlaying) {
            await soundObject.pauseAsync();
        } else {
            await soundObject.playAsync();
        }
        // isPlaying state will be updated by setOnPlaybackStatusUpdate
    };

    const playNext = async (isAutoNext: boolean = false) => {
        if (currentQueue.length === 0) return;
        if (!currentSong && !isAutoNext) return; // Don't play next if no song is playing and it's not auto-next

        const currentIndex = currentSong ? currentQueue.findIndex(s => s.id === currentSong.id) : -1;
        let nextIndex = currentIndex + 1;
        if (nextIndex >= currentQueue.length) {
            nextIndex = 0; // Loop to the beginning
        }
        if (currentQueue[nextIndex]) {
            if (currentQueue.length === 1 && isAutoNext && currentIndex === 0) {
                // Single song in queue and it just finished, stop playback
                console.log("Context: Single song finished, stopping.");
                setCurrentSong(null);
                setIsPlaying(false);
                setPositionMillis(0);
                setDurationMillis(0);
                if (soundObject) await soundObject.unloadAsync();
                setSoundObject(null);
                return;
            }
            await actualPlaySong(currentQueue[nextIndex]);
        }
    };

    const playPrevious = async () => {
        if (currentQueue.length === 0 || !currentSong) return;
        const currentIndex = currentQueue.findIndex(s => s.id === currentSong.id);
        let prevIndex = currentIndex - 1;
        if (prevIndex < 0) {
            prevIndex = currentQueue.length - 1; // Loop to the end
        }
        if (currentQueue[prevIndex]) {
            await actualPlaySong(currentQueue[prevIndex]);
        }
    };

    const seekTo = async (millis: number) => {
        if (soundObject && currentSong) {
            try {
                await soundObject.setPositionAsync(millis);
                setPositionMillis(millis); // Optimistically update, will be confirmed by status update
            } catch (error) {
                console.error("Error seeking:", error);
            }
        }
    };

    return (
        <PlaybackContext.Provider value={{
            currentSong,
            isPlaying,
            soundObject,
            currentQueue,
            positionMillis,
            durationMillis,
            loadAndPlaySong,
            togglePlayPause,
            playNext,
            playPrevious,
            seekTo
        }}>
            {children}
        </PlaybackContext.Provider>
    );
}; 