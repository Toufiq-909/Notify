  self.addEventListener('push', event => {
    const data = event.data.json();
    console.log("Push received:", data.notification.title);
    self.registration.showNotification(data.notification.title,data.notification);
  });
