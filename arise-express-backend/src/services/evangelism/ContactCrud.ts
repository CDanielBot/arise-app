import DbPool from '../../db/DatabasePool'
import { ContactCrudEntity } from './EvangelismRequest'

export default class ContactCrud {

  public async addContact(newContact: ContactCrudEntity): Promise<number> {
    return DbPool.insert('Contacts', newContact)
  }
}