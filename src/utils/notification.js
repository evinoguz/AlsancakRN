import PushNotification from 'react-native-push-notification';
import {Platform, PermissionsAndroid} from 'react-native';

export const configureNotifications = async () => {
  // Android 13+ izin
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    console.log('Notification permission:', granted);
  }

  // Bildirim callback
  PushNotification.configure({
    onNotification: function (notification) {
      console.log('Bildirim geldi:', notification);
    },
    requestPermissions: false,
  });

  // Kanal oluştur
  PushNotification.createChannel(
    {
      channelId: 'alsancak-tahsilat-channel', // Kanal ID
      channelName: 'Hatırlatmalar',
      channelDescription: ' Tahsilat hatırlatma bildirimleri için kanal',
      importance: 4,
      vibrate: true,
      playSound: true,
      soundName: 'default',
    },
    created => console.log(`Channel created: ${created}`),
  );
};

// Planlı tek bildirim
export const scheduleNotification = (title, message, date, uniqueId) => {
  console.log('Bildirim planlandı:', date, typeof date);

  PushNotification.localNotificationSchedule({
    channelId: 'alsancak-tahsilat-channel',
    title: title, // "Cari Ekstre Son Ödeme Tarihi"
    message: message, // "Ödeme vadesine 2 gün kaldı."
    date: date, // Bildirimin gösterileceği tarih ve saat
    allowWhileIdle: true, // Cihaz boşta olsa bile göster
    id: uniqueId, // Bildirim kimliği, benzersiz olmalı
  });
  console.log('Bildirim planlandı fonksiyonu tamamlandı');
};
