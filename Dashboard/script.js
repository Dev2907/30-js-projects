import Quote from './../Quotes app/script.js'
import calender from '../Calender/script.js'

window.onload = async() => {
    let quoteGen = new QuoteBlock()
    quoteGen.loadQuote()
    let calenderObj = new calenderBlock()
    calenderObj.loadCalender()
}

class QuoteBlock{
    async loadQuote(){
        let quoteGen = new Quote()
        let quote = await quoteGen.fetch_quote()
        let quoteblock = document.querySelector(".quote")
        quoteblock.querySelector('.quoteTxt').innerHTML = quote['text']
        quoteblock.querySelector('.author').innerHTML = "-" + quote['author'].split(",")[0]
    }    
}

class calenderBlock{
    async loadCalender(){
        let calenderTable = document.getElementById("calender_table_body");
        let today = new Date(Date.now());
        window.month = today.getMonth();
        window.year = today.getFullYear();
        window.date = today.getDate();
        window.day = today.getDay();
        let calenderObj = new calender();
        await calenderObj.load_calender(calenderTable, window.year, window.month, window.date, window.day);
        let nextMonthCall = () => {
            if (window.month == 11) {
                window.year += 1
            }
            window.month = (window.month+1)%12;
            calenderObj.load_calender(calenderTable,window.year,window.month,window.date, window.day);
            document.getElementById("nextmonth").addEventListener('click', nextMonthCall)
            document.getElementById("prevmonth").addEventListener('click', prevMonthCall)
        }
        document.getElementById("nextmonth").addEventListener('click', nextMonthCall)
        
        let prevMonthCall = () => {
            if(window.month == 0) {
                window.year -= 1
                window.month = 11
            }else{
                window.month -= 1
            }
            calenderObj.load_calender(calenderTable,window.year,window.month,window.date,window.day);
            document.getElementById("prevmonth").addEventListener('click', prevMonthCall)
            document.getElementById("nextmonth").addEventListener('click', nextMonthCall)
        }
        document.getElementById("prevmonth").addEventListener('click', prevMonthCall)
    }
}