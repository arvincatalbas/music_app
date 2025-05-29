import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { type Song, usePlayback } from '../../contexts/PlaybackContext';

export default function AllSongsScreen() {
    const [allSongs, setAllSongs] = useState<Song[]>([]);
    const { loadAndPlaySong, currentSong: contextCurrentSong, isPlaying: contextIsPlaying } = usePlayback();

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'audio/*',
                copyToCacheDirectory: false,
                multiple: true,
            });

            if (result.canceled) {
                console.log('Document picking was cancelled');
                return;
            }

            if (result.assets && result.assets.length > 0) {
                const newSongs: Song[] = result.assets.map((asset) => ({
                    id: asset.uri,
                    name: asset.name,
                    uri: asset.uri,
                }));
                setAllSongs(prevSongs => {
                    const existingUris = new Set(prevSongs.map(s => s.uri));
                    const uniqueNewSongs = newSongs.filter(s => !existingUris.has(s.uri));
                    return [...prevSongs, ...uniqueNewSongs];
                });
            } else {
                Alert.alert("No files selected", "You didn't select any audio files.");
            }
        } catch (err) {
            console.error("Error picking document:", err);
            Alert.alert("Error", "Could not pick files. Please check permissions or try again.");
        }
    };

    const renderSongItem = ({ item }: { item: Song }) => (
        <TouchableOpacity
            style={styles.songItem}
            onPress={() => loadAndPlaySong(item, allSongs)}
        >
            <Ionicons
                name={contextCurrentSong?.id === item.id && contextIsPlaying ? "pause-circle" : "play-circle-outline"}
                size={28}
                color={contextCurrentSong?.id === item.id ? "#007bff" : "#333"}
                style={styles.playIcon}
            />
            <View style={styles.songInfoContainer}>
                <Text
                    style={[styles.songName, contextCurrentSong?.id === item.id ? styles.playingSong : {}]}
                >
                    {item.name}
                </Text>
                {contextCurrentSong?.id === item.id && (
                    <Text style={styles.statusText}>{contextIsPlaying ? "Playing..." : "Paused"}</Text>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>All Songs</Text>
                <TouchableOpacity style={styles.addButton} onPress={pickDocument}>
                    <Ionicons name="add-circle-outline" size={32} color="#007bff" />
                    <Text style={styles.addButtonText}>Add Songs</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={allSongs}
                renderItem={renderSongItem}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={<Text style={styles.emptyText}>No songs added yet. Tap &#39;Add Songs' to begin!</Text>}
                contentContainerStyle={styles.listContentContainer}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    headerContainer: {
        paddingVertical: 15,
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        backgroundColor: '#fff',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#e7f3ff',
        borderRadius: 20,
    },
    addButtonText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#007bff',
        fontWeight: '500',
    },
    listContentContainer: {
        paddingBottom: 20,
    },
    songItem: {
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
        marginHorizontal: 10,
        borderRadius: 8,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
    },
    playIcon: {
        marginRight: 15,
    },
    songInfoContainer: {
        flex: 1,
    },
    songName: {
        fontSize: 16,
        color: '#333',
    },
    playingSong: {
        fontWeight: 'bold',
        color: '#007bff',
    },
    statusText: {
        fontSize: 12,
        color: '#555',
        marginTop: 2,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#888',
    }
});