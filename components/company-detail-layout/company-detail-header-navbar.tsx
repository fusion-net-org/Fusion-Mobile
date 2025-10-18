import { COMPANYTABS } from '@/constants/navigate/tabs';
import { usePathname, useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const CompanyDetailHeaderNavbar = ({ id }: { id: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const segments = pathname.split('/');
  const currentTab = segments[3] || 'detail';

  return (
    <View className="border-b border-gray-200 bg-white">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      >
        {COMPANYTABS.map((tab, index) => {
          const targetPath = `/home/company_detail/${tab.key}/${id}`;

          const isActive = tab.key === currentTab;

          console.log(targetPath);

          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                if (!isActive) {
                  router.replace(targetPath as any);
                }
              }}
              activeOpacity={0.7}
              className="mr-6 items-center pb-2"
            >
              <Text
                className={`text-base font-medium ${isActive ? 'text-blue-600' : 'text-gray-600'}`}
              >
                {tab.title}
              </Text>
              {isActive && <View className="mt-1 h-[2px] w-6 rounded-full bg-blue-600" />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default CompanyDetailHeaderNavbar;
