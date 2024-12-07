import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { UserNotFoundException } from '../../exceptions/user-not-found.exception';
import { FileNotImageException } from '../../exceptions/file-not-image.exception';
import { AwsS3Service } from '../../shared/services/aws-s3.service';
import { ValidatorService } from '../../shared/services/validator.service';
import { UserRegisterDto } from '../auth/dto/user-register.dto';
import { UserEntity } from './user.entity';
import { Transactional } from 'typeorm-transactional';
import { IFile } from '../../interfaces/IFile';
import { ObjectId } from 'mongodb';
import { UsersPageOptionsDto } from './dtos/users-page-options.dto';
// Fix these imports
import { PageDto } from '../../common/dto/page.dto';
import { UserDto } from './dtos/user.dto';
import type { Reference } from '../../types';
import { PageMetaDto } from '../../common/dto/page-meta.dto';
import { CreateSettingsDto } from './dtos/create-settings.dto';
import { UserSettingsEntity } from './user-settings.entity';
import { CreateSettingsCommand } from './commands/create-settings.command';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: MongoRepository<UserEntity>,
    private validatorService: ValidatorService,
    private awsS3Service: AwsS3Service,
    private commandBus: CommandBus,
  ) {}

  findOne(criteria: Partial<UserEntity>): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: criteria });
  }

  async findByUsernameOrEmail(
    options: Partial<{ username: string; email: string }>,
  ): Promise<UserEntity | null> {
    const query: any = {
      $or: []
    };

    if (options.email) {
      query.$or.push({ email: options.email });
    }

    if (options.username) {
      query.$or.push({ username: options.username });
    }

    return this.userRepository.findOne({ where: query });
  }

  @Transactional()
  async createUser(
    userRegisterDto: UserRegisterDto,
    file?: Reference<IFile>,
  ): Promise<UserEntity> {
    const user = new UserEntity();
    Object.assign(user, {
      ...userRegisterDto,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    if (file && !this.validatorService.isImage(file.mimetype)) {
      throw new FileNotImageException();
    }

    if (file) {
      user.avatar = await this.awsS3Service.uploadImage(file);
    }

    return this.userRepository.save(user);
  }

  async getUsers(
    pageOptionsDto: UsersPageOptionsDto,
  ): Promise<PageDto<UserDto>> {
    const skip = (pageOptionsDto.page - 1) * pageOptionsDto.take;
    
    const [items, total] = await Promise.all([
      this.userRepository.find({
        skip,
        take: pageOptionsDto.take,
        order: { createdAt: pageOptionsDto.order }
      }),
      this.userRepository.count()
    ]);

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto,
      itemCount: total
    });

    return new PageDto(items.map(item => item.toDto()), pageMetaDto);
  }

  async getUser(userId: string): Promise<UserDto> {
    const user = await this.userRepository.findOne({ 
      where: { _id: new ObjectId(userId) }
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    return user.toDto();
  }

  async createSettings(
    userId: string,
    createSettingsDto: CreateSettingsDto,
  ): Promise<UserSettingsEntity> {
    return this.commandBus.execute<CreateSettingsCommand, UserSettingsEntity>(
      new CreateSettingsCommand(userId, createSettingsDto),
    );
  }
}