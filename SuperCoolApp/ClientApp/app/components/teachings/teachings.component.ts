import { Component, Inject } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/forkJoin';

@Component({
    selector: 'teachings',
    templateUrl: './teachings.component.html',
    styleUrls: ['../students.component.css']
})
export class TeachingsComponent {
    public teachings: Teaching[];
    public selectedTeaching: Teaching | undefined;

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
                teaching.hasChanges = false;
                teachingList.push(teaching);
            }

            console.log("ok");

            this.teachings = teachingList;

            this.selectTeaching();
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

    addNewTeaching(): void {
        this.selectedTeaching = new Teaching();
        this.selectedTeaching.hasChanges = true;
        this.teachings.push(this.selectedTeaching);
    }

    async saveChanges(): Promise<void> {
        await this.putData();
        //console.log("update completed");
        //await this.refreshData();
    }

    delete(teaching: Teaching): void {
        teaching.deleted = true;
        this.selectTeaching();
    }
}

class Teaching {
    id: number;

    private _name: string = "";   
    private _creditNumber: string = "";
    private _semester: string = "";
    private _years: string = "";    
   
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

    public toJSON() {
        return {
            id: this.id,
            name: this._name,
            creditNumber: this.creditNumber,
            semester: this.semester,
            years: this.years           
        };
    };
}
