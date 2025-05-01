<?php
parse_str($_SERVER['QUERY_STRING'], $params);

$conn = mysqli_connect("localhost", "root", "", "quiz");
if (!$conn){
    echo json_encode(['er' => "Internal server error: DB connection failed"]); 
    http_response_code(500);
    exit; 
}

if(isset($params["operation"]) && isset($params["difficulty"]) && isset($params["name"])){
    getQuestion($params["operation"], $params["difficulty"], $params["name"]);
}else if (isset($params["question"]) && isset($params["answer"])){
    getResult($params["question"], $params["answer"]);
}else{
    $error = ["er" => "Bad request: Params for a valid request are missing"];
    echo(json_encode($error));
    http_response_code(400);
}

mysqli_close($conn);

/**
 * Returns a random question based on the parameters the user selected.
 * It also returns the current points of the user or resets the points if a new user started the quiz
 */
function getQuestion($operation, $difficulty, $name){
    if($operation < 1 || $operation > 4){
        $error = ["er" => "Bad request: Invalid operation"];
    }else if ($difficulty < 1 || $difficulty > 3){
        $error = ["er" => "Bad request: Invalid difficulty"];
    }else if (!$name || strlen($name) < 3 || strlen($name) > 25){
        $error = ["er" => "Bad request: Name must be between 3 and 25 characters"];
    } 

    if(isset($error)){
        echo(json_encode($error));
        http_response_code(400);
        return;
    }

    if(!isset($_COOKIE['name']) || $_COOKIE['name'] != $name){
        setcookie("name", $name, time() + 3600);
        setcookie("points", 0, time() + 3600);
        $points = 0;
    }else if(!isset($_COOKIE['points'])){
        setcookie("points", 0, time() + 3600);
        $points = 0;
    }else{
        $points = $_COOKIE['points'];
    }

    global $conn;
    $query = "select id, question from question where type = ? and difficulty = ?";
    $stmt = mysqli_prepare($conn, $query);

    mysqli_stmt_bind_param($stmt, 'ii', $operation, $difficulty);

    mysqli_stmt_execute($stmt);
    $res = mysqli_stmt_get_result($stmt);

    if($res){
        $row_i = rand(1, mysqli_num_rows($res));

        for($i = 0; $i < $row_i; $i++){
            $row = mysqli_fetch_assoc($res);
        }
        
        if($row){
            $row['points'] = $points;
            echo(json_encode($row));
            http_response_code(200);
            return;
        }else{
            $error = ["er" => "Internal server error: Failed to fetch row"];
        }
    }else{
        $error = ["er" => "Internal server error: Failed to get result"];
    }

    if(isset($error)){
        echo(json_encode($error));
        http_response_code(500);
    }
}
/**
 * Checks the answer of the user and calculates the result which is then returned
 */
function getResult($question, $answer){
    if(!is_numeric($answer) || !preg_match("/^-?\d*\.?\d{0,3}$/", $answer)){
        $error = ["er" => "Bad request: Answer is not a valid number"]; 
    }else if(!$question){
        $error = ["er" => "Bad request: No active question"];
    }

    if(isset($error)){
        echo(json_encode($error));
        http_response_code(400);
        return;
    }

    global $conn;
    $query = "select solution, difficulty from question where id = ?";
    $stmt = mysqli_prepare($conn, $query);

    mysqli_stmt_bind_param($stmt, 'i', $question);

    mysqli_stmt_execute($stmt);
    $res = mysqli_stmt_get_result($stmt);

    if($res){
        $row = mysqli_fetch_assoc($res);
        
        if($row){
            $points = 0;
            if(isset($_COOKIE['points'])){
                $points = $_COOKIE['points'];
            }
            if($answer == $row['solution']){
                $row['result'] = true;
                $row['points'] = $points + $row['difficulty'];
            }else{
                $row['result'] = false;
                $row['points'] = $points - $row['difficulty'];
            }
            
            setcookie("points", $row['points'], time() + 3600);

            echo(json_encode($row));
            http_response_code(200);
            return;
        }else{
            $error = ["er" => "Internal server error: Failed to fetch row"];
        }
    }else{
        $error = ["er" => "Internal server error: Failed to get result"];
    }

    if(isset($error)){
        echo(json_encode($error));
        http_response_code(500);
    }
}
?>