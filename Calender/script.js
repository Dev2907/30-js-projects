window.onload = () => {
    let today = new Date(Date.now())
    window.table = document.getElementById("calender_table_body")
    window.month = today.getMonth()
    window.year = today.getFullYear()
    window.date = today.getDate()
    window.calenderObj = new calender();
    calenderObj.load_calender(table,window.year,window.month,window.date);
    window.nextmonth = () => {
        if (window.month == 11) {
            window.year += 1
        }
        window.month = (window.month+1)%12;
        window.calenderObj.load_calender(window.table,window.year,window.month,window.date);
    }
    window.prevmonth = () => {
        if(window.month == 0) {
            window.year -= 1
            window.month = 11
        }else{
            window.month -= 1
        }
        window.calenderObj.load_calender(window.table,window.year,window.month,window.date);
    }
}

class calender{
    months = {
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
    days = {
        0: 'Sun',
        1: 'Mon',
        2: 'Tue',
        3: 'Wed',
        4: 'Thu',
        5: 'Fri',
        6: 'Sat'
    }

    _head(day,month,year){
        return `
        <tr class="fs-4 calenderHeader">
            <td colspan="4">
                ${day}, ${month} ${year}
            </td>
            <td></td>
            <td></td>
            <td>
                <i class="fs-5 colorBGrey fa-regular fa-pen-to-square"></i>
            </td>
        </tr>
        <tr class="colorBGrey">
            <td colspan=2>
                <select class="calenderDropdown">
                    <option value="1">January</option>
                    <option value="2">february</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">october</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                </select>
            </td>
            <td colspan=3></td>
            <td colspan=1 id="prevmonth"><</td>
            <td colspan=1 id="nextmonth">></td>
        </tr>
        <tr class="text-center">
            <th>Sun</th>
            <th>Mon</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu</th>
            <th>Fri</th>
            <th>Sat</th>
        </tr>
        `
    }
    
    load_calender(table,year,month,date,day){
        let dateRange = this.get_date_range(year, month);
        table.innerHTML = this._head(this.days[day],this.months[month],year)
        let boxDate = 1;
        let boxToSkip = dateRange['first'][1];
        let lastDate = dateRange['last'][0]
        for(let week = 1; week < 7; week+=1){
            let tr = document.createElement("tr")
            tr.classList.add("text-center")
            for(let day = 1; day < 8; day+=1){
                let td = document.createElement("td")
                if(!boxToSkip){
                    if(boxDate <= lastDate){
                        td.innerHTML = boxDate;
                    }
                    boxDate++;
                }else{
                    boxToSkip--;
                }
                tr.appendChild(td)
            }
            table.appendChild(tr)
        }
    }
    
    get_date_range(year,month){
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
}

export default calender