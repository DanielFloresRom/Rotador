import { Component, OnInit, OnDestroy } from '@angular/core';
import { MotionService } from './Services/motion.service';
import { MotionData } from './Model/MotionData.model';
import { Subject, interval } from 'rxjs';
import { takeUntil, throttleTime } from 'rxjs/operators';

@Component({
  selector: 'app-motion',
  templateUrl: './motion.component.html',
  styleUrl: './motion.component.scss'
})
export class MotionComponent implements OnInit, OnDestroy {
  
  motionData: MotionData = {};
  
  // Subject para manejar la destrucción del componente
  private destroy$ = new Subject<void>();

  constructor(private motionS: MotionService) {}

  ngOnInit(): void {
    // Usar interval con throttleTime para crear un delay entre actualizaciones
    interval(2000) // Intervalo de 2 segundos
      .pipe(
        takeUntil(this.destroy$), // Detener cuando el componente se destruya
        throttleTime(2000) // Asegurar que solo se emita un valor cada 2 segundos
      )
      .subscribe(() => {
        this.motionS.startMotionDetection((data: MotionData) => {
          this.motionData = data;
          console.log('Motion Data:', this.motionData);
        });
      });
  }

  ngOnDestroy(): void {
    // Emitir señal para detener todas las suscripciones
    this.destroy$.next();
    this.destroy$.complete();

    // Detener la detección de movimiento
    this.motionS.stopMotionDetection();
  }
}