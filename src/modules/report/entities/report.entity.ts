// src/modules/report/entities/report.entity.ts
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('reports')
export class Report {
  @ApiProperty()
  @ObjectIdColumn()
  id: string;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty()
  @Column()
  location: {
    type: string;
    coordinates: [number, number];
  };

  @ApiProperty()
  @Column()
  category: string;

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
  @Column({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty()
  @Column({ type: 'timestamp' })
  updatedAt: Date;

  constructor() {
    this.id = '';
    this.title = '';
    this.description = '';
    this.location = { type: 'Point', coordinates: [0, 0] };
    this.category = '';
    this.status = 'pending';
    this.authorId = '';
    this.media = [];
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}