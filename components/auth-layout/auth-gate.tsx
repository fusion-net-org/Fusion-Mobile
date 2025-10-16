import { ROUTES } from '@/routes/route';
import { useRootNavigationState, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { initializeUserState } from '../../src/redux/store';
export default function AuthGate() {
  const router = useRouter();
  const navReady = useRootNavigationState()?.key != null;
  const [loading, setLoading] = useState(true);
  console.log('🔐 AuthGate mounted');

  useEffect(() => {
    if (!navReady) return;

    (async () => {
      try {
        const user = await initializeUserState();
        console.log('✅ AuthGate user:', user);

        if (user) {
          router.replace(ROUTES.HOME.COMPANY as any);
        } else {
          router.replace(ROUTES.AUTH.MAIN as any);
        }
      } catch (error) {
        console.error('❌ AuthGate error:', error);
        router.replace(ROUTES.AUTH.MAIN as any);
      } finally {
        setLoading(false);
      }
    })();
  }, [navReady]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return null;
}
