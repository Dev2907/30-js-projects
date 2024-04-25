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

window.onload = () => {
    let today = new Date(Date.now())
    window.table = document.getElementById("calender_table_body")
    window.month = today.getMonth()
    window.year = today.getFullYear()
    window.date = today.getDate()
    load_calender(table,window.year,window.month,window.date);
}

function _head(month,year){
    return `<tr class="fs-3">
    <td colspan="5">${month} ${year}</td>
    <td class="text-center" onclick="prevmonth()"> < </td>
    <td class="text-center" onclick="nextmonth()" > > </td>
    </tr>
    <tr class="text-center">
        <th>Sun</th>
        <th>Mon</th>
        <th>Tue</th>
        <th>Wed</th>
        <th>Thu</th>
        <th>Fri</th>
        <th>Sat</th>
    </tr>`
}

function load_calender(table,year,month,date){
    let cur_range = get_date_range(year,month);
    let prev_range = get_date_range(year,month-1);
    let day_1 = cur_range['first'][1]
    if(day_1 == 6 && date == cur_range['last'][0]){
        let view_month = month;
        let view_year = year;
        if (month == 11){
            view_month = 0
            view_year = year + 1
        }else{
            view_month = month + 1
        }
        load_calender(table,view_year,view_month,null)
        return
    }
    let today = new Date(Date.now())
    let box_to_skip = day_1
    let last_month_start_date = prev_range["last"][0] - box_to_skip + 1
    let last_month_end_date = prev_range["last"][0]
    let cur_month_last_date = cur_range["last"][0]
    let cur_month_start_date = cur_range["first"][0]
    let full_range = [[last_month_start_date,last_month_end_date],[cur_month_start_date,cur_month_last_date]]
    let phase = box_to_skip ? 0 : 1;
    let box_date = box_to_skip ? last_month_start_date : cur_month_start_date
    table.innerHTML = _head(months[month],year)
    for(let week = 0; week < 5 ; week+=1){
        let tr = document.createElement("tr")
        tr.classList.add("text-center")
        for(let day = 0; day < 7; day+=1){
            let td = document.createElement("td")
            if (phase == 0){
                td.classList.add("text-secondary")
                if (box_date == full_range[phase][1]+1){
                    phase = 1
                    box_date = 1
                    td.classList.remove("text-secondary");
                }
                if(!date && box_date == full_range[phase][1] && month == (today.getMonth()+1)%12 && year == today.getFullYear()){
                    td.classList.add("text-success")
                }
            }
            if(phase == 1) {
                if (box_date == full_range[phase][1]+1){
                    phase = 2
                    box_date = 1
                    td.classList.add("text-secondary")
                }else if(box_date == date && month == today.getMonth() && year == today.getFullYear()){
                    td.classList.add("text-success")
                }
            }
            td.innerHTML = box_date
            tr.appendChild(td)
            box_date += 1;
            if(phase == 2) {
                let day_rem = 6 - day
                while(day_rem>0){
                    td = document.createElement("td");
                    td.classList.add("text-secondary")
                    td.innerHTML = box_date
                    tr.appendChild(td)
                    box_date += 1
                    day_rem -= 1
                }
                break;
            }
        }
        table.appendChild(tr)
    }
}

function get_date_range(year,month){
    let cur_month_first = new Date(year,month,1)
    if(month == 11){
        month = 0
        year += 1
    }else{
        month += 1
    }
    let cur_month_last = new Date(year,month,0);
    let date_1 = parseInt(cur_month_first.getDate());
    let date_last = parseInt(cur_month_last.getDate());
    let day_1 = parseInt(cur_month_first.getDay());
    let day_last = parseInt(cur_month_last.getDay());
    return {"first":[date_1, day_1], "last":[date_last, day_last]};
}

async function nextmonth(){
    if (window.month == 11) {
        window.year += 1
    }
    window.month = (window.month+1)%12;
    load_calender(window.table,window.year,window.month,window.date);
}

async function prevmonth(){
    if(window.month == 0) {
        window.year -= 1
        window.month = 11
    }else{
        window.month -= 1
    }
    load_calender(window.table,window.year,window.month,window.date);
}

window.nextmonth = nextmonth
window.prevmonth = prevmonth