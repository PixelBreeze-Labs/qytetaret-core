// user.entity.ts
import { Entity, Column, ObjectIdColumn, ObjectId } from 'typeorm';

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

  @Column({ default: 'user' })
  role!: string;

  @Column({ default: false })
  isEmailVerified!: boolean;

  @Column()
  createdAt!: Date;

  @Column()
  updatedAt!: Date;

  @Column({ nullable: true })
  avatar?: string;

  toDto() {
    return {
      id: this._id.toString(),
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      role: this.role,
      isEmailVerified: this.isEmailVerified,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      avatar: this.avatar
    };
  }
}