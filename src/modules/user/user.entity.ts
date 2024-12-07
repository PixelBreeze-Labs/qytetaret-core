// user.entity.ts
import { Entity, Column, ObjectIdColumn, ObjectId } from 'typeorm';
import { UserDto } from './dtos/user.dto';
import { RoleType } from '../../constants/role-type';

@Entity('users')
export class UserEntity {
    @ObjectIdColumn()
    _id!: ObjectId;

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column()
    email!: string;

    @Column()
    password!: string;

    @Column({ nullable: true })
    phone?: string;

    @Column({ default: RoleType.USER })
    role!: RoleType;

    @Column({ default: false })
    isEmailVerified!: boolean;

    @Column()
    createdAt!: Date;

    @Column()
    updatedAt!: Date;

    @Column({ nullable: true })
    avatar?: string;

    toDto(_p0: { isActive: boolean; }): UserDto {
        return new UserDto(this);
    }
}