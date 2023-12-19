package com.awesomeproject;

import static androidx.core.content.ContextCompat.startActivity;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.icu.text.SimpleDateFormat;
import android.net.Uri;
import android.os.Build;
import android.provider.CallLog;
import android.telecom.TelecomManager;
import android.telephony.PhoneStateListener;
import android.telephony.TelephonyCallback;
import android.telephony.TelephonyManager;

import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.Date;

public class AutoAnswerModule extends ReactContextBaseJavaModule {
  private static final String TAG = "AutoAnswerModule";
  private final TelecomManager telecomManager;
  private MyCallStateListener myCallStateListener;
  private MyPhoneStateListener myPhoneStateListener;
  private boolean isCalling = false;
  private long startTime;
  private long endTime;

  public AutoAnswerModule(ReactApplicationContext reactContext) {
    super(reactContext);
    telecomManager = (TelecomManager) reactContext.getSystemService(Context.TELECOM_SERVICE);
  }

  @Override
  public String getName() {
    return "AutoAnswerModule";
  }

  // 发送事件通知
  private void sendEvent(ReactApplicationContext reactContext, String eventName, @Nullable WritableMap params) {
    reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, params);
  }

  @SuppressLint("SimpleDateFormat")
  private String formatTime(long dateTime) {
    if (dateTime == 0) {
      return "";
    }
    Date date = new Date(dateTime);
    SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    return simpleDateFormat.format(date);
  }

  @ReactMethod
  public void addListener(String eventName) {
    // Set up any upstream listeners or background tasks as necessary
  }

  @ReactMethod
  public void removeListeners(Integer count) {
    // Remove upstream listeners, stop unnecessary background tasks
  }

  @SuppressLint("MissingPermission")
  @ReactMethod
  public void answerPhoneCall() {
    if (telecomManager != null) {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        telecomManager.acceptRingingCall();
      }
    }
  }

  @SuppressLint("MissingPermission")
  @ReactMethod
  public void endPhoneCalling() {
    if (telecomManager != null) {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
        telecomManager.endCall();
      }
    }
  }

  @SuppressLint("MissingPermission")
  @ReactMethod
  public void callPhone(String phoneNumber) {
    Intent callIntent = new Intent(Intent.ACTION_CALL);
    callIntent.setData(Uri.parse("tel:" + phoneNumber));
    callIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    startActivity(getReactApplicationContext(), callIntent, null);
//    Toast.makeText(getReactApplicationContext(), "callIntent：" + phoneNumber, Toast.LENGTH_SHORT).show();

    registerPhoneStateListener();
  }

  //注册监听
  @ReactMethod
  public void registerPhoneStateListener() {
    TelephonyManager telephonyManager = (TelephonyManager) getReactApplicationContext().getSystemService(Context.TELEPHONY_SERVICE);
    if (telephonyManager != null) {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
        // api 31
        myCallStateListener = new MyCallStateListener();
        telephonyManager.registerTelephonyCallback(getReactApplicationContext().getMainExecutor(), myCallStateListener);
      } else {
        myPhoneStateListener = new MyPhoneStateListener();
        telephonyManager.listen(myPhoneStateListener, PhoneStateListener.LISTEN_CALL_STATE);
      }
    }
  }

  private void stateChangeHandler(int state) {
    switch (state) {
      case TelephonyManager.CALL_STATE_RINGING:
        // state=1, 响铃中
        if (!isCalling) {
          startTime = 0;
          endTime = 0;
        }
        // Toast.makeText(getReactApplicationContext(), "响铃中", Toast.LENGTH_SHORT).show();
        break;
      case TelephonyManager.CALL_STATE_IDLE:
        // state=0, 无活动
        if (isCalling) {
          // calling to hang up
          endTime = System.currentTimeMillis();
          isCalling = false;
        }
        // Toast.makeText(getReactApplicationContext(), "无活动", Toast.LENGTH_SHORT).show();
        break;
      case TelephonyManager.CALL_STATE_OFFHOOK:
        // state=2, 拨号中，处于活动状态
        if (!isCalling) {
          // calling
          startTime = System.currentTimeMillis();
          endTime = 0;
          isCalling = true;
        }
        // Toast.makeText(getReactApplicationContext(), "正在拨号，处于活动状态", Toast.LENGTH_SHORT).show();
        break;
    }
    WritableMap params = Arguments.createMap();
    params.putInt("state", state);
    params.putBoolean("isCalling", isCalling);
    params.putString("startTime", formatTime(startTime));
    params.putString("endTime", formatTime(endTime));
    sendEvent(getReactApplicationContext(), "callStateChanged", params);
  }

  // api version 31 handler
  @RequiresApi(api = Build.VERSION_CODES.S)
  private class MyCallStateListener extends TelephonyCallback implements TelephonyCallback.CallStateListener {
    @Override
    public void onCallStateChanged(int state) {
      stateChangeHandler(state);
    }
  }

  private class MyPhoneStateListener extends PhoneStateListener {
    @Override
    public void onCallStateChanged(int state, String phoneNumber) {
      super.onCallStateChanged(state, phoneNumber);
      stateChangeHandler(state);
    }
  }


  @ReactMethod
  public void getLastCall(Promise promise) {
    String phNumber = "";
    String callDuration = "";
    String startDate = "";
    Cursor cur = getReactApplicationContext().getContentResolver().query(CallLog.Calls.CONTENT_URI, null,
            null, null, android.provider.CallLog.Calls.DATE + " DESC");

    int number = cur.getColumnIndex(CallLog.Calls.NUMBER);
    int duration = cur.getColumnIndex(CallLog.Calls.DURATION);
    int date = cur.getColumnIndex(CallLog.Calls.DATE);
    while (cur.moveToNext()) {
      phNumber = cur.getString(number);
      callDuration = cur.getString(duration);
      startDate = cur.getString(date);
      break;
    }
    cur.close();
//    Toast.makeText(getReactApplicationContext(), phNumber + ": " + callDuration, Toast.LENGTH_SHORT).show();
    WritableMap params = Arguments.createMap();
    params.putString("phNumber", phNumber);
    params.putString("callDuration", callDuration);
    params.putString("startDate", startDate);
    promise.resolve(params);
  }


  //取消注册监听
  @ReactMethod
  public void unregisterPhoneStateListener() {
    TelephonyManager telephonyManager = (TelephonyManager) getReactApplicationContext().getSystemService(Context.TELEPHONY_SERVICE);

    if (telephonyManager != null) {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S && myCallStateListener != null) {
        // api 31
        telephonyManager.unregisterTelephonyCallback(myCallStateListener);
      } else if (myPhoneStateListener != null) {
        telephonyManager.listen(myPhoneStateListener, PhoneStateListener.LISTEN_NONE);
      }
    }
  }

}