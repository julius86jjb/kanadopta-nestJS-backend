export enum ValidRoles {
    // El dueño de la plataforma (tú)
    admin = 'admin',

    // Protectoras verificadas y activas
    shelter = 'shelter',

    // Protectoras que se acaban de registrar pero aún no han sido validadas
    shelter_pending = 'shelter_pending',

    // El usuario que busca adoptar (mantenemos 'user' por estándar o 'adoptante')
    user = 'user',
}