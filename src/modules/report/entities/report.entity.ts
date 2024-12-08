import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';

@Entity('reports')
export class Report {
  @ApiProperty()
  @ObjectIdColumn()
  _id: ObjectId;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  content: string;

  @ApiProperty()
  @Column()
  category: string;

  @ApiProperty()
  @Column()
  isAnonymous: boolean;

  @ApiProperty()
  @Column()
  location: {
    lat: number;
    lng: number;
    accuracy?: number;
  };

  @ApiProperty()
  @Column()
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';

  @ApiProperty()
  @Column()
  authorId: string;

  @ApiProperty()
  @Column()
  media: string[];

  @ApiProperty()
  @Column()
  audio?: string;

  @ApiProperty()
  @Column({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty()
  @Column({ type: 'timestamp' })
  updatedAt: Date;

  constructor() {
    this._id = new ObjectId();
    this.title = '';
    this.content = '';
    this.category = '';
    this.isAnonymous = false;
    this.location = { lat: 0, lng: 0 };
    this.status = 'pending';
    this.authorId = '';
    this.media = [];
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}