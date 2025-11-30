// screens/Setting.tsx
import { toggleNotification } from '@/src/services/notificationService';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, Modal, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';

const Setting = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState<'en' | 'vi'>('en');
  const [notifications, setNotifications] = useState(true);
  const [langModalOpen, setLangModalOpen] = useState(false);

  const notificationTypes = [
    'BUSINESS',
    'SYSTEM',
    'PROJECT',
    'TASK',
    'COMPANY',
    'WARNING',
    'PARTNER',
    'PROJECT_REQUEST',
    'INFO',
    'ADMIN_NOTIFICATE',
  ] as const;
  type NotificationType = (typeof notificationTypes)[number];

  const [notifModalOpen, setNotifModalOpen] = useState(false);
  const [selectedNotifType, setSelectedNotifType] = useState<NotificationType>('SYSTEM');
  const [tempNotifType, setTempNotifType] = useState<NotificationType>(selectedNotifType);

  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const secondaryTextColor = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  const languages = [
    { label: 'English', value: 'en' },
    { label: 'Vietnamese', value: 'vi' },
  ];

  const handleToggleNotification = async (value: boolean, type?: NotificationType) => {
    const notifType = type || selectedNotifType;
    setNotifications(value);
    try {
      await toggleNotification({ type: notifType, isEnable: value });
    } catch (error) {
      setNotifications(!value);
      Alert.alert('Error', `Failed to update ${notifType} notification`);
      console.error(error);
    }
  };

  return (
    <View className={`${bgColor} flex-1 p-4`}>
      {/* Dark / Light Mode */}
      <View className="mb-3 flex-row items-center justify-between rounded-xl bg-white p-4 shadow dark:bg-gray-800">
        <View className="flex-row items-center">
          <Ionicons name="moon-outline" size={24} className={`mr-3 text-blue-500`} />
          <Text className={`${textColor} text-base font-semibold`}>Dark Mode</Text>
        </View>
        <Switch
          value={isDarkMode}
          onValueChange={setIsDarkMode}
          trackColor={{ false: '#ccc', true: '#4B5563' }}
          thumbColor={isDarkMode ? '#fff' : '#f4f3f4'}
        />
      </View>

      {/* Language */}
      <TouchableOpacity
        className="mb-3 flex-row items-center justify-between rounded-xl bg-white p-4 shadow dark:bg-gray-800"
        onPress={() => setLangModalOpen(true)}
      >
        <View className="flex-row items-center">
          <Ionicons name="language-outline" size={24} className="mr-3 text-blue-500" />
          <Text className={`${textColor} text-base font-semibold`}>Language</Text>
        </View>
        <View className="flex-row items-center space-x-1">
          <Text className={`${textColor} font-semibold`}>
            {languages.find((l) => l.value === language)?.label}
          </Text>
          <Ionicons name="chevron-down" size={20} className={`${textColor}`} />
        </View>
      </TouchableOpacity>

      {/* Notifications */}
      <TouchableOpacity
        className="mb-3 flex-row items-center justify-between rounded-xl bg-white p-4 shadow dark:bg-gray-800"
        onPress={() => {
          setTempNotifType(selectedNotifType);
          setNotifModalOpen(true);
        }}
      >
        <View className="flex-row items-center">
          <Ionicons name="notifications-outline" size={24} className="mr-3 text-blue-500" />
          <Text className={`${textColor} text-base font-semibold`}>Notifications</Text>
        </View>
        <View className="flex-row items-center space-x-1">
          <Text className={`${textColor} font-semibold`}>{selectedNotifType}</Text>
          <Ionicons name="chevron-down" size={20} className={`${textColor}`} />
        </View>
      </TouchableOpacity>

      {/* Language Modal */}
      <Modal visible={langModalOpen} animationType="slide" transparent>
        <View className="flex-1 justify-end bg-black/30">
          <View className="max-h-1/2 rounded-t-2xl bg-white p-4 dark:bg-gray-900">
            <Text className="mb-4 text-lg font-bold text-black dark:text-white">
              Select Language
            </Text>
            <ScrollView>
              {languages.map((lang) => (
                <TouchableOpacity
                  key={lang.value}
                  className={`mb-2 rounded-lg px-4 py-3 ${
                    language === lang.value ? 'bg-blue-600' : 'bg-gray-100 dark:bg-gray-800'
                  }`}
                  onPress={() => setLanguage(lang.value as 'en' | 'vi')}
                >
                  <Text
                    className={`${
                      language === lang.value
                        ? 'font-bold text-white'
                        : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    {lang.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View className="mt-4 flex-row justify-between">
              <TouchableOpacity
                className="mr-2 flex-1 items-center rounded-lg bg-gray-200 px-4 py-3 dark:bg-gray-700"
                onPress={() => setLangModalOpen(false)}
              >
                <Text className="font-medium text-gray-700 dark:text-gray-200">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="ml-2 flex-1 items-center rounded-lg bg-blue-600 px-4 py-3"
                onPress={() => setLangModalOpen(false)}
              >
                <Text className="font-medium text-white">Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Notification Modal */}
      <Modal visible={notifModalOpen} animationType="slide" transparent>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
          showsVerticalScrollIndicator={false}
        >
          <View className="rounded-t-2xl bg-white p-4 dark:bg-gray-900">
            <Text className="mb-4 text-lg font-bold text-black dark:text-white">
              Select Notification Type
            </Text>
            {notificationTypes.map((type) => (
              <TouchableOpacity
                key={type}
                className={`mb-3 flex-row items-start justify-between rounded-xl bg-white p-4 shadow dark:bg-gray-800`}
                onPress={() => setTempNotifType(type)}
              >
                <View className="flex-1 flex-row items-start">
                  <Ionicons
                    name="notifications-outline"
                    size={24}
                    className="mr-3 mt-1 text-blue-500"
                  />
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-black dark:text-white">
                      {type}
                    </Text>
                    <Text className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Enable or disable {type.toLowerCase()} notifications
                    </Text>
                  </View>
                </View>
                {tempNotifType === type && (
                  <Ionicons name="checkmark-circle" size={20} className="mt-1 text-blue-600" />
                )}
              </TouchableOpacity>
            ))}

            <View className="mt-4 flex-row justify-between">
              <TouchableOpacity
                className="mr-2 flex-1 items-center rounded-lg bg-gray-200 px-4 py-3 dark:bg-gray-700"
                onPress={() => {
                  setTempNotifType(selectedNotifType);
                  setNotifModalOpen(false);
                }}
              >
                <Text className="font-medium text-gray-700 dark:text-gray-200">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="ml-2 flex-1 items-center rounded-lg bg-blue-600 px-4 py-3"
                onPress={() => {
                  setSelectedNotifType(tempNotifType);
                  handleToggleNotification(notifications, tempNotifType);
                  setNotifModalOpen(false);
                }}
              >
                <Text className="font-medium text-white">Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
};

export default Setting;
