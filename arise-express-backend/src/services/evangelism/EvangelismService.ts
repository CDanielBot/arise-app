import { Request, Response } from 'express'
import EvangelismCrud from './EvangelismCrud'
import EvangelismRequest, { ContactCrudEntity, NoteCrudEntity } from './EvangelismRequest'
import logger from '../../log/Logger'
import ContactCrud from './ContactCrud'
import NoteCrud from './NoteCrud'

export default class EvangelismService {

    private crud: EvangelismCrud = new EvangelismCrud()
    private contactsCrud: ContactCrud = new ContactCrud()
    private notesCrud: NoteCrud = new NoteCrud()

    public getEvangelismRequests = async (req: Request, res: Response) => {
        const userId: number = req.params.UserId
        logger.log('info', `Retrieving evangelism requests for user ${userId}`)
        const evangelismRequests: Array<EvangelismRequest> = await this.crud.findRequestsByUserId(userId)
        logger.log('info', `Evangelism requests retrieved with succes for user ${userId}`)
        res.json({ data: { EvangelismRequests: evangelismRequests } })
    }

    public countEvangelismRequests = async (req: Request, res: Response) => {
        logger.log('info', `Counting all evangelism requests.`)
        const requestsNo = await this.crud.countAllEvangelismRequests()
        logger.log('info', `All evangelism requests were counted: ${requestsNo} requests in total`)
        res.json({ data: { Counter: requestsNo } })
    }

    public addAnonymousEvangelismRequest = async (req: Request, res: Response) => {
        const evangelismRequest: EvangelismRequest = req.body
        logger.log('info', `Adding new anonymous evangelism request`, evangelismRequest)
        evangelismRequest.UserId = 0
        const newRequest = await this.addRequest(evangelismRequest)
        logger.log('info', `New anonymous evangelism request ${newRequest.Id} added with succes`, evangelismRequest)
        return res.json({ data: { EvangelismRequest: newRequest } })
    }

    public addEvangelismRequest = async (req: Request, res: Response) => {
        const userId: number = req.params.UserId
        const evangelismRequest: EvangelismRequest = req.body
        logger.log('info', `Adding new evangelism request by userId[${userId}]`, evangelismRequest)
        evangelismRequest.UserId = userId
        const newRequest = await this.addRequest(evangelismRequest)
        logger.log('info', `New evangelism request ${newRequest.Id} created with succes by user[${userId}]`, evangelismRequest)
        return res.json({ data: { EvangelismRequest: newRequest } })
    }

    private addRequest = async (evangelismRequest: EvangelismRequest) => {
        const evangelismRequestId = await this.crud.addEvangelismRequest(evangelismRequest)
        const newContact: ContactCrudEntity = {
            UserId: evangelismRequest.UserId,
            ContactUserId: 0, // Arise4C User id = 0
            Type: 3, // some shit from rpc-server.php file, please kill Buhai for implementing these magic numbers
            Name: evangelismRequest.ApplicantName,
            Email: evangelismRequest.ApplicantEmail,
            Mobile: evangelismRequest.ApplicantPhone,
            Address: 'Not provided',
            Stage: 1, // more shit implemented by Buhai
            Details: `This evangelism request comes from mobile application. Contact details:
                      Name: ${evangelismRequest.ApplicantName || 'N/A'}
                      Email: ${evangelismRequest.ApplicantEmail || 'N/A'}
                      Mobile: ${evangelismRequest.ApplicantPhone || 'N/A'}`
        }
        const contactId = await this.contactsCrud.addContact(newContact)
        const newNote: NoteCrudEntity = {
            RelatedEntityId: contactId,
            RelatedEntityType: 'Contacts',
            UserId: 0, // Arise4C User id = 0
            Type: 1, // more shit implemented by Buhai. New = 1
            Private: 0, // more shit implemented by Buhai
            Note: `APPLICANT DETAILS:\n
                   Name: ${evangelismRequest.ApplicantName || 'N/A'}
                   Email: ${evangelismRequest.ApplicantEmail || 'N/A'}
                   Mobile: ${evangelismRequest.ApplicantPhone || 'N/A'}`
        }
        await this.notesCrud.addNote(newNote)
        const newRequest = await this.crud.findRequestById(evangelismRequestId)
        return newRequest
    }

    public deleteEvangelismRequest = async (req: Request, res: Response) => {
        const evangelismReqId: number = req.params.EvangelismRequestId
        logger.log('info', `Deleting evangelism request ${evangelismReqId}`)
        const deletedNo = await this.crud.deleteEvangelismRequest(evangelismReqId)
        if (deletedNo !== 1) {
            logger.log('warn', `There were ${deletedNo} database rows altered when deleting evangelism request ${evangelismReqId}.`)
        } else {
            logger.log('info', `Evangelism request ${evangelismReqId} deleted with succes`)
        }
        res.json({ data: { Deleted: deletedNo > 0 } })
    }

}