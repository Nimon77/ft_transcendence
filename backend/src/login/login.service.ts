import { Injectable } from '@nestjs/common';

@Injectable()
export class LoginService {
    genURL() : string {
        let myURL = new URL(`https://${process.env['42_URL']}`);

        myURL.searchParams.set('client_id', process.env['42_UID']);
        myURL.searchParams.set('redirect_uri', process.env['42_redirect_uri']);
        myURL.searchParams.set('response_type', process.env['42_response_type']);
        
        return myURL.href;
    }
}
