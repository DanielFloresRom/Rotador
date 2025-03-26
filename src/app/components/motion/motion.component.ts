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
  stepCount = 0;
  
  private destroy$ = new Subject<void>();

  constructor(private motionS: MotionService) {}

  ngOnInit(): void {
    // Suscribirse al conteo de pasos
    this.motionS.stepCount$
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => {
        this.stepCount = count;
      });

    interval(2000)
      .pipe(
        takeUntil(this.destroy$),
        throttleTime(2000)
      )
      .subscribe(() => {
        this.motionS.startMotionDetection((data: MotionData) => {
          this.motionData = data;
          console.log('Motion Data:', this.motionData);
        });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.motionS.stopMotionDetection();
  }

  // Método para reiniciar el contador de pasos
  resetStepCount() {
    this.motionS.resetStepCount();
  }

  // Método para calcular la rotación del nivel
  getNivelRotation(): string {
    const betaRotation = this.motionData.rotation?.beta || 0;
    const gammaRotation = this.motionData.rotation?.gamma || 0;

    const clampedBeta = Math.max(-45, Math.min(45, betaRotation));
    const clampedGamma = Math.max(-45, Math.min(45, gammaRotation));

    return `rotateX(${clampedBeta}deg) rotateY(${clampedGamma}deg)`;
  }
}