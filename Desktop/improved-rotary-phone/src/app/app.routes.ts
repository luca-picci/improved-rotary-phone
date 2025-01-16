import { Routes } from '@angular/router';
import { SigninComponent } from './components/signin/signin.component';
import { EventComponent } from './components/event/event.component';


export const routes: Routes = [
    { path: 'login', component: SigninComponent },
    { path: 'events', component: EventComponent },
    { path: '**', redirectTo: '/login' } // Rotta wildcard
];
