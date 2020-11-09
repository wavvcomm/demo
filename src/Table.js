import React, {Component} from 'react'
import { BiTrash, BiMessageAltDetail, BiPhone } from "react-icons/bi";

const TableBody = (props) => {
  const rows = props.numberData.map((row, index) => {
    return (
      <tr key={index}>
        <td>{row.number}</td>
        <td>{row.title}</td>
        <td>
            <button onClick={() => props.removeNumber(index)}><BiTrash/></button>
        </td>
        <td>
            <button onClick={() => props.textNumber(index)}><BiMessageAltDetail/></button>
        </td>
        <td>
            <button onClick={() => props.callNumber(index)}><BiPhone/></button>
        </td>
      </tr>
    )
  })

  return <tbody>{rows}</tbody>
}

const TableHeader = () => {
  return (
    <thead>
      <tr>
        <th>Number</th>
        <th>Title</th>
        <th>Remove</th>
        <th>Text</th>
        <th>Call</th>
      </tr>
    </thead>
  )
}

const Table = (props) => {
  const {numberData, removeNumber, textNumber, callNumber} = props

  return (
    <table>
      <TableHeader />
      <TableBody numberData={numberData} removeNumber={removeNumber} textNumber={textNumber} callNumber={callNumber} />
    </table>
  )
}

export default Table