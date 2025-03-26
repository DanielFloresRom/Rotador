import { Injectable } from '@angular/core';
import { Motion } from '@capacitor/motion';
import { PluginListenerHandle } from '@capacitor/core';
import { MotionData } from '../Model/MotionData.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MotionService {
  private accelListener?: PluginListenerHandle;
  private gyroListener?: PluginListenerHandle;

  // Nuevo BehaviorSubject para manejar el conteo de pasos
  private stepCountSubject = new BehaviorSubject<number>(0);
  stepCount$ = this.stepCountSubject.asObservable();

  // Variables para detección de pasos
  private lastPeakTime = 0;
  private lastValleyTime = 0;
  private peakAcceleration = 0;
  private valleyAcceleration = 0;
  private stepThreshold = 10; // Umbral de aceleración para considerar un paso
  private minStepInterval = 250; // Intervalo mínimo entre pasos (ms)

  constructor() { }

  async startMotionDetection(callback: (data: MotionData) => void) {
    const motionData: MotionData = {};

    this.accelListener = await Motion.addListener('accel', (event) => {
      motionData.acceleration = event.acceleration;
      
      // Lógica de detección de pasos
      this.detectSteps(event.acceleration);
      
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

  private detectSteps(acceleration: { x: number, y: number, z: number }) {
    // Calcular la magnitud de la aceleración
    const magnitude = Math.sqrt(
      acceleration.x * acceleration.x + 
      acceleration.y * acceleration.y + 
      acceleration.z * acceleration.z
    );

    const currentTime = Date.now();

    // Detección de picos y valles
    if (magnitude > this.peakAcceleration) {
      this.peakAcceleration = magnitude;
      this.lastPeakTime = currentTime;
    }

    if (magnitude < this.valleyAcceleration) {
      this.valleyAcceleration = magnitude;
      this.lastValleyTime = currentTime;
    }

    // Verificar si se ha detectado un paso
    if (
      this.peakAcceleration - this.valleyAcceleration > this.stepThreshold &&
      currentTime - this.lastPeakTime > this.minStepInterval
    ) {
      // Incrementar contador de pasos
      const currentStepCount = this.stepCountSubject.value + 1;
      this.stepCountSubject.next(currentStepCount);

      // Resetear valores
      this.peakAcceleration = 0;
      this.valleyAcceleration = magnitude;
    }
  }

  async stopMotionDetection() {
    if (this.accelListener) {
      await this.accelListener.remove();
    }
    if (this.gyroListener) {
      await this.gyroListener.remove();
    }
  }

  // Método para reiniciar el contador de pasos
  resetStepCount() {
    this.stepCountSubject.next(0);
  }
}