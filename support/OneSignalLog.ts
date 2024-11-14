export class OneSignalLog {
  static log(str: string) {
    console.log(`\tbnoti-expo-plugin: ${str}`);
  }

  static error(str: string) {
    console.error(`\tbnoti-expo-plugin: ${str}`);
  }
}
