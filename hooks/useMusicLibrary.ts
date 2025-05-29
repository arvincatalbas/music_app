import { useState, useEffect } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { Platform } from 'react-native';

export default function useMusicLibrary() {
  const [songs, setSongs] = useState<MediaLibrary.Asset[]>([]);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (permissionResponse?.granted) {
      loadSongs();
    }
  }, [permissionResponse]);

  const loadSongs = async () => {
    setIsLoading(true);
    try {
      const media = await MediaLibrary.getAssetsAsync({
        mediaType: MediaLibrary.MediaType.audio,
        sortBy: MediaLibrary.SortBy.default,
      });
      setSongs(media.assets);
    } catch (error) {
      console.error('Error loading songs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const requestMediaPermission = async () => {
    if (Platform.OS === 'android' && !permissionResponse?.granted) {
      await requestPermission();
    }
  };

  return {
    songs,
    isLoading,
    permissionResponse,
    requestMediaPermission,
    refreshLibrary: loadSongs,
  };
}