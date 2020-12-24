const fs = require('fs')
const urls = require('./urls')

function htmlRow (rank, metrics, info) {
  const website = metrics.url.replace(/^https?:\/\//, '').replace(/\/$/, '')
  const totalSize = metrics.totalSize
  const contentSize = metrics.contentSize
  const totalKB = (metrics.totalSize / 1024).toFixed(1)
  const contentKB = (metrics.contentSize / 1024).toFixed(1)
  const contentRatio = metrics.contentRatio.toFixed(0)
  return `  <tr class="data" id="data${rank}">
    <td class="rank">${rank}.</td>
    <td class="url"><a href="${metrics.url}" id="url${rank}">${website}</a></td>
    <td class="total" title="${totalSize} bytes">${totalKB}&nbsp;KB</td>
    <td class="content" title="${contentSize} bytes">${contentKB}&nbsp;KB</td>
    <td class="ratio">${contentRatio}%</td>
  </tr>
  <tr class="info" id="info${rank}">
    <td colspan="5">
      ${info}
    </td>
  </tr>\n`
}

function main () {
  const metrics = JSON.parse(fs.readFileSync('metrics.json'))
  const urlMap = {}
  for (const urlItem of urls) {
    urlMap[urlItem.url] = urlItem
  }

  let htmlRows = ''
  for (const [i, m] of metrics.metricsList.entries()) {
    htmlRows += htmlRow(i + 1, m, urlMap[m.url].info.trim())
  }
  console.log('htmlRows:\n', htmlRows)

  const template = fs.readFileSync('template.html', 'utf8')
  const output = eval('`' + template + '`') // eslint-disable-line no-eval
  fs.writeFileSync('index.html', output, 'utf8')
  console.log('Done rendering index.html')
}

main()
