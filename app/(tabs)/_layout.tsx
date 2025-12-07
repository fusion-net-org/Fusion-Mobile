import { HOMETABS } from '@/constants/navigate/tabs';
import { GetNotifications } from '@/src/services/notificationService';
import { TabIconProps } from '@/types/Icon/TabIconProps';
import { FontAwesome5 } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { router, Tabs, usePathname } from 'expo-router';

import { StatusBar, Text, TouchableOpacity, View } from 'react-native';
import '../globals.css';

export default function IconLayout() {
  // Lấy cache hiện tại của notifications (nếu có)
  const pathname = usePathname();

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: GetNotifications,
  });
  const unreadCount = notifications?.filter((n: any) => !n.isRead)?.length ?? 0;

  const TabIcon = ({ iconName, title, href }: TabIconProps) => {
    const isFocused = pathname === href.replace('/(tabs)', '');
    const isNotificationTab = title === 'Notification';

    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          transform: [{ translateY: isFocused ? -7 : -10 }],
        }}
      >
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            transform: [{ translateY: isFocused ? -2 : 0 }],
          }}
        >
          <FontAwesome5 name={iconName} size={25} color={isFocused ? '#0F0D23' : '#A8B5DB'} />

          {isNotificationTab && unreadCount > 0 && (
            <View
              style={{
                position: 'absolute',
                top: -6,
                right: -12,
                backgroundColor: 'red',
                borderRadius: 10,
                paddingHorizontal: 5,
                paddingVertical: 1,
                minWidth: 18,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: 'white', fontSize: 8, fontWeight: 'bold' }}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          )}
        </View>

        {isFocused && (
          <Text
            style={{
              fontSize: 11,
              color: '#0F0D23',
              textAlign: 'center',
              marginTop: 2,
            }}
          >
            {title}
          </Text>
        )}
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
            borderWidth: 2,
            borderRadius: 20,
            marginHorizontal: 10,
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
        {HOMETABS.map((tab) => (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{
              headerShown: false,
              tabBarButton: () => (
                <TouchableOpacity
                  onPress={() => {
                    router.replace(tab.href as any);
                  }}
                  activeOpacity={0.8}
                >
                  <TabIcon href={tab.href} iconName={tab.iconName} title={tab.title} />
                </TouchableOpacity>
              ),
            }}
          />
        ))}
      </Tabs>
    </>
  );
}
