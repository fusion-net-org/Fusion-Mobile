import * as FileSystem from 'expo-file-system/legacy';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Linking from 'expo-linking';

import { Alert, Platform } from 'react-native';

export const downloadAndOpenFile = async (fileUrl: string, fileName: string) => {
  try {
    if (!fileUrl) return Alert.alert('Error', 'File URL is empty');

    const localUri = FileSystem.cacheDirectory + fileName;
    const { uri } = await FileSystem.downloadAsync(fileUrl, localUri);

    if (Platform.OS === 'ios') {
      await Linking.openURL(uri);
    } else if (Platform.OS === 'android') {
      const permissions =
        await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (!permissions.granted) {
        return Alert.alert('Permission denied', 'Cannot save file without permission');
      }

      const mimeType = getMimeType(fileName);

      const destUri = await FileSystem.StorageAccessFramework.createFileAsync(
        permissions.directoryUri,
        fileName,
        mimeType,
      );

      // Đọc file vừa download dưới dạng Base64
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Ghi vào file SAF
      await FileSystem.writeAsStringAsync(destUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Mở file
      await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
        data: destUri,
        flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
        type: mimeType,
      });
    }
  } catch (error) {
    console.error(error);
    Alert.alert('Error', 'Failed to download or open file');
  }
};

// Helper lấy mime type từ file extension
const getMimeType = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'pdf':
      return 'application/pdf';
    case 'png':
      return 'image/png';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'doc':
    case 'docx':
      return 'application/msword';
    case 'xls':
    case 'xlsx':
      return 'application/vnd.ms-excel';
    default:
      return 'application/octet-stream';
  }
};
