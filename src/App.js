import React from "react"
import './App.css';
import Die from './components/Die'
import {nanoid} from "nanoid"
import Confetti from 'react-confetti'

function App() {

  const [dice, setDice] = React.useState(allNewDice())  // Setting 10 Dices state

  const [tenzies, setTenzies] = React.useState(false) // Weather user won or not
  

  // Effect that runs when Die state change
  React.useEffect( () => {
    
    const allHeld = dice.every(die => die.isHeld)
    const firstVal = dice[0].value
    const allSameValue = dice.every(die => die.value === firstVal)

    if( allHeld && allSameValue)
    {
      setTenzies(true)
      console.log("You Won")
    }

  }, [dice] )

// Roll non-Hold Dice
  function rollDice(){

    if(tenzies)
    {
        setDice(allNewDice())
        setTenzies(false)
    }
    else
    {
      setDice( oldDice => oldDice.map(die => die.isHeld ? die : {
        value: Math.floor(Math.random() * 6) + 1, 
        isHeld: false,
        id: nanoid()
      }));
    }
  }

  // Roll 10 Dice
  function allNewDice(){

    const newDice=[]
    for(let i=0; i<10; i++){
      newDice.push({
        value: Math.floor(Math.random() * 6) + 1, 
        isHeld: false,
        id: nanoid()
      })
    }
    return newDice;
  }

  // This Func is pass to child ( Die.js ). It is used to toggle the value of isHeld
  function hold(id){
    setDice(oldDice => oldDice.map(die => die.id === id ? {...die, isHeld: !die.isHeld} : die))
  }
  
  // Rendering Die Elements
  const diceElements = dice.map(die => <Die key={die.id} id={die.id} value={die.value} isHeld={die.isHeld} handleClick={hold}/>)

  return (
      <main>
        {tenzies && <Confetti />}
        <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>

        <div className="dice-container">
          
          {diceElements}

        </div>
        <button className="roll-dice" onClick={rollDice}>{tenzies ? "New Game" : "Roll"}</button>
        {tenzies && <h4>You Won</h4>}
      </main>
  );
}

export default App;
