import React from 'react'
import Button from '../Global/Button'
import TitleCard from '../Global/TitleCard'
import style from '../../Styles/home.module.css'

function Home() {

    const colors = ["Red","Green","Blue","Yellow","Cyan","Magenta","Black","Gray","Orange",
        "Purple","Pink","Brown","Lime","Indigo","Teal","Maroon","Navy","Olive","Silver","Gold"
    ];

    const helloWorldMessages = [
        "Hello, World!",          // English
        "¡Hola, Mundo!",              // Spanish
        "Bonjour, le monde!",         // French
        "Hallo, Welt!",               // German
        "你好，世界！",               // Chinese (Simplified)
        "こんにちは、世界！",          // Japanese
        "Привет, мир!",               // Russian
        "안녕하세요, 세계!",            // Korean
        "Ciao, mondo!",               // Italian
        "Olá, Mundo!",                // Portuguese
        "مرحبا بالعالم!",             // Arabic
        "नमस्ते दुनिया!"              // Hindi
    ];
    
  return (
    <div className={style.home_container}>
        <div>
            <TitleCard size="4"/>
            <div className={style.button_list}>
                <Button text="login"/>
                <Button text="create project"/>
            </div>
        </div>
    </div>
  )
}

export default Home