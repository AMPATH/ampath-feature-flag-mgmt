import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Login } from '../login/login';
import { NavBar } from '../navbar/navbar';

@Component({
  imports: [RouterModule, Login, NavBar],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'front-end';
}
