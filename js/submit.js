function submitQuiz(){
    if(validateName()){
        let xhr = new XMLHttpRequest();
        xhr.onerror = onError;
        xhr.ontimeout = onTimeout;
        xhr.onload = function(){
            let response = parseJson(xhr.responseText);
            if(xhr.status != 200){
                let er = "Bei der Verarbeitung ist ein Fehler aufgetreten: HTTP Status " + xhr.status;
                if(response){
                    er += " -> " + response.er;
                }
                displayError(er);
                return;
            }
            if(response){
                startQuiz(response);
            }else{
                displayError("Bei der Verarbeitung ist ein Fehler aufgetreten");
            }
        };
        let operationSelect = document.getElementById("operation");
        let difficultySelect = document.getElementById("difficulty");
        let nameInput = document.getElementById("name");
        let queryString = "operation=" + operationSelect.value + "&difficulty=" + difficultySelect.value + "&name=" + nameInput.value;
        xhr.open("GET", "backend.php?" + queryString, true);
        xhr.send();
    }
    return false;
}

function submitAnswer(){
    if(validateAnswer()){
        let xhr = new XMLHttpRequest();
        xhr.onerror = onError;
        xhr.ontimeout = onTimeout;
        xhr.onload = function(){
            let response = parseJson(xhr.responseText);
            if(xhr.status != 200){
                let er = "Bei der Verarbeitung ist ein Fehler aufgetreten: HTTP Status " + xhr.status;
                if(response){
                    er += " -> " + response.er;
                }
                displayError(er);
                return;
            }
            if(response){
                showResult(response);
            }else{
                displayError("Bei der Verarbeitung ist ein Fehler aufgetreten");
            }
        };
        let qId = document.getElementById("qId");
        if(qId.value){
            let answerInput = document.getElementById("answer");
            let queryString = "question=" + qId.value + "&answer=" + answerInput.value;
            xhr.open("GET", "backend.php?" + queryString, true);
            xhr.send();
        }else{
            displayError("Starten Sie zuerst das Quiz!");
        }
    }
    return false;
}

function onError(){
    displayError("Bei der Verarbeitung ist ein Fehler aufgetreten");
}

function onTimeout(){
    displayError("Zeitüberschreitung bei der Anfrage");
}