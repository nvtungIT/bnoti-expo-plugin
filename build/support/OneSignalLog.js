"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OneSignalLog = void 0;
class OneSignalLog {
    static log(str) {
        console.log(`\tbnoti-expo-plugin: ${str}`);
    }
    static error(str) {
        console.error(`\tbnoti-expo-plugin: ${str}`);
    }
}
exports.OneSignalLog = OneSignalLog;
