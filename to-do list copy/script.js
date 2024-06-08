let months = {
    0: 'Jan',
    1: 'Feb',
    2: 'Mar',
    3: 'Apr',
    4: 'May',
    5: 'Jun',
    6: 'Jul',
    7: 'Aug',
    8: 'Sep',
    9: 'Oct',
    10: 'Nov',
    11: 'Dec'
}

window.onload = () =>{
    changeDate(new Date(Date.now()))
}

function handleDatePicker(ev){
    changeDate(new Date(ev.target.value))
}

function changeDate(dt){
    document.getElementById('datepicker_date').innerHTML = dt.getDate();
    document.getElementById('datepicker_month').innerHTML = months[dt.getMonth()];
    document.getElementById('datepicker_year').innerHTML = dt.getFullYear();
}


window.handleDatePicker = handleDatePicker;