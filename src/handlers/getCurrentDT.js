const getCurrentDT = (mode) => {
    const user = kintone.getLoginUser(); 
    const currentDT = new Date(); 
    const userInput = { dt: currentDT, mode: mode}
   console.log(userInput);
   console.log('this-user', user);
   return userInput
  }

export default getCurrentDT;