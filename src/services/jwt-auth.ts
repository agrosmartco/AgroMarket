import jwt from 'jsonwebtoken';


export async function jwtToken(
    id: any
): Promise<string> {
    
    return jwt.sign({_id:id},process.env.TOKEN_SECRET || 'tokentest')
}