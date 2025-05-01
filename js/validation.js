function validateName(){
    let nameInput = document.getElementById("name");
    let nameError = document.getElementById("name-error");

    if(nameInput.value.length == 0){
        nameError.innerHTML = "Bitte geben Sie einen Namen ein";
        nameError.hidden = false;    
        return false;
    }else if(nameInput.value.length < 3 || nameInput.value.length > 25){
        nameError.innerHTML = "Länge des Namen muss zwischen 3 und 25 Zeichen sein";
        nameError.hidden = false;    
        return false;
    }else{
        nameError.hidden = true;
        return true;
    }
}

function validateAnswer(){
    let answerInput = document.getElementById("answer");
    let answerError = document.getElementById("answer-error");

    if(!answerInput.checkValidity()){
        answerError.innerHTML = "Bitte geben Sie eine Zahl mit maximal 3 Nachkommastellen ein";
        answerError.hidden = false;    
        return false;
    }else{
        answerError.hidden = true;
        return true;
    }
}