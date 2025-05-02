import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { MainContentComponent } from "./components/main-content/main-content.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ SidebarComponent, MainContentComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'tsc';
}
