import * as Notifications from 'expo-notifications';

export async function registerForPushNotificationsAsync() {
    let token;

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;

    return token;
}

export const generateNotification = async (title: string, body: string) => {
    //show the notification to the user
    Notifications.scheduleNotificationAsync({
      //set the content of the notification
      content: {
        title: title,
        body: body,
      },
      trigger: null,
    });
  };