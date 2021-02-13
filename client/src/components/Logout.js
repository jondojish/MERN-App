import React, {useState, useEffect} from 'react'
import logo from '../images/logo.png'
import '../css/style.css'
import axios from 'axios'


const Logout = (props) => {
    return (
        <form onSubmit={() => {
            props.setToken('')
            props.history.push('/')
        }}>
            <h1 id="header_text">Logout, {props.username}</h1>
            <button type="submit">Logout</button>
        </form>
    )
}

export default Logout







