import { Injectable } from '@angular/core';
import { Motion } from '@capacitor/motion';
import { PluginListenerHandle } from '@capacitor/core';
import { MotionData } from '../Model/MotionData.model';



@Injectable({
  providedIn: 'root'
})
export class MotionService {
  private accelListener?: PluginListenerHandle;
  private gyroListener?: PluginListenerHandle;

  constructor() { }

  async startMotionDetection(callback: (data: MotionData) => void) {
    const motionData: MotionData = {};

    this.accelListener = await Motion.addListener('accel', (event) => {
      motionData.acceleration = event.acceleration;
      callback(motionData);
    });

    this.gyroListener = await Motion.addListener('orientation', (event) => {
      motionData.rotation = {
        alpha: event.alpha,
        beta: event.beta,
        gamma: event.gamma
      };
      callback(motionData);
    });
  }

  async stopMotionDetection() {
    if (this.accelListener) {
      await this.accelListener.remove();
    }
    if (this.gyroListener) {
      await this.gyroListener.remove();
    }
  }
}
