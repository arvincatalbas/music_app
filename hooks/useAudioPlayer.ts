import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as FileSystem from 'expo-file-system';

export default function useAudioPlayer() {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const loadAudio = async (uri: string) => {
    if (sound) {
      await sound.unloadAsync();
    }

    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: false },
      (status) => {
        if (status.isLoaded) {
          setDuration(status.durationMillis || 0);
          if (status.isPlaying) {
            setPosition(status.positionMillis);
          }
        }
      }
    );

    setSound(newSound);
    setCurrentTrack(uri);
  };


  const playAudio = async () => {
    if (sound) {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const pauseAudio = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  const seekTo = async (position: number) => {
    if (sound) {
      await sound.setPositionAsync(position);
    }
  };

  return {
    loadAudio,
    playAudio,
    pauseAudio,
    seekTo,
    isPlaying,
    currentTrack,
    position,
    duration,
  };
}