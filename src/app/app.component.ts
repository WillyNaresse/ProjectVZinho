import { Component } from '@angular/core';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AngularFirestoreModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Project-Checklist';
}
