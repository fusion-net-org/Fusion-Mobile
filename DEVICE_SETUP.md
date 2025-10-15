# Device Registration Setup

## Đã implement

✅ **Hoàn thành**: API call để đăng ký device sau khi login

- Interface `RegisterUserDeviceRequest`
- Service `userDeviceService` với hàm `registerDevice` và `getDeviceInfo`
- **Redux Slice riêng**: `userDeviceSlice.ts` để quản lý state device registration
- Tích hợp vào login flow để gọi sau khi lưu user data vào Redux

## Cách hoạt động hiện tại

1. User login → API `/Authen/login`
2. Nếu login thành công → lưu user data vào Redux
3. Sau khi lưu user data → gọi `registerUserDevice()` từ `userDeviceSlice`
4. Lấy real device info (push token, platform, device name)
5. Gọi API `/Device/Register` để đăng ký device với server
6. Nếu device registration thất bại, login vẫn thành công (không ảnh hưởng user experience)

## Redux State Management

### userDeviceSlice

- **State**: `isRegistering`, `isRegistered`, `error`, `lastRegisteredAt`
- **Actions**: `registerUserDevice`, `resetDeviceRegistration`, `clearDeviceError`
- **Async Thunk**: `registerUserDevice()` để gọi API registration

## Để có push notifications thật

Nếu bạn muốn sử dụng push notifications thật, cần cài đặt thêm:

```bash
npx expo install expo-device expo-notifications
```

Sau đó cập nhật hàm `getDeviceInfo()` trong `src/services/userDeviceService.ts`:

```typescript
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

export const getDeviceInfo = async (): Promise<RegisterUserDeviceRequest> => {
  try {
    // Get device token for push notifications
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      throw new Error('Failed to get push token for push notification!');
    }

    const deviceToken = (await Notifications.getExpoPushTokenAsync()).data;

    // Get platform info
    const platform = Device.osName || 'unknown';
    const deviceName = Device.deviceName || Device.modelName || 'Unknown Device';

    return {
      deviceToken,
      platform,
      deviceName
    };
  } catch (error) {
    console.error('Error getting device info:', error);
    throw error;
  }
};
```

## API Endpoint

API endpoint được gọi: `POST /Device/Register`

Request body:

```json
{
  "deviceToken": "string",
  "platform": "string",
  "deviceName": "string"
}
```

Response:

```json
{
  "statusCode": 200,
  "data": null,
  "message": "Device registered successfully"
}
```
