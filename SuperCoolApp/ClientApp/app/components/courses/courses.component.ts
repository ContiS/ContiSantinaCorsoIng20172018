import { Component, Inject } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/forkJoin';

@Component({
    selector: 'courses',
    templateUrl: './courses.component.html',
    styleUrls: ['../students.component.css']
})
export class CoursesComponent {
    public courses: Course[];
    public selectedCourse: Course | undefined;

    constructor(private http: Http, @Inject('BASE_URL') private baseUrl: string) {
        this.refreshData();
    }

    async refreshData() {
        this.http.get(this.baseUrl + 'api/coursemanagement/courses').subscribe(result => {
            let courseList = [];

            for (let cours of result.json() as Course[]) {

                let course = new Course();
                course.id = cours.id;
                course.name = cours.name;                
                course.hasChanges = false;
                courseList.push(course);
            }

            console.log("ok");

            this.courses = courseList;

            this.selectCourse();
        }, error => console.error(error));
    }


    selectCourse(): void {

        this.selectedCourse = undefined;

        for (let cours of this.courses) {
            if (cours.deleted == false) {
                this.selectedCourse = cours;
                break;
            }

        }
    }


    async putData(): Promise<void> {
        let headers = new Headers({ 'Content-Type': 'application/json' });

        let serverCalls = [];

        for (let course of this.courses) {
            if (course.hasChanges == true || course.deleted) {

                let json = JSON.stringify(course.toJSON());

                if (!course.id) { //create
                    if (!course.deleted) {
                        let call = this.http.put(this.baseUrl + 'api/coursemanagement/courses', json, { headers: headers });
                        serverCalls.push(call);
                    }
                }
                else {
                    if (course.deleted) {
                        let url = this.baseUrl + 'api/coursemanagement/courses?id=' + course.id;
                        let call = this.http.delete(url, { headers: headers });
                        serverCalls.push(call);
                    }
                    else {
                        let call = this.http.post(this.baseUrl + 'api/coursemanagement/courses', json, { headers: headers });
                        serverCalls.push(call);
                    }

                }
            }
        }
        Observable.forkJoin(serverCalls)
            .subscribe(data => {
                this.refreshData();
            }, error => console.error(error));
    }

    onSelect(course: Course): void {

        if (course.deleted == false) {
            this.selectedCourse = course;
        }
    }

    addNewCourse(): void {
        this.selectedCourse = new Course();
        this.selectedCourse.hasChanges = true;
        this.courses.push(this.selectedCourse);
    }

    async saveChanges(): Promise<void> {
        await this.putData();
        //console.log("update completed");
        //await this.refreshData();
    }

    delete(course: Course): void {
        course.deleted = true;
        this.selectCourse();
    }
}

class Course {
    id: number;

    private _name: string = "";   
         
    public hasChanges: boolean;
    public deleted: boolean = false;

    get name(): string {
        return this._name;
    }
    set name(n: string) {
        this._name = n;
        this.hasChanges = true;
        console.log("set name");
    }
     
    public toJSON() {
        return {
            id: this.id,
            name: this._name
        };
    };
}
