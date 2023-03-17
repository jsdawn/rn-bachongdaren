package com.awesomeproject;

import android.content.Context;
import android.media.AudioManager;
import android.os.Build;
import android.telecom.TelecomManager;
import android.telephony.TelephonyManager;
import android.util.Log;
import androidx.annotation.RequiresApi;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class AutoAnswerModule extends ReactContextBaseJavaModule {
  private static final String TAG = "AutoAnswerModule";
  private ReactApplicationContext reactContext;

  public AutoAnswerModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "AutoAnswerModule";
  }

  @RequiresApi(api = Build.VERSION_CODES.O)
  @ReactMethod
  public void autoAnswer(int delayInSeconds) {
    Log.d(TAG, "autoAnswer: Auto answering call");
    TelecomManager telecomManager = (TelecomManager) reactContext.getSystemService(Context.TELECOM_SERVICE);
    if (telecomManager != null && telecomManager.isInCall()) {
      AudioManager audioManager = (AudioManager) reactContext.getSystemService(Context.AUDIO_SERVICE);
      if (audioManager != null) {
        audioManager.setMode(AudioManager.MODE_IN_CALL);
        audioManager.setSpeakerphoneOn(true);
      }
      try {
        Thread.sleep(delayInSeconds * 1000L);
        telecomManager.acceptRingingCall();
      } catch (InterruptedException e) {
        Log.e(TAG, "autoAnswer: Error sleeping thread", e);
      }
    }
  }
}
