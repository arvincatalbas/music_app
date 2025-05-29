import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';

export default function PlayerControls({
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  position,
  duration,
  onSeek,
}: {
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  position: number;
  duration: number;
  onSeek: (value: number) => void;
}) {
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <Text style={styles.timeText}>{formatTime(position)}</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          onSlidingComplete={onSeek}
          minimumTrackTintColor="#1DB954"
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor="#1DB954"
        />
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>
      <View style={styles.controlsContainer}>
        <TouchableOpacity onPress={onPrevious}>
          <Ionicons name="play-skip-back" size={32} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPlayPause} style={styles.playButton}>
          <Ionicons 
            name={isPlaying ? 'pause' : 'play'} 
            size={40} 
            color="black" 
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onNext}>
          <Ionicons name="play-skip-forward" size={32} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  slider: {
    flex: 1,
    marginHorizontal: 10,
  },
  timeText: {
    fontSize: 12,
    color: 'gray',
    width: 50,
    textAlign: 'center',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    marginHorizontal: 30,
  },
});