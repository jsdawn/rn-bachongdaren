package com.awesomeproject;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.widget.Toast;

public class StartAppOnBoot extends BroadcastReceiver {
  @Override
  public void onReceive(Context context, Intent intent) {
    String action = intent.getAction();
    Toast.makeText(context, "StartAppOnBoot: " + action, Toast.LENGTH_SHORT).show();

    if (Intent.ACTION_BOOT_COMPLETED.equals(action)) {
      Intent i = new Intent(context, MainActivity.class);
      i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
      context.startActivity(i);
    }
  }
}
