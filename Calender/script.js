window.onload = () => {
    let today = new Date(Date.now())
    window.table = document.getElementById("calender_table_body")
    window.month = today.getMonth()
    window.year = today.getFullYear()
    window.date = today.getDate()
    window.calenderObj = new calender(table,window.year,window.month,window.date,window.day);
    calenderObj.load_calender();
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
    constructor(table, year, month, date, day){
        this.table = table;
        this.year = year;
        this.month = month;
        this.date = date;
        this.day = day;
    }

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

    _head(day = this.day, month = this.month, year = this.year){
        return `
        <tr class="fs-4 calenderHeader">
            <td colspan="6" class="colorGreen text-start">
                ${day}, ${month} ${year}
            </td>
            <td>
                <i class="fs-5 fa-regular fa-pen-to-square colorBGrey"></i>
            </td>
        </tr>
        <tr class="colorBGrey">
            <td colspan=3 >
                <select class="calenderDropdown w-100">
                    <option id="month_0" value="1">January </option>
                    <option id="month_1" value="2">february</option>
                    <option id="month_2" value="3">March</option>
                    <option id="month_3" value="4">April</option>
                    <option id="month_4" value="5">May</option>
                    <option id="month_5" value="6">June</option>
                    <option id="month_6" value="7">July</option>
                    <option id="month_7" value="8">August</option>
                    <option id="month_8" value="9">September</option>
                    <option id="month_9" value="10">october</option>
                    <option id="month_10" value="11">November</option>
                    <option id="month_11" value="12">December</option>
                </select>
            </td>
            <td colspan=2></td>
            <td colspan=1 id="prevmonth"><</td>
            <td colspan=1 id="nextmonth">></td>
        </tr>
        <tr class="text-center">
            <th class="colorGreen">Sun</th>
            <th>Mon</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu</th>
            <th>Fri</th>
            <th>Sat</th>
        </tr>
        `
    }

    _onchangeMonth(ev){
        this.month = ev.target.selectedIndex
        this.load_calender()
    }
    
    load_calender(table = this.table, year = this.year, month = this.month, date = this.date, day = this.day){
        let dateRange = this.get_date_range(year, month);
        table.innerHTML = this._head(this.days[day],this.months[month],year)
        document.getElementById(`month_${month}`).setAttribute("selected", "selected")
        document.querySelector(".calenderDropdown").addEventListener("change",(ev) => this._onchangeMonth(ev))
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
                        if(boxDate == date){
                            let divparent = document.createElement("div")
                            let divchild = document.createElement("div");
                            divchild.innerHTML = boxDate
                            divchild.classList.add('calenderToday', 'rounded-circle', 'p-1');
                            divparent.classList.add("d-flex", 'justify-content-center', 'align-items-center')
                            divparent.appendChild(divchild)
                            td.appendChild(divparent)
                        }else{
                            td.innerHTML = boxDate;
                            if(day == 1) td.classList.add('colorGreen');
                        }
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