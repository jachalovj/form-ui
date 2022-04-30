const fs = require('fs');
const path = require('path');
const json2csv = require('json2csv');
const formDirPath = path.join(__dirname, '../database/form')

const fileTitle = {
    username: '提交人',
    phone: '手机号码',
    sex: '性别',
    ageGroup: '年龄段',
    ageRange: '年龄范围',
    interest: '意向',
    preference: '游戏偏好',
    note: '备注'
}

const submitForm = (data) => {
    try {
        fs.mkdirSync(formDirPath, { recursive: true })
        const fileName = new Date().toLocaleDateString().replace(/\//g, '-');
        const filePath = path.join(formDirPath, `${fileName}.csv`);
        const flag = fs.existsSync(filePath);

        const option = {
            fields: Object.values(fileTitle),
            newLine: '\r\n',
            header: !flag
        };
        const parser = new json2csv.Parser(option);

        const body = {}
        Object.keys(data).map(key => {
            body[fileTitle[key]] = data[key]
        })

        const json = parser.parse([body])
        if (!flag) fs.writeFileSync(filePath, json + '\r\n');
        else fs.appendFileSync(filePath, json + '\r\n');
    } catch (error) {
        throw(error);
    }
}

module.exports = {
    submitForm
}