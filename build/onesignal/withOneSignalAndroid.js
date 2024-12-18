"use strict";
/**
 * Expo config plugin for OneSignal (Android)
 * @see https://documentation.onesignal.com/docs/react-native-sdk-setup#step-4-install-for-ios-using-cocoapods-for-ios-apps
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.withOneSignalAndroid = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const image_utils_1 = require("@expo/image-utils");
const OneSignalLog_1 = require("../support/OneSignalLog");
const path_1 = require("path");
const fs_1 = require("fs");
const RESOURCE_ROOT_PATH = 'android/app/src/main/res/';
// The name of each small icon folder resource, and the icon size for that folder.
const SMALL_ICON_DIRS_TO_SIZE = {
    'drawable-mdpi': 24,
    'drawable-hdpi': 36,
    'drawable-xhdpi': 48,
    'drawable-xxhdpi': 72,
    'drawable-xxxhdpi': 96
};
// The name of each large icon folder resource, and the icon size for that folder.
const LARGE_ICON_DIRS_TO_SIZE = {
    'drawable-xxxhdpi': 256
};
const withSmallIcons = (config, onesignalProps) => {
    var _a;
    if (!onesignalProps.smallIcons && !((_a = config.notification) === null || _a === void 0 ? void 0 : _a.icon)) {
        return config;
    }
    // we are modifying the android build (adding files) without a base mod
    return (0, config_plugins_1.withDangerousMod)(config, [
        'android',
        async (config) => {
            var _a;
            if ((_a = config.notification) === null || _a === void 0 ? void 0 : _a.icon) {
                await saveIconAsync(config.notification.icon, config.modRequest.projectRoot, SMALL_ICON_DIRS_TO_SIZE);
            }
            if (onesignalProps.smallIcons) {
                await saveIconsArrayAsync(config.modRequest.projectRoot, onesignalProps.smallIcons, SMALL_ICON_DIRS_TO_SIZE);
            }
            return config;
        },
    ]);
};
const withLargeIcons = (config, onesignalProps) => {
    if (!onesignalProps.largeIcons) {
        return config;
    }
    // we are modifying the android build (adding files) without a base mod
    return (0, config_plugins_1.withDangerousMod)(config, [
        'android',
        async (config) => {
            if (onesignalProps.largeIcons) {
                await saveIconsArrayAsync(config.modRequest.projectRoot, onesignalProps.largeIcons, LARGE_ICON_DIRS_TO_SIZE);
            }
            return config;
        },
    ]);
};
const withSmallIconAccentColor = (config, onesignalProps) => {
    if (!onesignalProps.smallIconAccentColor) {
        return config;
    }
    return (0, config_plugins_1.withStringsXml)(config, (config) => {
        var _a, _b;
        const colorInARGB = `FF${(_a = onesignalProps.smallIconAccentColor) === null || _a === void 0 ? void 0 : _a.replace('#', '')}`;
        const strings = (_b = config.modResults.resources.string) !== null && _b !== void 0 ? _b : [];
        // Check if the accent color entry already exists
        const hasAccentColor = strings.some((stringEntry) => {
            var _a;
            return ((_a = stringEntry.$) === null || _a === void 0 ? void 0 : _a.name) === 'notification_accent_color' &&
                stringEntry._ === colorInARGB;
        });
        if (!hasAccentColor) {
            const accentColorEntry = {
                $: { name: 'notification_accent_color' },
                _: colorInARGB,
            };
            config.modResults.resources.string = [...strings, accentColorEntry];
        }
        return config;
    });
};
async function saveIconsArrayAsync(projectRoot, icons, dirsToSize) {
    for (const icon of icons) {
        await saveIconAsync(icon, projectRoot, dirsToSize);
    }
}
async function saveIconAsync(icon, projectRoot, dirsToSize) {
    const name = (0, path_1.parse)(icon).name;
    OneSignalLog_1.OneSignalLog.log("Saving icon " + icon + " as drawable resource " + name);
    for (const iconResourceDir in dirsToSize) {
        const path = (0, path_1.resolve)(projectRoot, RESOURCE_ROOT_PATH, iconResourceDir);
        if (!(0, fs_1.existsSync)(path)) {
            (0, fs_1.mkdirSync)(path, { recursive: true });
        }
        const resizedIcon = (await (0, image_utils_1.generateImageAsync)({ projectRoot, cacheType: 'onesignal-icon' }, {
            src: icon,
            width: dirsToSize[iconResourceDir],
            height: dirsToSize[iconResourceDir],
            resizeMode: 'cover',
            backgroundColor: 'transparent',
        })).source;
        (0, fs_1.writeFileSync)((0, path_1.resolve)(path, name + '.png'), resizedIcon);
    }
}
const withOneSignalAndroid = (config, props) => {
    config = withSmallIcons(config, props);
    config = withLargeIcons(config, props);
    config = withSmallIconAccentColor(config, props);
    return config;
};
exports.withOneSignalAndroid = withOneSignalAndroid;
