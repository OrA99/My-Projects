const table = document.querySelector('.table')
function handleSubmit(ev){
    ev.preventDefault()
    const rows = ev.target.elements.TxtRows.valueAsNumber;
    const columns = ev.target.elements.TxtColumns.valueAsNumber;



    for(let i = 1; i<=rows; i++){
        const tr = document.createElement('tr')
        table.appendChild(tr)
        const rowsIndex = i

        for(let j = 1; j<=columns; j++){
            const td = document.createElement('td')
            tr.appendChild(td)
            const columnsIndex = j
            const text = rowsIndex*columnsIndex
            const p = document.createElement('p')
            td.appendChild(p)
            p.innerText = text
        }
    }
}