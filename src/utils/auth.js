const TokenKey = 'Admin-Token'
const Userdata = 'userdata'
const UserActivity = 'user-activity'


export function getToken() {
  return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token);
}

export function removeToken() {
  console.log('remove localStorage in auth.js');
  var setuserclick = {}
  var defaultTokenKey = ''
  localStorage.setItem(Userdata,JSON.stringify(setuserclick));
  localStorage.setItem(TokenKey,defaultTokenKey);
  localStorage.setItem('userclick',JSON.stringify(setuserclick));
  return true
}

export function getUserData() {
  return localStorage.getItem(Userdata)
}

export function setUserData(userdata) {
  return localStorage.setItem(Userdata, JSON.stringify(userdata))
}
if (!localStorage.getItem('userclick')){
  var setuserclick = {}
  localStorage.setItem('userclick', JSON.stringify(setuserclick));
}

export function setUserclick(setuserclick){
  return localStorage.setItem('userclick', JSON.stringify(setuserclick));
  //return Cookies.set(Userclick, setuserclick)
}

//setUserclick('{}')
export function getUserclick() {
  return localStorage.getItem('userclick')
  //return Cookies.get(Userclick)
}


if (!localStorage.getItem('qrcodescheme')){
  var setqrcodescheme = {}
  localStorage.setItem('qrcodescheme', JSON.stringify(setqrcodescheme));
}
export function setQrcodescheme(setqrcodescheme){
  return localStorage.setItem('qrcodescheme', JSON.stringify(setqrcodescheme));
  //return Cookies.set(Userclick, setuserclick)
}

//setUserclick('{}')
export function getQrcodescheme() {
  return localStorage.getItem('qrcodescheme')
  //return Cookies.get(Userclick)
}

export function getUserActivity() {
  return localStorage.getItem(UserActivity)
}

export function setUserActivity(useractivity) {
  return localStorage.setItem(UserActivity, JSON.stringify(useractivity))
}
//setUserActivity('{}')
