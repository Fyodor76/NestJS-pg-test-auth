import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {User} from "./user.model";
import {InjectModel} from "@nestjs/sequelize";
import {CreateUserDto} from "./dto/createUserDto";
import {RolesService} from "../roles/roles.service";
import {AddRoleDto} from "./dto/addRoleDto";
import {BanUserDto} from "./dto/banUserDto";

@Injectable()
export class UsersService {

    constructor(@InjectModel(User) private userRepository: typeof User,
                private roleService: RolesService) {}

    async createUser(dto: CreateUserDto) {
        const user = await this.userRepository.create(dto);
        const role = await this.roleService.getRoleByValue('ADMIN');
        await user.$set('roles', [role.id]);
        user.roles = [role];
        return user;
    }

    async getAllUsers() {
        return await this.userRepository.findAll({include: {all: true}});
    }

    async getUserByEmail(email: string) {
        return await this.userRepository.findOne({where: {email}, include: {all: true}});
    }

    async addRole(dto: AddRoleDto) {
        const user = await this.userRepository.findByPk(dto.userId);
        const role = await this.roleService.getRoleByValue(dto.value);

        if (role && user) {
            await user.$add('role', role.id);
            return dto;
        }

        throw new HttpException("Пользователь или роль не найдены", HttpStatus.NOT_FOUND)
    }


   async ban(dto: BanUserDto) {
        const user = await this.userRepository.findByPk(dto.userId);

        if (!user) {
            throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND)
        }

        user.banned = true;
        user.banReason = dto.banReason;
        await user.save();
        return user;
    }
}
