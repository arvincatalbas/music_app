import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';

export default function PlaylistModal({
  visible,
  onClose,
  onSubmit,
  initialName = '',
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  initialName?: string;
}) {
  const [name, setName] = useState(initialName);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>
            {initialName ? 'Edit Playlist' : 'New Playlist'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Playlist name"
            value={name}
            onChangeText={setName}
            autoFocus
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.submitButton]}
              onPress={() => {
                onSubmit(name);
                onClose();
              }}
              disabled={!name.trim()}
            >
              <Text style={[styles.buttonText, styles.submitButtonText]}>
                {initialName ? 'Update' : 'Create'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#1DB954',
  },
  buttonText: {
    color: '#333',
  },
  submitButtonText: {
    color: 'white',
  },
});