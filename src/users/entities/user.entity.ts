import { IsBoolean, IsString } from 'class-validator';

import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  PrimaryColumn
} from 'typeorm';
import { ValidRoles } from '../auth/interfaces/valid-roles.interface';
import { v4 as uuidv4 } from 'uuid'

@Entity({ name: 'users' })
export class User {
  @PrimaryColumn('uuid') // Cambiamos de @PrimaryGeneratedColumn a @PrimaryColumn por error en consola
  id: string;

  @Column('text', {
    unique: true,
  })
  email: string;

  @Column('text', {
    select: false,
  })
  password: string;

  @Column('text', {
    unique: true,
  })
  userName: string;

  @Column('text')
  first_name: string;

  @Column('text')
  last_name: string;

  @Column('text')
  country: string;

  @Column('text')
  city: string;

  @Column({
    type: 'text',
    nullable: true,
    unique: true
  })
  phone: string;

  @Column('text')
  address: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  img: string;

  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  @Column('text', {
    array: true,
    default:['user']
  })
  roles: ValidRoles[] 

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  generateId() {
    this.id = uuidv4(); // Generamos el UUID justo antes de insertar en la DB
  }

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
