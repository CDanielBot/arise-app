import { SQLite } from 'expo'

const db = SQLite.openDatabase(`bible.db`)

const onError = (error) => {
  console.log('sqlite error occured: ' + error)
}

export const isVersionLoaded = (activeVersion) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(`create table if not exists Bible_${activeVersion} ( \
              id integer primary key not null, \
              book int, \
              chapter int, \
              verse int, \
              type text, \
              content text \
          );`)
      tx.executeSql(`select count(id) as counter from Bible_${activeVersion};`, (tx, results) => {
        resolve(results.rows.item(0).counter > 0)
      })
    },
      onError)
  })
}

export const loadVerses = (activeVersion, bibleVerses) => {
  const bibleRows = bibleVerses.map(verse => { [verse.book, verse.chapter, verse.verse, verse.type, verse.text] })
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(`insert into Bible_${activeVersion} (book, chapter, verse, type, content) values (?);`, [bibleRows])
    },
      onError,
      () => { resolve() }
    )
  })
}

export const getBookVerses = (activeVersion, activeBook, activeChapter) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(`select * from Bible_${activeVersion} where book = ? and chapter = ?;`, [activeBook, activeChapter], (tx, results) => {
        resolve(results.rows.array)
      })
    }, onError)
  })
}
