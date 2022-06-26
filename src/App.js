import React from "react"
import './App.css';
import Die from './components/Die'
import {nanoid} from "nanoid"
import Confetti from 'react-confetti'
var count = 0;
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
      const localStorageCount = JSON.parse(localStorage.getItem('count'))
      if( localStorageCount === 0 || localStorageCount > count)
        localStorage.setItem('count', JSON.stringify(count));
    }

  }, [dice] )

// Roll non-Hold Dice
  function rollDice(){

    if(tenzies)
    {
        setDice(allNewDice())
        setTenzies(false)
        count = 0
    }
    else
    {
      setDice( oldDice => oldDice.map(die => die.isHeld ? die : {
        value: Math.floor(Math.random() * 6) + 1, 
        isHeld: false,
        id: nanoid()
      }));
      count++;
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
        {tenzies && (<div className="won">
                      <h4>You Won</h4>
                      <h5>Dice Rolls: {count} times</h5>
                      <h5>Best: {JSON.parse(localStorage.getItem('count'))} times</h5>
                    </div>
          )}
      </main>
  );
}

export default App;
