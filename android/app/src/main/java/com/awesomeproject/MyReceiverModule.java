package com.awesomeproject;

import android.annotation.SuppressLint;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.widget.Toast;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;


//  手动注册接收器
public class MyReceiverModule extends ReactContextBaseJavaModule implements LifecycleEventListener {
  private final ReactApplicationContext mContext;

  private final BroadcastReceiver myBroadcastReceiver = new BroadcastReceiver() {
    @Override
    public void onReceive(Context context, Intent intent) {
      String action = intent.getAction();
      Toast.makeText(mContext, "action: " + action, Toast.LENGTH_SHORT).show();
    }
  };

  public MyReceiverModule(ReactApplicationContext reactContext) {
    super(reactContext);
    mContext = reactContext;
    registerBroadcastReceiver();
  }

  @SuppressLint("UnspecifiedRegisterReceiverFlag")
  @ReactMethod
  private void registerBroadcastReceiver() {
    IntentFilter filter = new IntentFilter();
    filter.addAction(Intent.ACTION_AIRPLANE_MODE_CHANGED);
    mContext.registerReceiver(myBroadcastReceiver, filter);
  }

  @NonNull
  @Override
  public String getName() {
    return "MyReceiverModule";
  }

  @Override
  public void onHostResume() {

  }

  @Override
  public void onHostPause() {

  }

  @Override
  public void onHostDestroy() {
    mContext.unregisterReceiver(myBroadcastReceiver);
  }
}
