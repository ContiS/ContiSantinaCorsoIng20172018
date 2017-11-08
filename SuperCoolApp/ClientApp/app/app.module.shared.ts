import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './components/app/app.component';
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { HomeComponent } from './components/home/home.component';
import { StudentsComponent } from './components/students/students.component';
import { TeachersComponent } from './components/teachers/teachers.component';
import { CoursesComponent } from './components/courses/courses.component';
import { TeachingsComponent } from './components/teachings/teachings.component';
import { TeachingsSearchComponent } from './components/teachingsSearch/teachingsSearch.component';

@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        HomeComponent,
        StudentsComponent,
        TeachersComponent,
        CoursesComponent,
		TeachingsComponent, 
		TeachingsSearchComponent
    ],
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: 'students', component: StudentsComponent },
            { path: 'teachers', component: TeachersComponent },
            { path: 'courses', component: CoursesComponent },
			{ path: 'teachings', component: TeachingsComponent },
			{ path: 'teachingsSearch', component: TeachingsSearchComponent },
            { path: '**', redirectTo: 'home' }
        ])
    ]
})
export class AppModuleShared {
}
