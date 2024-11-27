import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './screens/home/home.component';
import { ErrorScreenComponent } from './screens/error-screen/error-screen.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: '**', component: ErrorScreenComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
