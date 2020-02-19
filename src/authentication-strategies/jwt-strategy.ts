
import { HttpErrors, Request } from '@loopback/rest';
import { AuthenticationStrategy } from '@loopback/authentication';
import jwt from 'jsonwebtoken';


export class JWTAuthenticationStrategy implements AuthenticationStrategy {

    name = 'jwt';

    constructor(
    ) { }

    authenticate(request: Request): any {

        var token: string | any = request.headers.authtoken;

        if (!token) {

            throw new HttpErrors.Unauthorized(
                `Error verifying token : 'token' is null`,
            );
        }

        try {

            const payload = jwt.verify(token, process.env.TOKEN_SECRET || 'tokentest')

            return payload;
            
        } catch (error) {

                throw new HttpErrors.Unauthorized(
                    `Error verifying token : invalid token `+ error,
                );   
        }
    }

}