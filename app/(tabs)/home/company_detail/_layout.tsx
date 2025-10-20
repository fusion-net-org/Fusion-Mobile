import CompanyDetailHeaderNavbar from '@/components/company-detail-layout/company-detail-header-navbar';
import AlertHeader from '@/components/layouts/alert-header';
import { clearSelectedCompany } from '@/src/redux/compnaySlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Slot, useFocusEffect, useLocalSearchParams, usePathname } from 'expo-router';
import { useCallback } from 'react';
import { StatusBar, View } from 'react-native';
import { useDispatch } from 'react-redux';

export default function CompanyDetailLayout() {
  const { id } = useLocalSearchParams();
  const pathname = usePathname();
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      return () => {
        // Khi rời group company_detail
        if (!pathname.includes('company_detail')) {
          dispatch(clearSelectedCompany()); // 👉 reset Redux NGAY
          AsyncStorage.removeItem('selectedCompany'); // xoá nền sau
        }
      };
    }, [pathname]),
  );

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <AlertHeader />
      {id && <CompanyDetailHeaderNavbar id={id as string} />}
      <View style={{ flex: 1 }}>
        <Slot />
      </View>
    </>
  );
}
