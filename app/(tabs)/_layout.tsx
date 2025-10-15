import { TABS } from '@/constants/navigate/tabs';
import { TabIconProps } from '@/types/Icon/TabIconProps';
import { FontAwesome5 } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StatusBar, Text, View } from 'react-native';
import '../globals.css';

export default function IconLayout() {
  const TabIcon = ({ focused, iconName, title }: TabIconProps) => {
    return (
      <View className="mt-7 flex-col items-center justify-center" style={{ height: '100%' }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            transform: [{ translateY: focused ? -1 : 0 }],
            zIndex: focused ? 15 : 1,
          }}
        >
          <FontAwesome5
            name={iconName}
            size={focused ? 25 : 25}
            color={focused ? '#0F0D23' : '#A8B5DB'}
          />
        </View>

        <View style={{ minHeight: 20, marginTop: 2 }}>
          {focused && (
            <Text
              className="font-semibold"
              style={{
                fontSize: 14,
                color: '#0F0D23',
                textAlign: 'center',
                width: 80,
              }}
            >
              {title}
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <>
      <StatusBar hidden={true} />

      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: '#F2F2F2',
            height: 70,
            borderTopWidth: 0,
            borderRadius: 20,
            marginHorizontal: 20,
            marginBottom: 20,
            position: 'absolute',
            shadowColor: '#000',
            shadowOpacity: 0.05,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 5 },
            elevation: 5,
            paddingTop: 10,
            paddingBottom: 10,
          },
          tabBarItemStyle: {
            flex: 1,
            paddingHorizontal: 0,
            justifyContent: 'center',
            alignItems: 'center',
            height: 70,
          },
        }}
      >
        {TABS.map((tab) => (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{
              headerShown: false,
              tabBarIcon: ({ focused }) => (
                <TabIcon focused={focused} iconName={tab.iconName} title={tab.title} />
              ),
            }}
          />
        ))}
      </Tabs>
    </>
  );
}
