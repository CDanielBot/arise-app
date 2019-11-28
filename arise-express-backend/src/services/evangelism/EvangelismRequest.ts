export default interface EvangelismRequest {
    Id?: number
    UserId?: number
    ApplicantName: string
    ApplicantPhone: string
    ApplicantEmail: string
    Name?: string
    Email?: string
    Phone?: string
    CreationDate: Date
}

export interface ContactCrudEntity {
    UserId: number
    ContactUserId: number
    Type: number
    Name?: string
    Email?: string
    Mobile?: string
    Address: string
    Stage: number
    Details: string
}

export interface NoteCrudEntity {
    RelatedEntityId: number
    RelatedEntityType: string
    UserId: number
    Type: number
    Private: number
    Note: string
}