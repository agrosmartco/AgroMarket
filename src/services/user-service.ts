import { UsersRepository } from '../repositories';
import { repository } from '@loopback/repository';
import { HttpErrors } from '@loopback/rest';
import {Credentials} from '../repositories/users.repository';
import { Users } from '../models';


export class MyUserService {

    constructor(@repository(UsersRepository) public userRepository: UsersRepository) {

    }

    async  verifyCredentials(credentials: Credentials): Promise<Users> {
        console.log(credentials);
        
        const invalidCredentialsError = 'Invalid email or password.';

        const foundUser = await this.userRepository.findOne({
            where: { email: credentials.email },
        });
        if (!foundUser) {
            throw new HttpErrors.Unauthorized(invalidCredentialsError);
        }

        const credentialsFound = await this.userRepository.findCredentials(
            foundUser.id,
        );
        if (!credentialsFound) {
            throw new HttpErrors.Unauthorized(invalidCredentialsError);
        }

        // const passwordMatched = await this.passwordHasher.comparePassword(
        //     credentials.password,
        //     credentialsFound.password,
        // );

        // if (!passwordMatched) {
        //     throw new HttpErrors.Unauthorized(invalidCredentialsError);
        // }

        return foundUser;
    }
}
