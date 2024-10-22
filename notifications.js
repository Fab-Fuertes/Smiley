function Notifications() {
    useEffect(() => {
      const unsubscribe = messaging().onMessage(async remoteMessage => {
        console.log('A new FCM message arrived!', remoteMessage);
      });
  
      return unsubscribe;
    }, []);
  }

