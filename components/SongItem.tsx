import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type SongItemProps = {
  item: {
    filename: string;
    duration?: number;
    // add other properties as needed
  };
  onPress: () => void;
  isCurrent: boolean;
};

export default function SongItem({ 
  item, 
  onPress, 
  isCurrent 
}: SongItemProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons 
          name={isCurrent ? 'musical-note' : 'musical-notes'} 
          size={24} 
          color={isCurrent ? 'blue' : 'gray'} 
        />
      </View>
      <View style={styles.textContainer}>
        <Text 
          style={[styles.title, isCurrent && { color: 'blue' }]} 
          numberOfLines={1}
        >
          {item.filename.replace(/\.[^/.]+$/, "")}
        </Text>
        <Text style={styles.duration}>
          {Math.floor((item.duration || 0) / 1000)} sec
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  duration: {
    fontSize: 12,
    color: 'gray',
    marginTop: 4,
  },
});