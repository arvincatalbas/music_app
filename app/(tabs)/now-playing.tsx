import { Ionicons } from '@expo/vector-icons'; // For icons
import Slider from '@react-native-community/slider'; // Import Slider
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePlayback } from '../../contexts/PlaybackContext';

// Helper function to format milliseconds to mm:ss string
const formatMillis = (millis: number) => {
  const totalSeconds = Math.floor(millis / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export default function NowPlayingScreen() {
  const {
    currentSong,
    isPlaying,
    togglePlayPause,
    playNext,
    playPrevious,
    positionMillis,
    durationMillis,
    seekTo
  } = usePlayback();

  if (!currentSong) {
    return (
      <SafeAreaView style={styles.container_empty}>
        <Ionicons name="musical-notes-outline" size={60} color="#888" />
        <Text style={styles.emptyText}>No song is currently playing.</Text>
        <Text style={styles.emptySubText}>Add songs and start playback to see them here.</Text>
      </SafeAreaView>
    );
  }

  const onSlidingComplete = (value: number) => {
    seekTo(value);
  };

  return (
    <SafeAreaView style={styles.container_playing}>
      <View style={styles.albumArtPlaceholder}>
        <Ionicons name={isPlaying ? "musical-notes" : "musical-note"} size={100} color="#007bff" />
      </View>
      <Text style={styles.songTitle} numberOfLines={1} ellipsizeMode="tail">{currentSong.name}</Text>
      <Text style={styles.songArtist} numberOfLines={1} ellipsizeMode="tail">{currentSong.uri.split('/').pop()?.split('.')[0] || 'Unknown Artist'}</Text>

      <View style={styles.progressContainer}>
        <Text style={styles.timeText}>{formatMillis(positionMillis)}</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={durationMillis > 0 ? durationMillis : 1} // Ensure max is always > min
          value={positionMillis}
          onSlidingComplete={onSlidingComplete}
          minimumTrackTintColor="#007bff"
          maximumTrackTintColor="#00000030" // Lighter track for remaining duration
          thumbTintColor="#007bff"
        />
        <Text style={styles.timeText}>{formatMillis(durationMillis)}</Text>
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity onPress={playPrevious} style={styles.controlButton}>
          <Ionicons name="play-skip-back" size={40} color={durationMillis > 0 ? "#333" : "#ccc"} />
        </TouchableOpacity>
        <TouchableOpacity onPress={togglePlayPause} style={[styles.controlButton, styles.playPauseButton]} disabled={!durationMillis}>
          <Ionicons name={isPlaying ? "pause-circle" : "play-circle"} size={70} color={durationMillis > 0 ? "#007bff" : "#ccc"} />
        </TouchableOpacity>
        <TouchableOpacity onPress={playNext} style={styles.controlButton}>
          <Ionicons name="play-skip-forward" size={40} color={durationMillis > 0 ? "#333" : "#ccc"} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container_empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#555',
    marginTop: 15,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: '#777',
    marginTop: 8,
    textAlign: 'center',
  },
  container_playing: {
    flex: 1,
    justifyContent: 'space-around', // Changed for better layout with progress bar
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 20, // Ensure padding at top/bottom
    paddingHorizontal: 20,
  },
  albumArtPlaceholder: {
    width: 250,
    height: 250,
    backgroundColor: '#e9e9e9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginBottom: 20, // Adjusted margin
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  songTitle: {
    fontSize: 22, // Slightly smaller to prevent overflow with long names
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5, // Adjusted margin
    marginHorizontal: 10, // Prevent text from touching edges
  },
  songArtist: {
    fontSize: 16, // Slightly smaller
    color: '#666',
    textAlign: 'center',
    marginBottom: 20, // Adjusted margin
    marginHorizontal: 10,
  },
  progressContainer: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20, // Adjusted margin
  },
  slider: {
    flex: 1, // Slider takes up available space between time texts
    height: 40,
    marginHorizontal: 10,
  },
  timeText: {
    fontSize: 12,
    color: '#555',
    width: 40, // Fixed width to prevent layout shifts
    textAlign: 'center',
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '80%', // Adjusted width
  },
  controlButton: {
    padding: 10,
  },
  playPauseButton: {}
});
