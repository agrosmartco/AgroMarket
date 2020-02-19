import { repository } from '@loopback/repository';
import { HttpErrors } from '@loopback/rest';
import { Credentials, UsersRepository } from '../repositories/users.repository';
import { Users } from '../models';
import { comparePassword } from '../services/hash.password.bcryptjs';

export class MyUserService {

    constructor(
        @repository(UsersRepository)
        public usersRepository: UsersRepository) {

    }

    async  verifyCredentials(credentials: Credentials, userFind: any): Promise<Users> {

        const invalidCredentialsError = 'Invalid email or password.';

        if (!userFind) {

            throw new HttpErrors.Unauthorized(invalidCredentialsError);

        }
        
        const correctPassword: boolean = await comparePassword(credentials.password, userFind.password);

        if (!correctPassword) {

            throw new HttpErrors.Unauthorized(invalidCredentialsError);

        }

        return userFind;
        ;
    }
}
