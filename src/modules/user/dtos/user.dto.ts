// user.dto.ts
import { AbstractDto } from '../../../common/dto/abstract.dto';
import { RoleType } from '../../../constants/role-type';
import {
  BooleanFieldOptional,
  EmailFieldOptional,
  EnumFieldOptional,
  PhoneFieldOptional,
  StringFieldOptional,
} from '../../../decorators/field.decorators';
import type { UserEntity } from '../user.entity';

export type UserDtoOptions = Partial<{ isActive: boolean }>;

export class UserDto extends AbstractDto {
  @StringFieldOptional()
  firstName!: string;

  @StringFieldOptional()
  lastName!: string;

  @StringFieldOptional({ nullable: true })
  username?: string;

  @EnumFieldOptional(() => RoleType)
  role!: RoleType;

  @EmailFieldOptional()
  email!: string;

  @StringFieldOptional({ nullable: true })
  avatar?: string;

  // @ts-ignore
  @PhoneFieldOptional({ nullable: true })
  phone?: string;

  @BooleanFieldOptional()
  isActive?: boolean;

  constructor(entity: UserEntity, options?: UserDtoOptions) {
    // @ts-ignore
    super(entity);
    
    this.firstName = entity.firstName;
    this.lastName = entity.lastName;
    this.role = entity.role;
    this.email = entity.email;
    this.avatar = entity.avatar;
    this.phone = entity.phone;
    this.username = undefined; // or derive it if you have a way to generate username
    this.isActive = options?.isActive;
  }
}