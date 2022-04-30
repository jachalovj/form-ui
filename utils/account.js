const fs = require('fs');
const path = require('path');
const accountPath = path.join(__dirname, '../database/account')

const getAccountList = () => {
    const accountList = fs.readFileSync(accountPath, 'utf-8');
    return accountList.split('\n');
}

const registAccount = ({ username, password }) => {
    fs.appendFileSync(accountPath, `${username}:${password}\n`, 'utf-8')
}

module.exports = {
    getAccountList,
    registAccount
}