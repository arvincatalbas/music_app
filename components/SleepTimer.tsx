import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TIMER_OPTIONS = [15, 30, 45, 60, 90]; // minutes

export default function SleepTimer({ 
  onTimerSet,
  onCancel,
}: {
  onTimerSet: (minutes: number) => void;
  onCancel: () => void;
}) {
  const [activeTimer, setActiveTimer] = useState<number | null>(null);

  const handleTimerPress = (minutes: number) => {
    setActiveTimer(minutes);
    onTimerSet(minutes * 60 * 1000); // Convert to milliseconds
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sleep Timer</Text>
      <View style={styles.timerOptions}>
        {TIMER_OPTIONS.map(minutes => (
          <TouchableOpacity
            key={minutes}
            style={[
              styles.timerButton,
              activeTimer === minutes && styles.activeTimer,
            ]}
            onPress={() => handleTimerPress(minutes)}
          >
            <Text style={[
              styles.timerText,
              activeTimer === minutes && styles.activeTimerText,
            ]}>
              {minutes} min
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {activeTimer !== null && (
        <TouchableOpacity style={styles.cancelButton} onPress={() => {
          setActiveTimer(null);
          onCancel();
        }}>
          <Ionicons name="close-circle" size={24} color="red" />
          <Text style={styles.cancelText}>Cancel Timer</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  timerOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 10,
  },
  timerButton: {
    padding: 10,
    margin: 5,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeTimer: {
    backgroundColor: '#1DB954',
  },
  timerText: {
    color: '#333',
  },
  activeTimerText: {
    color: 'white',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  cancelText: {
    color: 'red',
    marginLeft: 5,
  },
});