import React from 'react'

/**
 * Component to display table
 * @param {*} props for table data and type(appointments or event schedule)
 * @returns Table with data 
 */
function Table(props) {
    const {tablecolumns,tablerows, tableType} = props
   
    return (
        <table className={`${tableType}`}>
          <thead>
            <tr>
              {tablecolumns.map((column, index) => (
                <th key={index}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tablerows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {tablecolumns.map((column, colIndex) => (
                  <td key={colIndex}>{row[column]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
}

export default Table