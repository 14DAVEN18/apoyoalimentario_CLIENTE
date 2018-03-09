import { Injectable } from '@angular/core'
import { Http, Response, Headers } from '@angular/http';
import { Constants } from '../constants/model.constants';
import 'rxjs/add/operator/map';
import { ProcessConfiguration } from '../models/configuration.model';
import { Email, BodyEmail } from '../models/email.model';

@Injectable()
export class EmailConfiguration {
   
    
    public email: Email;
    public bodyEmail: BodyEmail;

    headers: Headers;
    constructor(private _http: Http, private _constants: Constants) {       

    }

    ngOnInit() {
    }
    
    public PutConfiguration(_email: Email, _url: string) {
        this.headers= new Headers;
        this.headers.append('Content-Type', 'application/json');
        return this._http.put(_url, _email, {headers: this.headers});
    }

    

    public GetAdminInformation() {
        return this._http.get(this._constants.pathEmail)
            .map((res: Response) => res.json());
    }
    
    public SendEmail(_bodyemail: BodyEmail) {
        this.headers= new Headers;
        this.headers.append('Content-Type', 'application/json');
        let url = this._constants.pathSendEmail;
        return this._http.put(url, _bodyemail, {headers: this.headers});
    }
}