import { Component, OnInit, OnDestroy } from '@angular/core';
import { MotionService } from './Services/motion.service';
import { MotionData } from './Model/MotionData.model';

@Component({
  selector: 'app-motion',
  templateUrl: './motion.component.html',
  styleUrl: './motion.component.scss'
})
export class MotionComponent implements OnInit, OnDestroy {
  
  motionData: MotionData = {};
  private updateInterval: any;
  private lastUpdateTime: number = 0;
  private readonly UPDATE_DELAY: number = 2000; // 2 segundos entre actualizaciones

  constructor(private motionS: MotionService) {}

  ngOnInit(): void {
    // Implementar un método de actualización con delay controlado
    this.startDelayedMotionDetection();
  }

  ngOnDestroy(): void {
    // Detener detección de movimiento
    this.motionS.stopMotionDetection();
    
    // Limpiar intervalo si existe
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  private startDelayedMotionDetection(): void {
    this.updateInterval = setInterval(() => {
      const currentTime = Date.now();
      
      // Verificar si ha pasado el tiempo de delay desde la última actualización
      if (currentTime - this.lastUpdateTime >= this.UPDATE_DELAY) {
        this.motionS.startMotionDetection((data: MotionData) => {
          this.motionData = data;
          console.log('Motion Data:', this.motionData);
        });
        
        // Actualizar el tiempo de última actualización
        this.lastUpdateTime = currentTime;
      }
    }, 500); // Verificar cada medio segundo
  }
}