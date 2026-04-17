import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { AdoptionCenter } from "./adoption-center.entity"; 

export enum ImageType {
    LOGO = 'logo',
    FEATURED = 'featured',
    GALLERY = 'gallery',
}

@Entity({ name: 'adoption_center_images' })
export class AdoptionCenterImage {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    url: string;

    // Columna vital para poder borrar en la nube
    @Column('text', { nullable: true })
    publicId: string;

    @Column({
        type: 'enum', 
        enum: ImageType,
        default: ImageType.GALLERY
    })
    type: ImageType;

    @ManyToOne(
        () => AdoptionCenter,
        ( adoptionCenter ) => adoptionCenter.images,
        { onDelete: 'CASCADE' }
    )
    adoptionCenter: AdoptionCenter;
}