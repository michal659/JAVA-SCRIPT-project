//signUp
//האלמנטים שנכנסו בטופס
let fname = document.querySelector('#fname'); 
let lname = document.querySelector('#lname'); 
let gmail = document.querySelector('#gmail'); 
let password = document.querySelector('#password');
let phone = document.querySelector('#phone'); 
// פונקציה לאימות הטופס
function validateForm(event) {
  
    event.preventDefault()
    // אם אחד מהתנאים לא מתקיים, מונע שליחה של הטופס
    if (!checkName(fname) || !checkName(lname) || !checkPassword(password) || !checkEmail()) {
        event.preventDefault(); // מונע את שליחת הטופס אם יש בעיות
        return false;
    }
    add(event); // אם הכל תקין, ממשיך לפונקציה להוספת המשתמש
}
// פונקציה לבדוק תקינות שם פרטי או משפחה
function checkName(obj) {
    for (let i = 0; i < obj.value.length; i++) {
        // בודק אם יש תו שהוא מספר
        if (!isNaN(parseInt(obj.value[i]))) {
            if (obj === document.querySelector('#fname')) {
                alert('הכנסת שם פרטי לא תקין'); 
            } else {
                alert('הכנסת שם משפחה לא תקין'); 
            }
            return false; // מחזיר false אם יש  מספר
        }
    }
    return true; // מחזיר true אם כל התווים תקינים
}
// פונקציה לבדוק תקינות סיסמה
function checkPassword(password) {
    //יש 4 דגלים לכל פרמטר ובדיקה האם הדגלים הם true
    let BigLetter = 0;
    let SmallLetter = 0; 
    let number = 0;
    let Special = 0;
    // בודק אם אורך הסיסמה בין 8 ל-16 תווים
    if (password.value.length < 8 || password.value.length > 16) {
        alert('סיסמתך יכולה להכיל בין 8-16 תוים'); 
        return false;
    }
    //  בודק את כל התווים בסיסמא ומחזיר האם היא סיסמא חזקה או לא
    for (let i = 0; i < password.value.length; i++) {
        if (password.value[i] >= 'A' && password.value[i] <= 'Z')
            BigLetter++;
        if (password.value[i] >= 'a' && password.value[i] <= 'z')
            SmallLetter++; 
        if (password.value[i] >= '0' && password.value[i] <= '9')
            number++; 
        if ((password.value[i] >= '!' && password.value[i] <= '/') || (password.value[i] >= ':' && password.value[i] <= '@') || (password.value[i] >= '[' && password.value[i] <= '.'))
            Special++;
        if (BigLetter && SmallLetter && number && Special) {
            return true; 
        }
    }
    // אם אחד מהדרישות לא מתקיימת
    if (!(BigLetter && SmallLetter && number && Special)) {
        alert('סיסמתך לא עונה על המבוקש ,הסיסמא צריכה להכיל :  מספר ,אות גדולה ,אות קטנה ותו'); 
        return false; 
    }
    return true;
}
// פונקציה לבדוק תקינות אימייל
function checkEmail() {
    if (!validateEmail(gmail.value)) {
        alert("המייל אינו תקין"); 
        return false;
    }
    return true; 
}
// פונקציה לבדוק תקינות אימייל עם ביטוי רגולרי
function validateEmail(email) {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ); // תבנית אימייל תקינה
}
// פונקציה להוספת משתמש חדש
function add(event) {
    event.preventDefault(); // מונע את שליחת הטופס באופן אוטומטי
    let flag = 1; // דגל לבדוק אם הסיסמה כבר קיימת
    let users = JSON.parse(localStorage.getItem('Users')) || []; // לוקח את המשתמשים שנשמרו ב-localStorage או יוצר מערך ריק אם אין
    for (let i = 0; i < users.length; i++) {
        if (users[i].mypassword === password.value) {
            alert('הסיסמא שהקשת כבר קיימת. אנא שנה סיסמא או התחבר'); 
            flag = 0; // משתנה דגל ל-0 אם הסיסמה קיימת
            return; 
        }
    }
    if (flag === 1) {
        const userData = { // יוצר אובייקט עם פרטי המשתמש
            myfname: fname.value,
            mylname: lname.value,
            mypassword: password.value,
            myphone: phone.value,
            mygmail: gmail.value,
            score: 0
        };
        users.unshift(userData); // מוסיף  את המשתמש החדש  לתחילת מערך המשתמשים
        localStorage.setItem('Users', JSON.stringify(users)); // שומר את המערך המעודכן ב-localStorage
        // שומר את הנתונים שם מלא ,סיסמא וניקוד בlocalStorage
        localStorage.setItem('name', userData.myfname + " " + userData.mylname); 
        localStorage.setItem('password', userData.mypassword); 
        localStorage.setItem('score', userData.score); 
        alert('Wonderful! Now you have an account'); 
        window.location.href = "./game1.html"; // מפנה לדף אחר לאחר ההצלחה
    }
}
//login
// פונקציה לבדוק את תקינות הדף להתחברות
function check2(e) {
    e.preventDefault()
    checkName(fname); 
    checkName(lname); 
    checkPassword(password);
}
// פונקציה לבדוק אם המשתמש קיים
function userExist(event) {
    console.log('exist');
    let firstName = fname; 
    let lastName = lname; 
    let userPw = password; 
    // לוקח את המשתמשים שנשמרו ב-localStorage או יוצר מערך ריק אם אין
    let users = JSON.parse(localStorage.getItem('Users')) || []; 
    //   מחפש את המשתמש המתאים במערך ומחזיר NULL או את האוביקט
    let user = users.find(u => u.myfname == firstName.value && u.mylname == lastName.value && u.mypassword == userPw.value); 
    // אם נמצא משתמש תואם
    if (user) {
        //localStorageשומר את השם המלא, סיסמא וניקוד ב
        localStorage.setItem('name', firstName.value + " " + lastName.value); 
        localStorage.setItem('password', userPw.value); 
        localStorage.setItem('score', user.score); 
        window.location.href = "game1.html"; // מפנה לדף אחר
    } else {
        alert("login not correct"); 
        event.preventDefault(); // מונע את שליחת הטופס
    }
}
// פונקצית  התאריך   DD/MM/YYYY
function getCurrentDate() {
    const currentDate = new Date(); // מקבל את התאריך הנוכחי
    const day = currentDate.getDate().toString().padStart(2, '0'); // מקבל את היום ומ
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // מקבל את החודש ומוודא שהוא בן שתי ספרות
    const year = currentDate.getFullYear(); // מקבל את השנה
    return `${day}/${month}/${year}`; // מחזיר את התאריך  DD/MM/YYYY
}
// מקבל את התאריך הנוכחי ומעדכן את התוכן עם ה-ID "date"
const date = getCurrentDate(); // מקבל את התאריך הנוכחי
document.querySelector("#date").innerHTML = date; // מעדכן עם ה-ID "date" עם התאריך הנוכחי
