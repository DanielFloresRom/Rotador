import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MotionComponent } from './components/motion/motion.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports:[RouterOutlet]
})
export class AppComponent {
  title = 'angular-motion';
}
