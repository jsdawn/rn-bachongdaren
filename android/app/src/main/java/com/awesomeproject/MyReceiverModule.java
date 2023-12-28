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

public class MyReceiverModule extends ReactContextBaseJavaModule implements LifecycleEventListener {
  private final ReactApplicationContext mContext;

  private final BroadcastReceiver myBroadcastReceiver = new BroadcastReceiver() {
    @Override
    public void onReceive(Context context, Intent intent) {
      String action = intent.getAction();

      Toast.makeText(mContext, "action: " + action, Toast.LENGTH_SHORT).show();

      if (action.equals("android.media.VOLUME_CHANGED_ACTION")) {
        int valume = intent.getIntExtra("android.media.VOLUME_CHANGED_ACTION", 0);
        Toast.makeText(mContext, "Volume changed: " + valume, Toast.LENGTH_SHORT).show();
      }

//      if (action.equals(Intent.ACTION_HEADSET_PLUG)) {
//        boolean plugged = (intent.getIntExtra("state", 0) == 1);
//        String message = plugged ? "Headset plugged in" : "Headset plugged out";
//        Toast.makeText(mContext, message, Toast.LENGTH_SHORT).show();
//      }
    }
  };

  public MyReceiverModule(ReactApplicationContext reactContext) {
    super(reactContext);
    mContext = reactContext;
//    registerBroadcastReceiver();
  }

  @SuppressLint("UnspecifiedRegisterReceiverFlag")
  @ReactMethod
  private void registerBroadcastReceiver() {
    IntentFilter filter = new IntentFilter();
    filter.addAction(Intent.ACTION_MEDIA_BUTTON);
    filter.addAction(Intent.ACTION_HEADSET_PLUG);
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
