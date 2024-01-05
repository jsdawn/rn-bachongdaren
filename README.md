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

## 本地启动

```sh
# 查看本地连接的设备
adb devices

# 安卓启动
yarn android
```

## 安卓打包 apk

```sh
cd android
./gradlew assembleRelease

# 清楚安卓缓存
cd android
./gradlew clean
```

### 修改 app 图标和名称

- 替换 `android/app/src/main/res/mipmap-hdpi/ic_launcher.png` 图标

- 修改 `android/app/src/main/AndroidManifest.xml` android:label

  ```xml
  <activity android:label="应用名称">
    <!-- ... -->
  </activity>
  ```

### 针对不同的 CPU 架构生成 APK 以减小 APK 文件的大小

```diff
# android/app/build.gradle 中修改如下代码（false 改为 true）来生成多个针对不同 CPU 架构的 APK
# armeabi包可以跑在 armeabi,x86,x86_64,armeabi-v7a,arm64-v8上
# armeabi-v7a 包可以跑在 armeabi-v7a和arm64-v8a
# arm64-v8a 包可以跑在 arm64-v8a上
# 模拟器大部分是 x86 架构，安卓设备绝大多数是 ARM 架构（armeabi-v7a）
- ndk {
-   abiFilters "armeabi-v7a", "x86"
- }
- def enableSeparateBuildPerCPUArchitecture = false
+ def enableSeparateBuildPerCPUArchitecture = true
```

### 启用 Proguard 来减少 apk 的大小（可选）

```java
// android/app/build.gradle 文件中修改

def enableProguardInReleaseBuilds = true
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

## 安卓启动页 react-native-splash-screen

```java
// android/app/src/main/java/com/<your package name>/MainActivity.java

import android.os.Bundle;
import org.devio.rn.splashscreen.SplashScreen;
  // ...
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    SplashScreen.show(this);  // here，当app启动时显示启动页
    super.onCreate(savedInstanceState);
  }
```

添加图片到 `android/app/src/main/res/drawable-hdpi`;
新建启动页 ui `android/app/src/main/res/layout/launch_screen.xml`

```xml
<!-- android/app/src/main/res/layout/launch_screen.xml -->

<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
  android:layout_width="match_parent"
  android:layout_height="match_parent"
  android:background="@drawable/launch_screen"
  android:orientation="vertical">
</LinearLayout>
```

添加 colors 定义和透明度

```xml
<!-- android/app/src/main/res/values/colors.xml -->
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="primary_dark">#000000</color>
</resources>

<!-- android/app/src/main/res/values/styles.xml -->
<item name="android:windowIsTranslucent">true</item>
```

在首页展示时关闭启动页 `App.js`

```js
import SplashScreen from 'react-native-splash-screen';
// ...
useEffect(() => {
  SplashScreen.hide(); // hide splash screen
}, []);
```

## 安卓打包各类问题

- 打包资源合并失败 `Task :app:mergeReleaseResources FAILED`
  A：很大可能是不同类型的文件重名了，关闭文件合法性检查
  ```java
  // android/app/build.gradle
  // 关闭PNG等文件合法性检查
  android {
    aaptOptions.cruncherEnabled = false
    aaptOptions.useNewCruncher = false
    ...
  }
  ```

## 安卓版本

```xml
<manifest
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="appname"
    <!-- 用于版本升级,值为int类型,用于判断app是否须要升级,每次可递增设置 -->
    android:versionCode="1"
    <!-- 版本号名称,用于显示给用户看到的app版本号 -->
    android:versionName="1.0.0">
 </manifest>
```
