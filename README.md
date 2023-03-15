# React Native App

一个非常有趣的 RN 项目。

## 获取当前开发环境和设备信息

```sh
# 指令 npx react-native info
System:
    OS: macOS 13.2.1
    CPU: (4) x64 Intel(R) Core(TM) i5-7360U CPU @ 2.30GHz
    Memory: 21.81 MB / 8.00 GB
    Shell: 5.8.1 - /bin/zsh
  Binaries:
    Node: 14.21.3 - ~/nvm/versions/node/v14.21.3/bin/node
    Yarn: 1.22.19 - ~/nvm/versions/node/v14.21.3/bin/yarn
    npm: 6.14.18 - ~/nvm/versions/node/v14.21.3/bin/npm
    Watchman: 2023.02.27.00 - /usr/local/bin/watchman
  Managers:
    CocoaPods: 1.11.3 - /usr/local/bin/pod
  SDKs:
    iOS SDK: Not Found
    Android SDK: Not Found
  IDEs:
    Android Studio: 2022.1 AI-221.6008.13.2211.9619390
    Xcode: /undefined - /usr/bin/xcodebuild
  Languages:
    Java: 11.0.18 - /Library/Java/JavaVirtualMachines/zulu-11.jdk/Contents/Home/bin/javac
  npmPackages:
    @react-native-community/cli: Not Found
    react: 18.2.0 => 18.2.0
    react-native: 0.71.4 => 0.71.4
    react-native-macos: Not Found
  npmGlobalPackages:
    *react-native*: Not Found
```

## 使用路由 react-navigation

```sh
# install react-navigation
yarn add @react-navigation/native
# screens context
yarn add react-native-screens react-native-safe-area-context
# stack bottom-tabs
yarn add  @react-navigation/native-stack @react-navigation/bottom-tabs
```

```java
// android/app/src/main/java/<your package name>/MainActivity.java

import android.os.Bundle;
// ...
public class MainActivity extends ReactActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(null);
  }
}
```

## 使用图标 react-native-vector-icons

```java
// android/app/build.gradle 添加代码

project.ext.vectoricons = [
    iconFontNames: [ 'MaterialIcons.ttf', 'AntDesign.ttf' ] // Name of the font files you want to copy
]

apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
```

```js
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
// icon
<AntDesignIcons name="home" color="#000" size={18} />;
```
