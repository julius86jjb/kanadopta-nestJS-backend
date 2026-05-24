import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { DonationInfo } from '../interfaces/donation-info.interface';
import { LegalInfo } from '../interfaces/legal-info.interface';
import { OpeningHours } from '../interfaces/opening-hours.interface'; // Esta es la nueva interfaz estructurada
import { SocialLinks } from '../interfaces/social-links.interface';
import { AdoptionCenterImage } from './adoption-center-images.entity';
import { User } from 'src/users/entities/user.entity';
import { SupportedSpecies } from '../dto/create-adoption-center.dto';

@Entity({ name: 'adoption_centers' })
export class AdoptionCenter {

  @PrimaryColumn('uuid')
  id: string;
  @Column('text', { unique: true })
  name: string;
  @Column('text', { unique: true })
  organizationCode: string;
  @Column('text', { nullable: true })
  description: string;
  @Column('text', { unique: true })
  slug: string;

  // Ubicacion
  @Column('text') address: string;
  @Column('text') city: string;
  @Column('text', { nullable: true }) province: string; // Nuevo: Provincia
  @Column('text', { nullable: true }) state: string;    // Nuevo: Comunidad Autónoma
  @Column('text') zipCode: string;
  @Column('text', { default: 'España' }) country: string;
  @Column('float', { default: 0, nullable: true }) lat: number;
  @Column('float', { default: 0, nullable: true }) lng: number;

  // Contacto
  @Column('text', { unique: true }) phone: string;
  @Column('text', { unique: true }) email: string;
  @Column('text') managerName: string;

  
  @Column('simple-json', { nullable: true }) socialLinks: SocialLinks;
  @Column('simple-json', { nullable: true }) legalInfo: LegalInfo;
  @Column('simple-json', { nullable: true }) donationInfo: DonationInfo;
  @Column('simple-json', { nullable: true }) openingHours: OpeningHours;

  @Column('text', { array: true, default: [] }) supportedSpecies: SupportedSpecies[];
  @Column('int', { default: 0 }) capacity: number;
  @Column('text', { array: true, default: [] }) tags: string[];
  @Column('int', { default: 0 }) currentOccupancy: number;


  @Column('boolean', { nullable: true }) hasVeterinaryService: boolean;
  @Column('boolean', { nullable: true }) hasTransportService: boolean;
  @Column('boolean', { nullable: true }) allowsVolunteers: boolean;
  @Column('text', { nullable: true }) adoptionPolicy: string;
  
  @Column('boolean', { default: true }) isActive: boolean;
  @Column('boolean', { default: false }) isVerified: boolean;
  @Column('boolean', { default: false }) isEmergency: boolean;
  @Column('int', { default: 0 }) likesCount: number;

  @OneToMany(() => AdoptionCenterImage, (img) => img.adoptionCenter, { cascade: true })
  images?: AdoptionCenterImage[];

  @ManyToOne(() => User, (user) => user.adoptionCenters, { eager: true })
  user: User;

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;

  @BeforeInsert()
  checkBeforeInsert() {
    if (!this.id) this.id = uuidv4();
    if (!this.slug) this.slug = this.name;
    this.generateSlug();
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.generateSlug();
  }

  private generateSlug() {
    this.slug = this.slug
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
}