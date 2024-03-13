window.onload = async function(){
    //Setup localStorage
    if(! localStorage.hasOwnProperty("cur_question_id")){
        localStorage.setItem("cur_question_id",JSON.stringify(0))
    }
    if (! localStorage.hasOwnProperty("is_done")){
        localStorage.setItem("is_done",JSON.stringify(false))
    }else{
        if (JSON.parse(localStorage.getItem("is_done"))){
            reset_quiz()
        }
    }

    if (! localStorage.hasOwnProperty("quiz")){
        load_quiz()
    }

    //load first question
    load_cur_question(Number(JSON.parse(localStorage.getItem('cur_question_id'))));
}

async function load_quiz(){
    localStorage.setItem("quiz",JSON.stringify([]))
    localStorage.setItem("is_done",JSON.stringify(false))
    let response = await fetch('./questions.xml');
    response = await response.text();
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(response, "text/xml");
    let questions = xmlDoc.querySelectorAll("question");
    let quiz=[]
    questions.forEach(question => {
        let q_text = question.querySelector('text').textContent;
        let options = [];
        question.querySelectorAll('options').forEach(option=>{
            options.push(option.textContent)
        })
        let answer = question.querySelector('answer').textContent;
        quiz.push({
            "q_text": q_text,
            "options": options,
            "answer": answer,
            "ans_selected": "random"
        })  
        localStorage.setItem('quiz',JSON.stringify(quiz));
    })
    load_cur_question(JSON.parse(localStorage.getItem("cur_question_id")))
}

function option_html(option, option_id, cur_ans){
    return `<div id="${option_id}" onclick="set_answer_selected(${option_id})" class="${cur_ans?"bg-success-subtle":""} border rounded border-dark p-2 my-3 shadow-sm">${option}</div>`
}

function load_cur_question(id){
    let cur_question = JSON.parse(localStorage.getItem('quiz'))[Number(id)];
    document.getElementById("q_text").innerHTML = cur_question.q_text;
    let html = ""
    for (let i=0; i<cur_question.options.length; i+=1){
        let is_selected = false;
        if (cur_question.ans_selected == i){
                is_selected = true
        }
        html += option_html(cur_question.options[i],i,is_selected) 
    }
    document.getElementById("options").innerHTML = html;
}

function next_question(){
    let id = Number(JSON.parse(localStorage.getItem("cur_question_id")));
    let quiz = JSON.parse(localStorage.getItem('quiz'));
    if (id<quiz.length-1){
        id+=1;
        load_cur_question(id);
        localStorage.setItem("cur_question_id",JSON.stringify(id));
    }
    if (id==quiz.length-1){
        document.getElementById("submit_but").classList.remove('hide')
        document.getElementById("submit_but").classList.add('d-flex')
    }
}

function prev_question(){
    let id = Number(JSON.parse(localStorage.getItem("cur_question_id")));
    let quiz = JSON.parse(localStorage.getItem('quiz'));
    if (id>0){
        id-=1;
        load_cur_question(id);
        localStorage.setItem("cur_question_id",JSON.stringify(id));
    }
    if (id==quiz.length-2){
        document.getElementById("submit_but").classList.add('hide')
        document.getElementById("submit_but").classList.remove('d-flex')
    }
}

function set_answer_selected(id){
    let cur_question = Number(JSON.parse(localStorage.getItem("cur_question_id")));
    if(! JSON.parse(localStorage.getItem("is_done"))){
        let quiz = JSON.parse(localStorage.getItem("quiz"));
        let prev_ans = quiz[cur_question]['ans_selected'];
        id = Number(id)
        if (prev_ans!= "random"){
            if (prev_ans!=id){
                let answer = document.getElementById(prev_ans);
                answer.classList.remove('bg-success-subtle')
            }
        }
        quiz[cur_question]['ans_selected'] = id
        localStorage.setItem("quiz",JSON.stringify(quiz));
        let answer = document.getElementById(`${id}`);
        answer.classList.add('bg-success-subtle');
    }
}

function submit_quiz(){
    localStorage.setItem("is_done", JSON.stringify(true));
    let quiz = JSON.parse(localStorage.getItem("quiz"));
    score = 0
    quiz.forEach(element => {
        if (element.answer == element.ans_selected) {
            score+=1
        }
    });
    score = score / quiz.length
    score *= 100
    let html = `<div>
                    <h3>Thank you</h3>
                </div>
                <div>
                    Your Score : <span>${score}%</span>
                </div>`
    document.getElementById('page').innerHTML = html;
    document.getElementById("load").classList.add("hide");
}

function reset_quiz(){
    localStorage.setItem("is_done",JSON.stringify(false));
    let quiz = JSON.parse(localStorage.getItem("quiz"));
    quiz.forEach(question=>{
        question.ans_selected = "random"
    });
    localStorage.setItem("quiz",JSON.stringify(quiz));
    localStorage.setItem("cur_question_id",JSON.stringify(0))
    load_cur_question(JSON.parse(localStorage.getItem("cur_question_id")));
}