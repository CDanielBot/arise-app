import DbPool from '../../db/DatabasePool'
import { NoteCrudEntity } from './EvangelismRequest'

export default class NoteCrud {

  public async addNote(newNote: NoteCrudEntity): Promise<number> {
    return DbPool.insert('Notes', newNote)
  }
}