import { Component, Inject } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/forkJoin';

@Component({
    selector: 'teachingsSearch',
    templateUrl: './teachingsSearch.component.html',
    styleUrls: ['../students.component.css']
})
export class TeachingsSearchComponent {
	public teachings: Teaching[];
	public courses: Course[];
	public teachers: Teacher[];
	public selectedTeaching: Teaching | undefined;
	public bycredit: string = "";
	public byyear: string = "";
	public byname: string = "";
	public originalTeachings: Teaching[];

	
    constructor(private http: Http, @Inject('BASE_URL') private baseUrl: string) {
		this.refreshData();
    }

    async refreshData() {
        this.http.get(this.baseUrl + 'api/teachingmanagement/teachings').subscribe(result => {
            let teachingList = [];

            for (let tchng of result.json() as Teaching[]) {

                let teaching = new Teaching();
                teaching.id = tchng.id;
				teaching.name = tchng.name;
				teaching.creditNumber = tchng.creditNumber;
				teaching.semester = tchng.semester;
				teaching.years = tchng.years;
				if (tchng.course !== undefined) teaching.course = tchng.course;
				if (tchng.teacher !== undefined) teaching.teacher = tchng.teacher;
                teaching.hasChanges = false;
                teachingList.push(teaching);
            }

            console.log("ok");

            this.teachings = teachingList;

			this.selectTeaching();
			this.originalTeachings = teachingList;
		}, error => console.error(error));
    }


    selectTeaching(): void {

        this.selectedTeaching = undefined;

        for (let tchng of this.teachings) {
            if (tchng.deleted == false) {
				this.selectedTeaching = tchng;
				break;
            }

        }
    }

    async putData(): Promise<void> {
        let headers = new Headers({ 'Content-Type': 'application/json' });

        let serverCalls = [];

        for (let teaching of this.teachings) {
            if (teaching.hasChanges == true || teaching.deleted) {

                let json = JSON.stringify(teaching.toJSON());

                if (!teaching.id) { //create
                    if (!teaching.deleted) {
                        let call = this.http.put(this.baseUrl + 'api/teachingmanagement/teachings', json, { headers: headers });
                        serverCalls.push(call);
                    }
                }
                else {
                    if (teaching.deleted) {
                        let url = this.baseUrl + 'api/teachingmanagement/teachings?id=' + teaching.id;
                        let call = this.http.delete(url, { headers: headers });
                        serverCalls.push(call);
                    }
                    else {
                        let call = this.http.post(this.baseUrl + 'api/teachingmanagement/teachings', json, { headers: headers });
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

    onSelect(teaching: Teaching): void {

        if (teaching.deleted == false) {
            this.selectedTeaching = teaching;
        }
    }

    async saveChanges(): Promise<void> {
        await this.putData();
        //console.log("update completed");
        //await this.refreshData();
	}

	searchbycredit(): void {
		this.teachings = new Array<Teaching>();
		for (var i = 0; i < this.originalTeachings.length; i++) {
			if (this.originalTeachings[i].creditNumber == this.bycredit) {
				this.teachings.push(this.originalTeachings[i]);
			}
		}
	}

	searchbyyear(): void {
		this.teachings = new Array<Teaching>();
		for (var i = 0; i < this.originalTeachings.length; i++) {
			if (this.originalTeachings[i].years == this.byyear) {
				this.teachings.push(this.originalTeachings[i]);
			}
		}
	}

	searchbyname(): void {
		this.teachings = new Array<Teaching>();
		for (var i = 0; i < this.originalTeachings.length; i++) {
			if (this.originalTeachings[i].name == this.byname) {
				this.teachings.push(this.originalTeachings[i]);
			}
		}
	}

	clear(): void {
		this.teachings = new Array<Teaching>();
		for (var i = 0; i < this.originalTeachings.length; i++) {
			this.teachings.push(this.originalTeachings[i]);
		}
	}
}

class Teaching {
    id: number;

    private _name: string = "";   
    private _creditNumber: string = "";
    private _semester: string = "";
    private _years: string = "";    
	private _course: Course;
	private _teacher: Teacher;


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

    get creditNumber(): string {
        return this._creditNumber;
    }
    set creditNumber(n: string) {
        this._creditNumber = n;
        this.hasChanges = true;
        console.log("set creditNumber");
    }

    get semester(): string {
        return this._semester;
    }
    set semester(n: string) {
        this._semester = n;
        this.hasChanges = true;
        console.log("set semester");
    }

    get years(): string {
        return this._years;
    }
    set years(n: string) {
        this._years = n;
        this.hasChanges = true;
        console.log("set years");
    }    

	get course(): Course {
		return this._course;
	}
	set course(d: Course) {
		this._course = d;
		this.hasChanges = true;
		console.log("set course");
	}

	get teacher(): Teacher {
		return this._teacher;
	}
	set teacher(d: Teacher) {
		this._teacher = d;
		this.hasChanges = true;
		console.log("set Teacher");
	}


    public toJSON() {
        return {
            id: this.id,
            name: this._name,
            creditNumber: this.creditNumber,
            semester: this.semester,
			years: this.years,
			course: this._course.toJSON(),
			teacher: this._teacher.toJSON()
        };
    };
}

class Teacher {
	private _id: number;
	private _name: string = "";
	private _surname: string = "";

	public hasChanges: boolean;
	public deleted: boolean = false;

	get id(): number {
		return this._id;
	}
	set id(n: number) {
		this._id = n;
		this.hasChanges = true;
		console.log("set id");
	}

	get name(): string {
		return this._name;
	}
	set name(n: string) {
		this._name = n;
		this.hasChanges = true;
		console.log("set name");
	}

	get surname(): string {
		return this._surname;
	}
	set surname(n: string) {
		this._surname = n;
		this.hasChanges = true;
		console.log("set surname");
	}

	public toJSON() {
		return {
			id: this._id,
			name: this._name,
			surname: this._surname
		};
	};
}

class Course {
	private _id: number;
	private _name: string = "";

	public hasChanges: boolean;
	public deleted: boolean = false;

	get id(): number {
		return this._id;
	}
	set id(n: number) {
		this._id = n;
		this.hasChanges = true;
		console.log("set id");
	}

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
			id: this._id,
			name: this._name
		};
	};
}
