import { Component, OnInit, OnDestroy } from '@angular/core';
import { MotionService } from './Services/motion.service';
import { MotionData } from './Model/MotionData.model';

@Component({
  selector: 'app-motion',
  templateUrl: './motion.component.html',
  styleUrl: './motion.component.scss'
})
export class MotionComponent implements OnInit, OnDestroy {
  
  constructor(private motionS: MotionService) {}

  motionData: MotionData = {};

  ngOnInit(): void {
    this.motionS.startMotionDetection((data: MotionData) => {
      this.motionData = data;
      console.log('Motion Data:', this.motionData);
    });
  }

  ngOnDestroy(): void {
    this.motionS.stopMotionDetection();
  }
}