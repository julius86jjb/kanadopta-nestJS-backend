import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn, // Importación necesaria para Soft Delete
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ValidRoles } from '../auth/interfaces/valid-roles.interface';
import { AdoptionCenter } from '../../adoption-centers/entities/adoption-center.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryColumn('uuid')
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
    default: ['user']
  })
  roles: ValidRoles[];

  // --- RELACIÓN CON CENTROS DE ADOPCIÓN ---
  @OneToMany(
    () => AdoptionCenter,
    (adoptionCenter) => adoptionCenter.user,
  )
  adoptionCenters: AdoptionCenter[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // --- BORRADO LÓGICO ---
  @DeleteDateColumn()
  deleted_at: Date;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv4();
    }
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