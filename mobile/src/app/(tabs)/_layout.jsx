import { Tabs } from "expo-router";
import { Type } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderColor: "#E5E7EB",
          paddingTop: 4,
        },
        tabBarActiveTintColor: "#4a90e2",
        tabBarInactiveTintColor: "#6B6B6B",
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Accessibility",
          tabBarIcon: ({ color, size }) => <Type color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
