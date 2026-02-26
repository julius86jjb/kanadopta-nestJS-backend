import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { DonationInfo } from '../interfaces/donation-info.interface';
import { LegalInfo } from '../interfaces/legal-info.interface';
import { OpeningHours } from '../interfaces/opening-hours.interface';
import { SocialLinks } from '../interfaces/social-links.interface';

// Importamos tus interfaces

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

  // --- Ubicación ---
  @Column('text')
  address: string;

  @Column('text')
  city: string;

  @Column('text')
  zipCode: string;

  @Column('text', { default: 'ES' })
  country: string;

  // Tipo Numérico (float) para coordenadas
  @Column('float', { default: 0, nullable: true })
  lat: number;

  @Column('float', { default: 0, nullable: true })
  lng: number;

  // --- Contacto ---
  @Column('text')
  phone: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text', { nullable: true })
  managerName: string;

  // --- Campos JSON (con simple-json para compatibilidad total) ---
  @Column('simple-json', { nullable: true })
  socialLinks: SocialLinks;

  @Column('simple-json', { nullable: true })
  legalInfo: LegalInfo;

  @Column('simple-json', { nullable: true })
  donationInfo: DonationInfo;

  @Column('simple-json', { nullable: true })
  hours: OpeningHours;

  // --- Especialización e Instalaciones ---
  @Column('text', { array: true, default: [] })
  supportedSpecies: string[];

  @Column('text', { array: true, default: [] })
  facilities: string[];

  @Column('text', { array: true, default: [] })
  tags: string[];

  // Tipos Enteros (int)
  @Column('int', { default: 0 })
  capacity: number;

  @Column('int', { default: 0 })
  currentOccupancy: number;

  @Column('int', { default: 0, nullable: true })
  staffCount: number;

  // --- Operación y Finanzas ---
  @Column('text', { nullable: true })
  adoptionPolicy: string;

  @Column('text', { nullable: true })
  mainImage: string;

  // Tipo Numérico para costes (precisión)
  @Column('float', { default: 0, nullable: true })
  monthlyOperatingCost: number;

  // --- Estado y Administración ---
  @Column('boolean', { default: true })
  isActive: boolean;

  @Column('boolean', { default: false })
  isVerified: boolean;

  @Column('boolean', { default: false })
  isEmergency: boolean;

  @Column('float', { default: 0 })
  rating: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // --- Hooks ---
  @BeforeInsert()
  checkId() {
    if (!this.id) this.id = uuidv4();
  }

  // ... resto de tus columnas ...

  @BeforeInsert()
  checkSlugInsert() {
    // Generamos el ID si no viene (esto ya lo teníamos)
    if (!this.id) {
      this.id = uuidv4(); // o la lógica de UUID que estés usando
    }

    // Lógica de Fernando: Si no viene slug, usamos el name
    if (!this.slug) {
      this.slug = this.name;
    }

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_') // Fernando usa '-', tú puedes usar '_' o '-' como prefieras
      .replaceAll("'", '');
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    // Forzamos que el slug siempre se genere del nombre actual,
    // así, si el nombre cambia, el slug cambia obligatoriamente.
    this.slug = this.name
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}