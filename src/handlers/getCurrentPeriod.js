const getCurrentPeriod = () => {
    const monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov','Dec']
    const currentDT = new Date()
    let month = currentDT.getMonth() + 1
    if (month < 10) {
        month = '0' + month
    }
    
    const year = currentDT.getFullYear()
    const thisPeriod = `${month}/${year}`
    return thisPeriod
}

export default getCurrentPeriod;