function displayError(error){
    let infoOut = document.getElementById("info-out");
    infoOut.innerHTML = error;
    infoOut.parentElement.classList.add("w3-panel", "w3-red", "w3-card");
    infoOut.hidden = false;
}

function parseJson(json){
    try{
        return JSON.parse(json);
    } catch(e){
        return null;
    }
}

function clearQuestion(){
    let qId = document.getElementById("qId");
    let answerBtn = document.getElementById("subAns");

    qId.removeAttribute("value");
    answerBtn.disabled = true;
}

function startQuiz(response){
    let question = document.getElementById("question");
    let solution = document.getElementById("solution");
    let qId = document.getElementById("qId");
    let answerBtn = document.getElementById("subAns");
    let points = document.getElementById("points");
    let infoOut = document.getElementById("info-out");
    let nameInput = document.getElementById("name");
        
    clearCanvas();
    solution.innerHTML = "";

    infoOut.textContent = "Hallo " + nameInput.value + ", hier ist deine Quizfrage. Viel Spass!";
    infoOut.parentElement.classList.remove("w3-panel", "w3-red", "w3-card");
    infoOut.hidden = false;
    points.textContent = response.points;
    qId.value = response.id;
    question.textContent = response.question;
    answerBtn.disabled = false;
}

function showResult(response){
    let solution = document.getElementById("solution");
    let points = document.getElementById("points");
    
    solution.textContent = response.solution;
    points.textContent = response.points;
    clearQuestion();
    drawResult(response.result, response.difficulty);
}

function clearCanvas(){
    let c = document.getElementById("result");
    let ctx = c.getContext("2d");

    clearTimeout(currentTimeout);
    ctx.clearRect(0, 0, 250, 150);
}

function drawResult(positive, change){
    let c = document.getElementById("result");
    let ctx = c.getContext("2d");

    ctx.fillStyle = positive ? "#32a852" : "#e04141";
    ctx.font = "56pt Helvetica";
    let sign = positive ? "+" : "-";
    ctx.fillText(sign + change, 30, 95);

    animate(ctx, positive);
}

let j = 0;
let currentTimeout = 0;
function animate(ctx, positive){
    currentTimeout = setTimeout(animate, 150, ctx, positive);
    j += positive ? -1 : 1;
    if(j == 5){
        j = 0;
    } else if (j == -1){
        j = 4;
    }

    ctx.clearRect(160, 0, 250, 150);

    ctx.lineWidth = 7;
    let y1 = positive ? 40 : 20;
    let y2 = positive ? 20 : 40;
    for(let i = 0; i < 5; i++){
        if(i == j){
            ctx.strokeStyle = positive ? "#32a852" : "#e04141";
        }else{
            ctx.strokeStyle = positive ? "#217036" : "#852828";
        }
        ctx.beginPath();
        ctx.moveTo(160, y1 + (i * 20));
        ctx.lineTo(180, y2 + (i * 20));
        ctx.lineTo(200, y1 + (i * 20));
        ctx.stroke();
    }
}