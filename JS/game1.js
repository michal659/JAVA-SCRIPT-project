const MAX_MISTAKES = 9; 
let timerInterval; // משתנה שיכיל את פרטי התזמון של הטיימר
let timeRemaining = 180; // זמן התראה של 180 שניות
let score = 0; 
let names = ["ריקי", "גיננדל", "מיכל", "חני", "פייגי", "אפרת", "אילה", "שרית", "שירה",
    "ציפי", "חיה", "רחלי", "אביטל", "תמי", "שירי", "נועה", "נעמה", "מירי", "רחל", "יעלי", "שרה", "זהבה"]; 
let animals = ["שועל", "אריה","ליויתן","שור","אייל","ארנבת","חתול","כלב","חיפושית",
"סנאי","לביאה","עגל","זebra","קרנף","היפופוטם","סוס","חמור","איגואנה","דב","צב","פרה",
   "גדי","טלה","ברבור","חסידה","קוף","שימפנזה"]; 
let wordsArray; 
let choose = ""; 
let my_word = ""; 
let mistake = 0; 
// של התחל משחק מאפס את שקיפות התמונה
document.querySelector('.image-container').style.opacity = '0%';
// פונקציה שמחזירה את ניקוד המשתמש מתוך localStorage
function GetAllScore() {
    let users = JSON.parse(localStorage.getItem('Users')) || [];
    let [fname, lname] = localStorage.getItem('name').split(' '); // מפרק את השם המלא לשם פרטי ושם משפחה
    let password = localStorage.getItem('password'); 
    for (let u of users) { 
        if (u.myfname === fname && u.mylname === lname && u.mypassword === password) { 
            return u.score; // מחזיר את הניקוד של המשתמש
        }
    }
    return 0;
}
// פונקציה שמביאה את הזמן בצורה של "MM:SS"
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60); 
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`; 
}
// פונקציה שניה                           פונקציה שמתחילה את הטיימר
function startTimer() {
    const timerElement = document.querySelector('#timer'); 
    timerElement.style.visibility = 'visible';
    timerElement.textContent = formatTime(timeRemaining); // מעדכן את זמן ההתחלה
    timerInterval = setInterval(() => { 
        if (timeRemaining <= 0) {
            clearInterval(timerInterval); // מפסיק את הטיימר
            timerElement.textContent = '00:00'; 
            function showTimesUp() {
                const messageDiv = document.querySelector('#timesUpMessage'); 
                const timesUpSound = document.querySelector('#timesUpSound');
                messageDiv.style.display = 'block'; 
                timesUpSound.play(); 
                setTimeout(() => {
                    messageDiv.style.display = 'none'; 
                }, 9000);
            }
            setTimeout(showTimesUp, 0); 
        } else {
            timeRemaining--; 
            timerElement.textContent = formatTime(timeRemaining); // מעדכן את הזמן בטיימר
        }
    }, 1000);
}
//   פונקציה ראשונה                          בליחצה על כפתור ההתחלה
document.querySelector('#startButton').addEventListener('click', () => {
    startTimer(); // מתחיל את הטיימר
    startGame(); // מתחיל את המשחק
    createKeyboard(); // יוצר את מקשי המקלדת
});
//  טעינת הדף ומעדכן את הניקוד הכללי
window.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#allScoreText').textContent = `סה"כ נקודות: ${GetAllScore()}`; 
});
//  פונקציה שלישית                    פונקציה שמתחילה את המשחק החדש
function startGame() {
    document.querySelector("#word").innerHTML = ""; // מנקה את המילה הקודמת
    document.querySelector('#allScoreText').textContent = `סה"כ נקודות: ${GetAllScore()}`; // מעדכן את הניקוד הכללי
    const num = Math.floor(Math.random() * wordsArray.length); 
    choose = wordsArray[num]; 
    my_word = choose.replace(/\s/g, ""); // מסיר רווחים מהמילה לצורך בדיקה
    let length = choose.length;
    for (let i = 0; i < length; i++) {
        let sp = document.createElement("span"); // יוצר אלמנט חדש של span
        sp.classList.add('sp'); // מוסיף את הקלאס 'sp'
        if (choose[i] === " ") { 
            sp.innerHTML = "&nbsp;&nbsp;&nbsp;"; // מראה רווחים בתצוגה
        } else {
            sp.innerText = "_ "; 
        }
        document.querySelector("#word").appendChild(sp); 
    }
    enableKeyboard(); // מפעיל את המקלדת
}

