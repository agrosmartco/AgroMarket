import jwt from 'jsonwebtoken';
import { HttpErrors } from '@loopback/rest';


export async function generateToken(
    id: any,
    roles:any
): Promise<string> {

    return jwt.sign({ _id: id,roles:roles}, process.env.TOKEN_SECRET || 'tokentest', {
        expiresIn: 60 * 60 * 24
    })
}

export async function validateToken(
    token: string
): Promise<string|object> {

    if (!token) {
        throw new HttpErrors.Unauthorized(
          `Error verifying token : 'token' is null`,
        );
    }

   const payload =  jwt.verify(token,process.env.TOKEN_SECRET || 'tokentest')
 
    return payload
}
