import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
      <Tabs.Screen
        name="now-playing"
        options={{
          title: 'Now Playing',
          tabBarIcon: ({ color }) => <Ionicons name="play-circle" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="allsongs"
        options={{
          title: 'All Songs',
          tabBarIcon: ({ color }) => <Ionicons name="list-outline" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}