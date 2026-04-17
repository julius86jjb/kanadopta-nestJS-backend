export const initialData = {
  users: [
    { email: 'admin@kanadopta.com', password: 'Admin123Password!', userName: 'super_admin', first_name: 'Julio', last_name: 'Admin', country: 'España', city: 'Las Palmas', address: 'Calle Triana 1', roles: ['admin'] },
    { email: 'partner1@kanadopta.com', password: 'PartnerPassword123!', userName: 'triana_manager', first_name: 'Maria', last_name: 'Partner', country: 'España', city: 'Las Palmas', address: 'Calle Triana 2', roles: ['partner'] },
    { email: 'partner2@kanadopta.com', password: 'PartnerPassword123!', userName: 'mesa_manager', first_name: 'Juan', last_name: 'Partner', country: 'España', city: 'Las Palmas', address: 'Mesa y Lopez 5', roles: ['partner'] },
    { email: 'partner3@kanadopta.com', password: 'PartnerPassword123!', userName: 'isleta_manager', first_name: 'Elena', last_name: 'Partner', country: 'España', city: 'Las Palmas', address: 'La Naval 10', roles: ['partner'] },
    { email: 'user1@kanadopta.com', password: 'UserPassword123!', userName: 'carlos_g', first_name: 'Carlos', last_name: 'García', country: 'España', city: 'Las Palmas', address: 'Calle Vegueta 1', roles: ['user'] },
    { email: 'user2@kanadopta.com', password: 'UserPassword123!', userName: 'ana_p', first_name: 'Ana', last_name: 'Pérez', country: 'España', city: 'Las Palmas', address: 'Paseo Chil 2', roles: ['user'] },
    { email: 'user3@kanadopta.com', password: 'UserPassword123!', userName: 'luis_r', first_name: 'Luis', last_name: 'Rodríguez', country: 'España', city: 'Las Palmas', address: 'Tomás Morales 5', roles: ['user'] },
    { email: 'user4@kanadopta.com', password: 'UserPassword123!', userName: 'marta_s', first_name: 'Marta', last_name: 'Sánchez', country: 'España', city: 'Las Palmas', address: 'Guanarteme 8', roles: ['user'] },
    { email: 'user5@kanadopta.com', password: 'UserPassword123!', userName: 'pedro_m', first_name: 'Pedro', last_name: 'Martín', country: 'España', city: 'Las Palmas', address: 'Siete Palmas 3', roles: ['user'] },
    { email: 'user6@kanadopta.com', password: 'UserPassword123!', userName: 'laura_l', first_name: 'Laura', last_name: 'López', country: 'España', city: 'Las Palmas', address: 'Escaleritas 4', roles: ['user'] },
  ],
  centers: [
    { name: "Centro Triana", organizationCode: "CT-001", description: "Sede Triana", phone: "928000001", email: "triana@kanadopta.com", address: "Calle Mayor de Triana 1", city: "Las Palmas de Gran Canaria", zipCode: "35002", isVerified: true, images: [{ url: 'https://picsum.photos/seed/CT-001_logo/200/200', type: 'logo' }, { url: 'https://picsum.photos/seed/CT-001_feat/800/600', type: 'featured' }, { url: 'https://picsum.photos/seed/CT-001_gal/800/600', type: 'gallery' }] },
    { name: "Centro Mesa y Lopez", organizationCode: "CML-002", description: "Sede Mesa y Lopez", phone: "928000002", email: "mesa@kanadopta.com", address: "Avenida José Mesa y López 1", city: "Las Palmas de Gran Canaria", zipCode: "35006", isVerified: true, images: [{ url: 'https://picsum.photos/seed/CML-002_logo/200/200', type: 'logo' }, { url: 'https://picsum.photos/seed/CML-002_feat/800/600', type: 'featured' }, { url: 'https://picsum.photos/seed/CML-002_gal/800/600', type: 'gallery' }] },
    { name: "Centro Las Canteras", organizationCode: "CLC-004", description: "Sede Canteras", phone: "928000004", email: "canteras@kanadopta.com", address: "Calle Prudencio Morales 1", city: "Las Palmas de Gran Canaria", zipCode: "35009", isVerified: true, images: [{ url: 'https://picsum.photos/seed/CLC-004_logo/200/200', type: 'logo' }, { url: 'https://picsum.photos/seed/CLC-004_feat/800/600', type: 'featured' }, { url: 'https://picsum.photos/seed/CLC-004_gal/800/600', type: 'gallery' }] },
    { name: "Centro Vegueta", organizationCode: "CV-005", description: "Sede Vegueta", phone: "928000005", email: "vegueta@kanadopta.com", address: "Calle Juan de Quesada 1", city: "Las Palmas de Gran Canaria", zipCode: "35001", isVerified: true, images: [{ url: 'https://picsum.photos/seed/CV-005_logo/200/200', type: 'logo' }, { url: 'https://picsum.photos/seed/CV-005_feat/800/600', type: 'featured' }, { url: 'https://picsum.photos/seed/CV-005_gal/800/600', type: 'gallery' }] },
    { name: "Centro Alcaravaneras", organizationCode: "CA-007", description: "Sede Alcaravaneras", phone: "928000007", email: "alcaravaneras@kanadopta.com", address: "Calle León y Castillo 200", city: "Las Palmas de Gran Canaria", zipCode: "35004", isVerified: true, images: [{ url: 'https://picsum.photos/seed/CA-007_logo/200/200', type: 'logo' }, { url: 'https://picsum.photos/seed/CA-007_feat/800/600', type: 'featured' }, { url: 'https://picsum.photos/seed/CA-007_gal/800/600', type: 'gallery' }] },
    { name: "Centro Puerto", organizationCode: "CP-008", description: "Sede Puerto", phone: "928000008", email: "puerto@kanadopta.com", address: "Calle Juan Rejón 1", city: "Las Palmas de Gran Canaria", zipCode: "35008", isVerified: true, images: [{ url: 'https://picsum.photos/seed/CP-008_logo/200/200', type: 'logo' }, { url: 'https://picsum.photos/seed/CP-008_feat/800/600', type: 'featured' }, { url: 'https://picsum.photos/seed/CP-008_gal/800/600', type: 'gallery' }] },
    { name: "Centro Arenales", organizationCode: "CAR-009", description: "Sede Arenales", phone: "928000009", email: "arenales@kanadopta.com", address: "Calle Luis Doreste Silva 1", city: "Las Palmas de Gran Canaria", zipCode: "35004", isVerified: true, images: [{ url: 'https://picsum.photos/seed/CAR-009_logo/200/200', type: 'logo' }, { url: 'https://picsum.photos/seed/CAR-009_feat/800/600', type: 'featured' }, { url: 'https://picsum.photos/seed/CAR-009_gal/800/600', type: 'gallery' }] },
    { name: "Centro Ciudad Alta", organizationCode: "CCA-010", description: "Sede Ciudad Alta", phone: "928000010", email: "alta@kanadopta.com", address: "Paseo de Chil 1", city: "Las Palmas de Gran Canaria", zipCode: "35011", isVerified: true, images: [{ url: 'https://picsum.photos/seed/CCA-010_logo/200/200', type: 'logo' }, { url: 'https://picsum.photos/seed/CCA-010_feat/800/600', type: 'featured' }, { url: 'https://picsum.photos/seed/CCA-010_gal/800/600', type: 'gallery' }] },
    { name: "Centro Escaleritas", organizationCode: "CE-011", description: "Sede Escaleritas", phone: "928000011", email: "escaleritas@kanadopta.com", address: "Avenida de Escaleritas 1", city: "Las Palmas de Gran Canaria", zipCode: "35011", isVerified: true, images: [{ url: 'https://picsum.photos/seed/CE-011_logo/200/200', type: 'logo' }, { url: 'https://picsum.photos/seed/CE-011_feat/800/600', type: 'featured' }, { url: 'https://picsum.photos/seed/CE-011_gal/800/600', type: 'gallery' }] },
    { name: "Centro Schamann", organizationCode: "CS-012", description: "Sede Schamann", phone: "928000012", email: "schamann@kanadopta.com", address: "Calle Pedro Infinito 1", city: "Las Palmas de Gran Canaria", zipCode: "35012", isVerified: true, images: [{ url: 'https://picsum.photos/seed/CS-012_logo/200/200', type: 'logo' }, { url: 'https://picsum.photos/seed/CS-012_feat/800/600', type: 'featured' }, { url: 'https://picsum.photos/seed/CS-012_gal/800/600', type: 'gallery' }] },
    { name: "Centro Siete Palmas", organizationCode: "CSP-013", description: "Sede Siete Palmas", phone: "928000013", email: "7palmas@kanadopta.com", address: "Avenida Pintor Felo Monzón 1", city: "Las Palmas de Gran Canaria", zipCode: "35019", isVerified: true, images: [{ url: 'https://picsum.photos/seed/CSP-013_logo/200/200', type: 'logo' }, { url: 'https://picsum.photos/seed/CSP-013_feat/800/600', type: 'featured' }, { url: 'https://picsum.photos/seed/CSP-013_gal/800/600', type: 'gallery' }] },
    { name: "Centro Miller Bajo", organizationCode: "CMB-015", description: "Sede Miller Bajo", phone: "928000015", email: "miller@kanadopta.com", address: "Calle de Miller Industrial 1", city: "Las Palmas de Gran Canaria", zipCode: "35014", isVerified: true, images: [{ url: 'https://picsum.photos/seed/CMB-015_logo/200/200', type: 'logo' }, { url: 'https://picsum.photos/seed/CMB-015_feat/800/600', type: 'featured' }, { url: 'https://picsum.photos/seed/CMB-015_gal/800/600', type: 'gallery' }] },
    { name: "Centro Lomo Los Frailes", organizationCode: "CLLF-016", description: "Sede Lomo Los Frailes", phone: "928000016", email: "frailes@kanadopta.com", address: "Calle de los Frailes 1", city: "Las Palmas de Gran Canaria", zipCode: "35018", isVerified: true, images: [{ url: 'https://picsum.photos/seed/CLLF-016_logo/200/200', type: 'logo' }, { url: 'https://picsum.photos/seed/CLLF-016_feat/800/600', type: 'featured' }, { url: 'https://picsum.photos/seed/CLLF-016_gal/800/600', type: 'gallery' }] },
    { name: "Centro Tafira", organizationCode: "CTAF-018", description: "Sede Tafira", phone: "928000018", email: "tafira@kanadopta.com", address: "Carretera del Centro 1", city: "Las Palmas de Gran Canaria", zipCode: "35017", isVerified: true, images: [{ url: 'https://picsum.photos/seed/CTAF-018_logo/200/200', type: 'logo' }, { url: 'https://picsum.photos/seed/CTAF-018_feat/800/600', type: 'featured' }, { url: 'https://picsum.photos/seed/CTAF-018_gal/800/600', type: 'gallery' }] },
    { name: "Centro San Telmo", organizationCode: "CST-019", description: "Sede San Telmo", phone: "928000019", email: "santelmo@kanadopta.com", address: "Calle Bravo Murillo 1", city: "Las Palmas de Gran Canaria", zipCode: "35003", isVerified: true, images: [{ url: 'https://picsum.photos/seed/CST-019_logo/200/200', type: 'logo' }, { url: 'https://picsum.photos/seed/CST-019_feat/800/600', type: 'featured' }, { url: 'https://picsum.photos/seed/CST-019_gal/800/600', type: 'gallery' }] },
    { name: "Centro Guanarteme", organizationCode: "CG-020", description: "Sede Guanarteme", phone: "928000020", email: "guanarteme@kanadopta.com", address: "Calle Fernando Guanarteme 1", city: "Las Palmas de Gran Canaria", zipCode: "35010", isVerified: true, images: [{ url: 'https://picsum.photos/seed/CG-020_logo/200/200', type: 'logo' }, { url: 'https://picsum.photos/seed/CG-020_feat/800/600', type: 'featured' }, { url: 'https://picsum.photos/seed/CG-020_gal/800/600', type: 'gallery' }] },
    { name: "Centro Las Torres", organizationCode: "CLT-021", description: "Sede Las Torres", phone: "928000021", email: "torres@kanadopta.com", address: "Calle Juan Carlos I 1", city: "Las Palmas de Gran Canaria", zipCode: "35019", isVerified: true, images: [{ url: 'https://picsum.photos/seed/CLT-021_logo/200/200', type: 'logo' }, { url: 'https://picsum.photos/seed/CLT-021_feat/800/600', type: 'featured' }, { url: 'https://picsum.photos/seed/CLT-021_gal/800/600', type: 'gallery' }] },
    { name: "Centro Hoya de la Plata", organizationCode: "CHP-022", description: "Sede Hoya de la Plata", phone: "928000022", email: "hoya@kanadopta.com", address: "Calle de la Plata 1", city: "Las Palmas de Gran Canaria", zipCode: "35016", isVerified: true, images: [{ url: 'https://picsum.photos/seed/CHP-022_logo/200/200', type: 'logo' }, { url: 'https://picsum.photos/seed/CHP-022_feat/800/600', type: 'featured' }, { url: 'https://picsum.photos/seed/CHP-022_gal/800/600', type: 'gallery' }] },
    { name: "Centro Vegueta Catedral", organizationCode: "CVC-024", description: "Sede Catedral", phone: "928000024", email: "catedral@kanadopta.com", address: "Plaza de Santa Ana 1", city: "Las Palmas de Gran Canaria", zipCode: "35001", isVerified: true, images: [{ url: 'https://picsum.photos/seed/CVC-024_logo/200/200', type: 'logo' }, { url: 'https://picsum.photos/seed/CVC-024_feat/800/600', type: 'featured' }, { url: 'https://picsum.photos/seed/CVC-024_gal/800/600', type: 'gallery' }] },
    { name: "Centro Tomas Miller", organizationCode: "CTM-025", description: "Sede Tomas Miller", phone: "928000025", email: "tmiller@kanadopta.com", address: "Calle Tomás Miller 10", city: "Las Palmas de Gran Canaria", zipCode: "35007", isVerified: true, images: [{ url: 'https://picsum.photos/seed/CTM-025_logo/200/200', type: 'logo' }, { url: 'https://picsum.photos/seed/CTM-025_feat/800/600', type: 'featured' }, { url: 'https://picsum.photos/seed/CTM-025_gal/800/600', type: 'gallery' }] },
    { name: "Centro Luis Morote", organizationCode: "CLM-026", description: "Sede Luis Morote", phone: "928000026", email: "morote@kanadopta.com", address: "Calle Luis Morote 15", city: "Las Palmas de Gran Canaria", zipCode: "35007", isVerified: true, images: [{ url: 'https://picsum.photos/seed/CLM-026_logo/200/200', type: 'logo' }, { url: 'https://picsum.photos/seed/CLM-026_feat/800/600', type: 'featured' }, { url: 'https://picsum.photos/seed/CLM-026_gal/800/600', type: 'gallery' }] },
    { name: "Centro Sagasta", organizationCode: "CSAG-027", description: "Sede Sagasta", phone: "928000027", email: "sagasta@kanadopta.com", address: "Calle Sagasta 20", city: "Las Palmas de Gran Canaria", zipCode: "35008", isVerified: true, images: [{ url: 'https://picsum.photos/seed/CSAG-027_logo/200/200', type: 'logo' }, { url: 'https://picsum.photos/seed/CSAG-027_feat/800/600', type: 'featured' }, { url: 'https://picsum.photos/seed/CSAG-027_gal/800/600', type: 'gallery' }] },
    { name: "Centro Primero de Mayo", organizationCode: "CPM-028", description: "Sede 1º de Mayo", phone: "928000028", email: "1mayo@kanadopta.com", address: "Avenida Primero de Mayo 10", city: "Las Palmas de Gran Canaria", zipCode: "35002", isVerified: true, images: [{ url: 'https://picsum.photos/seed/CPM-028_logo/200/200', type: 'logo' }, { url: 'https://picsum.photos/seed/CPM-028_feat/800/600', type: 'featured' }, { url: 'https://picsum.photos/seed/CPM-028_gal/800/600', type: 'gallery' }] },
    { name: "Centro Francisco Gourié", organizationCode: "CFG-029", description: "Sede Gourie", phone: "928000029", email: "gourie@kanadopta.com", address: "Calle Francisco Gourié 1", city: "Las Palmas de Gran Canaria", zipCode: "35002", isVerified: true, images: [{ url: 'https://picsum.photos/seed/CFG-029_logo/200/200', type: 'logo' }, { url: 'https://picsum.photos/seed/CFG-029_feat/800/600', type: 'featured' }, { url: 'https://picsum.photos/seed/CFG-029_gal/800/600', type: 'gallery' }] },
 {
      name: "Protectora Apadac",
      organizationCode: "APA-001",
      description: "Asociación Protectora de Animales de Callosa de Segura. Nos dedicamos al rescate, rehabilitación y búsqueda de hogares responsables para animales abandonados en la zona de la Vega Baja.",
      address: "Calle Cañada Blanca, 7, Parque La Reina, Arona",
      city: "Santa Cruz de Tenerife",
      zipCode: "38640",
      country: "ES",
      phone: "630335544",
      email: "info@apadac.es",
      managerName: "Ana Martínez",
      isVerified: true,
      isActive: true,
      likesCount: 154,
      capacity: 50,
      staffCount: 5,
      monthlyOperatingCost: 1200,
      adoptionPolicy: "Contrato de adopción, seguimiento post-adopción y compromiso de esterilización.",
      socialLinks: {
        facebook: "https://facebook.com/apadac",
        instagram: "https://instagram.com/apadac_oficial",
        twitter: "https://twitter.com/apadac",
        website: "https://apadac.es"
      },
      openingHours: {
        monday: "09:00-14:00",
        tuesday: "09:00-14:00",
        wednesday: "09:00-14:00",
        thursday: "09:00-14:00",
        friday: "09:00-14:00",
        saturday: "10:00-13:00",
        sunday: "Cerrado"
      },
      donationInfo: {
        paypal: "donaciones@apadac.es",
        bankAccount: "ES21 0000 0000 0000 0000 0000",
        wishlist: "https://amazon.es/wishlist/apadac"
      },
      legalInfo: {
        taxId: "G12345678",
        legalName: "Asociación Protectora Apadac",
        foundationDate: "2010-05-20"
      },
      images: [
        { url: 'https://picsum.photos/seed/apadac_logo/400/400', type: 'logo' },
        { url: 'https://picsum.photos/seed/apadac_feat/1200/800', type: 'featured' },
        { url: 'https://picsum.photos/seed/apadac_g1/1000/700', type: 'gallery' },
        { url: 'https://picsum.photos/seed/apadac_g2/1000/701', type: 'gallery' },
        { url: 'https://picsum.photos/seed/apadac_g3/1000/702', type: 'gallery' },
        { url: 'https://picsum.photos/seed/apadac_g4/1000/703', type: 'gallery' }
      ]
    },
    {
      name: "Sos Bilbao",
      organizationCode: "SOS-BIL",
      description: "Centro de adopción integral en Bilbao. Trabajamos con una red de casas de acogida para garantizar el bienestar de perros y gatos mientras encuentran su familia definitiva.",
      address: "Portuko Markesaren Kalea, 12, Abando",
      city: "Bilbao",
      zipCode: "48008",
      country: "ES",
      phone: "944123456",
      email: "contacto@sosbilbao.org",
      managerName: "Iñaki García",
      isVerified: true,
      isActive: true,
      likesCount: 89,
      capacity: 30,
      staffCount: 3,
      monthlyOperatingCost: 950,
      adoptionPolicy: "Entrevista previa y visita al domicilio del adoptante requerida.",
      socialLinks: {
        facebook: "https://facebook.com/sosbilbao",
        instagram: "https://instagram.com/sosbilbao",
        website: "https://sosbilbao.org"
      },
      openingHours: {
        monday: "10:00-18:00",
        tuesday: "10:00-18:00",
        wednesday: "10:00-18:00",
        thursday: "10:00-18:00",
        friday: "10:00-18:00",
        saturday: "10:00-14:00",
        sunday: "10:00-14:00"
      },
      images: [
        { url: 'https://picsum.photos/seed/sosb_logo/400/400', type: 'logo' },
        { url: 'https://picsum.photos/seed/sosb_feat/1200/800', type: 'featured' },
        { url: 'https://picsum.photos/seed/sosb_g1/1000/700', type: 'gallery' },
        { url: 'https://picsum.photos/seed/sosb_g2/1000/701', type: 'gallery' }
      ]
    },
    {
      name: "Murcia Animalista",
      organizationCode: "MUR-ANI",
      description: "Refugio dedicado a la protección de animales maltratados en la Región de Murcia. Especialistas en rescate de galgos y perros de caza.",
      address: "Calle Torre Álvarez, 1",
      city: "Murcia",
      zipCode: "30007",
      country: "ES",
      lat: 37.9833,
      lng: -1.1333,
      phone: "600112233",
      email: "adopta@murciaanimalista.com",
      managerName: "Pedro Salzillo",
      isVerified: true,
      isActive: true,
      likesCount: 210,
      capacity: 100,
      staffCount: 8,
      monthlyOperatingCost: 2500,
      adoptionPolicy: "Contrato con cláusula de devolución obligatoria si no se puede atender al animal.",
      socialLinks: {
        facebook: "https://facebook.com/murcianimal",
        instagram: "https://instagram.com/murcianimal",
        twitter: "https://twitter.com/murcianimal"
      },
      openingHours: {
        monday: "08:00-16:00",
        tuesday: "08:00-16:00",
        wednesday: "08:00-16:00",
        thursday: "08:00-16:00",
        friday: "08:00-16:00",
        saturday: "08:00-12:00",
        sunday: "08:00-12:00"
      },
      images: [
        { url: 'https://picsum.photos/seed/murcia_logo/400/400', type: 'logo' },
        { url: 'https://picsum.photos/seed/murcia_feat/1200/800', type: 'featured' },
        { url: 'https://picsum.photos/seed/murcia_g1/1000/700', type: 'gallery' },
        { url: 'https://picsum.photos/seed/murcia_g2/1000/701', type: 'gallery' },
        { url: 'https://picsum.photos/seed/murcia_g3/1000/702', type: 'gallery' }
      ]
    }
  ]

};