// select html elements
let header=document.getElementById("header");
let start=document.getElementById("start");
let splashScreen=document.getElementById("splash-screen");
let examBody=document.getElementById("exam-body");
let examRules=document.getElementById("exam-rules");
let examQuestions=document.getElementById("exam-questions");
let levelNo=document.getElementById("level-no");
let btnNext=document.getElementById("btn-next");
let fail=document.getElementById("fail-sec");
let success=document.getElementById("Success-sec");
let question=document.getElementById("question");
let answers=document.getElementById("answers");
let theScore=document.getElementById('score');
let btnContinue=document.getElementById('btn-continue');
let countQuestions=document.getElementById('countQuestions');
let finalGrade=document.getElementById("final-grade");
let btnFail=document.getElementById("fail-btn");
let btnSuccess=document.getElementById("success-btn");

// variables
let i=0;
let score=0;
let flag=0;
let counter=1;
let retryCount=0;
let level1="level1";
let level2="level2";
let currentLevel = level1;

start.addEventListener("click",(e)=>{
    e.preventDefault();
    header.style.display="none"
    splashScreen.style.display="block";
    setTimeout(()=>{
        splashScreen.style.display="none";
        examBody.style.display="block";
    },3000);
})
btnSuccess.addEventListener("click",()=>{
    header.style.display="block";
    examBody.style.display="none";
})
btnFail.addEventListener("click",()=>{
    header.style.display="block";
    examBody.style.display="none";
})

btnNext.addEventListener("click",function(){
    examRules.style.display="none";
    examQuestions.style.display="block";
})
// Exam Data
let ExamLevel1=[
    {
        question:"What does HTML stand for?",
        choices:["Hyper Text Markup Language","High Text Machine Language","Hyperlinks and Text Markup Language","Home Tool Markup Language"],
        correct:0
    },
    {
        question:"Which tag creates a hyperlink?",
        choices:["<link>","<a>","<href>","<hyperlink>"],
        correct:1
    },
    {
        question:"Which tag displays an image?",
        choices:["<src>","<image>","<img>","<pic>"],
        correct:2
    },
    {
        question:"How do you create an ordered list?",
        choices:["<ul>","<li>","<list>","<ol>"],
        correct:3
    },
    {
        question:"Which tag is used to create a table row?",
        choices:["<td>","<th>","<tr>","<table>"],
        correct:2
    }
]
let ExamLevel2=[
    {
        question:"How do you write a comment in JavaScript?",
        choices:["<!-- comment -->","# comment","// comment","** comment **"],
        correct:2
    },
    {
        question:"Which symbol is used for strict equality?",
        choices:["==","===","!=","!=="],
        correct:1
    },
    {
        question:"How do you create a function in JavaScript?",
        choices:["func myFunc() {}","def myFunc() {}","create function myFunc() {}","function myFunc() {}"],
        correct:3
    },
    {
        question:"Which method adds an item to an array?",
        choices:[".push()",".add()",".append()",".insert()"],
        correct:0
    },
    {
        question:"What will Boolean(0) return?",
        choices:["true","false","0","undefined"],
        correct:1
    }   
]

function createButton(el,index,level){
    let button=document.createElement('button');
    button.classList.add('btn','btn-info','text-start');
    button.textContent=el;
    answers.appendChild(button);
    button.addEventListener("click",function(){
        checkAnswer(index,level,this) //wrap with function to be not called immediatly
    })
}
function loadQuestions(level){
    let q1=ExamLevel1[i];
    let ansArr1=q1.choices;
    let q2=ExamLevel2[i];
    let ansArr2=q2.choices;
    answers.innerHTML='';
    if(level==level1){
        question.innerHTML=q1.question;
        levelNo.textContent=1;
        ansArr1.forEach((el,index)=>{
            createButton(el,index,level);
        })
    }
    else{
        question.innerHTML=q2.question;
        levelNo.textContent=2;
        ansArr2.forEach((el,index)=>{
            createButton(el,index,level);
        })
    } 
    btnContinue.style.display = "none";
    flag=0;
}
function checkAnswer(index,level,btn){
  let correctAns=level==level1?ExamLevel1[i].correct:ExamLevel2[i].correct;
  if(!flag){ // to make sure that i click on button for one time 
    if(index===correctAns){
        btn.classList.add('correct-ans');
        theScore.innerHTML=++score;
    }
    else{
        btn.classList.add('wrong-ans');
        if(score==0){theScore.innerHTML=score;}
        else{theScore.innerHTML=--score;}
    } 
    btnContinue.style.display="block";
    flag=1;  
  } 
  else{
    Swal.fire({
        title: "You Already Choose the Answer",
        icon: "warning",
        draggable: true
    });
  }
}

function calcGrade(){
    let totalDegree = score;
    let percent = (totalDegree / 5) * 100;
    let grade = '';
    if (percent >= 90 && percent <= 100) grade = "Excellent";
    else if (percent >= 80) grade = "Very Good";
    else if (percent >= 70) grade = "Good";
    else if (percent >= 60) grade = "Pass";
    else if (percent >= 50) grade = "Weak";
    else grade = "Fail";

    return {percent,grade};
}
function reset(){
    i = 0;
    score=0;
    counter = 1;
    theScore.innerHTML=score;
    countQuestions.textContent = counter;            
}
btnContinue.addEventListener('click', function() {
    i++;
    counter++;
    let colorSucess = '#9be8bb';
    let colorFail = '#e59cb4';
    let result=calcGrade();
    let {percent,grade}=result;

    if (currentLevel === level1 && i < ExamLevel1.length) {
        countQuestions.textContent = counter;
        loadQuestions(level1);
    } 
    else if (currentLevel === level1 && i >= ExamLevel1.length) {
        // Handle Level 1 completion
        if (percent >= 60) {
            Swal.fire({
                title: `<h3>Your Grade is <span  style="color:${colorSucess}">${grade}</span> </h3>`,
                text:"🎉 You passed! Welcome to Level2.",
                icon: "success",
                confirmButtonText: 'OK'
            }).then(() => {
                // Switch to Level 2
                reset();
                currentLevel = level2;
                loadQuestions(level2);
            });
        } else {
            retryCount++;
            if (retryCount === 1) {
                Swal.fire({
                    title: `<h3>Your Grade is <span style="color:${colorFail}">${grade}</span></h3>`,
                    text: "❌ You failed! You have one more chance to retry Level1.",
                    icon: 'warning',
                    confirmButtonText: 'Retry'
                }).then(() => {
                    reset();
                    loadQuestions(level1);
                });
            } else {
                retryCount=0;
                fail.style.display = "flex";
                examQuestions.style.display = "none";
            }
        }
    } 
    else if (currentLevel === level2 && i < ExamLevel2.length) {
        countQuestions.textContent = counter;
        loadQuestions(level2);
    } 
    else if (currentLevel === level2 && i >= ExamLevel2.length) {
        if(percent>=60){
            finalGrade.innerHTML=grade;
            finalGrade.style.color=colorSucess;
            success.style.display="flex";
            examQuestions.style.display="none";
        }  
        else {
            retryCount++;
            if (retryCount === 1) {
                Swal.fire({
                    title: `<h3>Your Grade is <span style="color:${colorFail}">${grade}</span></h3>`,
                    text:"❌ You failed! You have one more chance to retry Level2.",
                    icon: 'warning',
                    confirmButtonText: 'Retry'
                }).then(() => {
                    reset();
                    loadQuestions(level2);
                });
            } else {
                fail.style.display = "flex";
                examQuestions.style.display = "none";
            }
        }  
    }
})
loadQuestions(level1);
