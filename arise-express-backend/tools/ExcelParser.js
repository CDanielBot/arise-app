var Excel = require('exceljs')
var sanitizeHtml = require('sanitize-html')
const fs = require('fs')

var jsonVerses = []
var workbook = new Excel.Workbook()
workbook.xlsx.readFile('VDCC-no-password.xlsx')
  .then(function () {
    var worksheet = workbook.getWorksheet('Bible')
    worksheet.eachRow(function (row) {
      var jsonRow = {}
      jsonRow.book = row.getCell(1).value
      jsonRow.chapter = row.getCell(2).value
      jsonRow.verse = row.getCell(3).value
      jsonRow.type = row.getCell(4).value == 'TTL' ? 'title' : 'content'
      var content = sanitizeHtml(row.getCell(5).value, { allowedTags: [] }).replace(/\*/g, '')
      jsonRow.text = content
      jsonVerses.push(jsonRow)
    })
    fs.writeFile('vdcc.json', JSON.stringify(jsonVerses), function () {
    })
  })