// פונקציה רביעית                פונקציה שמאפשרת להשתמש בכל  במקלדת
function enableKeyboard() {
    let buttons = document.querySelectorAll(".letter"); // מביא את כפתורי המקלדת
    buttons.forEach(button => {
        button.disabled = false; // מאפשר את השימוש בכפתור
        button.style.backgroundColor = ""; // מסיר את צבע הרקע
    });
}
//  פונקציה חמישית          פונקציה שיוצרת את כפתורי המקלדת ומוסיפה  
function createKeyboard() {
    let buttons = document.querySelectorAll(".letter"); // מביא את כל כפתורי המקלדת
    buttons.forEach(button => {
        button.addEventListener("click", function (e) { //  ליחצה על כפתור
            let letter = e.currentTarget.dataset.value; // מביא את הערך של התו מהכפתור
            check(letter); // בודק אם התו נכון
            e.currentTarget.disabled = true; // מכבה את הכפתור לאחר הלחיצה
            e.currentTarget.style.backgroundColor = "lightgray"; // משנה את צבע הרקע של הכפתור
        });
    });
}
let index; // משתנה שיכיל את המיקום של התו במילה
//  פונקציה שישית            פונקציה שבודקת אם התו שנבחר נמצא במילה
function check(letter) {
    index = my_word.indexOf(letter); 
    if (index !== -1) {
        let spans = document.querySelector("#word").getElementsByTagName("span"); // מביא את כל ה-spans של המילה
        for (let i = 0; i < my_word.length; i++) {
            if (my_word[i] === letter) {
                spans[i].innerText = letter; // מעדכן את התו ב-span המתאים
            }
        }
        if (checkWin()) { // אם כל התווים נחשפו
            score++; 
            document.querySelector('#success').play();
            document.querySelector("#score").textContent = `נקודות: ${score}`; 
            let users = JSON.parse(localStorage.getItem('Users')) || []; 
            let [fname, lname] = localStorage.getItem('name').split(' '); 
            let password = localStorage.getItem('password'); 
            for (const u of users) { 
                if (u.myfname === fname && u.mylname === lname && u.mypassword === password) { 
                    u.score += 1;
                    allScore = u.score;
                    break; 
                }
            }
            document.querySelector('#allScoreText').textContent = `סה"כ נקודות: ${allScore}`; 
            localStorage.setItem('Users', JSON.stringify(users)); // שומר את רשימת המשתמשים עם הניקוד החדש
            setTimeout(() => {
                startGame();
            }, 1000);
        }
    } else { 
        mistake++;
        document.querySelector('#error').play();
        updateImage();
        if (mistake >= MAX_MISTAKES) { 
            function showGameOver() {
                let messageDiv = document.querySelector('#gameOverMessage'); 
                let gameOverSound = document.querySelector('#gameOverSound'); 
                messageDiv.style.display = 'block'; 
                gameOverSound.play();
                setTimeout(() => {
                    messageDiv.style.display = 'none';
                }, 5000);
            }
            setTimeout(showGameOver, 0);
            document.querySelector("#score").textContent = `נקודות: ${score}`; 
            let buttons = document.querySelectorAll(".letter"); // מביא את כל כפתורי המקלדת
            buttons.forEach(button => {
                button.disabled = true; 
                button.style.backgroundColor = "lightgray";
            });
            clearInterval(timerInterval); // מפסיק את הטיימר
        }
    }
}
//פונקציה שמינית     פונקציה שמעדכנת את התמונה בהתאם למספר הטעויות
function updateImage() {
    let imageElement = document.querySelector("#hangmanImage");
    if (mistake <= MAX_MISTAKES) { 
        imageElement.src = `../תמונות/${mistake}.jpg`;
    } else {
        imageElement.src = `../תמונות/${MAX_MISTAKES}.jpg`;
    }
}
// פונקציה שביעית           פונקציה שבודקת אם כל התווים במילה נחשפו
function checkWin() {
    let spans = document.querySelectorAll("#word span"); // מביא את כל ה-spans של המילה
    if (Array.from(spans).find(s => s.innerHTML == "_ ")) // אוסף של אלמנטים שיוצר מערך רגיל 
        return false; // לא ניצחת
    return true; // ניצחת
}
// מאזין ללחיצה על כפתור רמת הקושי 1
document.querySelector('#level1').addEventListener('click', () => {
    wordsArray = animals; 
    document.querySelector('.image-container').style.opacity = '100%'; // מראה את התמונה של רמת הקושי
    document.querySelector('#level2').style.opacity = '0%'; // מכבה את התמונה של רמת הקושי 2
});

// מאזין ללחיצה על כפתור רמת הקושי 2
document.querySelector('#level2').addEventListener('click', () => {
    wordsArray = names; 
    document.querySelector('.image-container').style.opacity = '100%'; // מראה את התמונה של רמת הקושי
    document.querySelector('#level1').style.opacity = '0%'; // מכבה את התמונה של רמת הקושי 1
});
