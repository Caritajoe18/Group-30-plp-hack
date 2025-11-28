import { useState } from 'react'
import './FakeCalculator.css'

function FakeCalculator() {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)

  const handleNumber = (num: string) => {
    setDisplay(display === '0' ? num : display + num)
  }

  const handleOperation = (op: string) => {
    const inputValue = parseFloat(display)
    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      let result = 0
      switch (operation) {
        case '+':
          result = currentValue + inputValue
          break
        case '-':
          result = currentValue - inputValue
          break
        case '*':
          result = currentValue * inputValue
          break
        case '/':
          result = currentValue / inputValue
          break
      }
      setDisplay(String(result))
      setPreviousValue(result)
    }
    setOperation(op)
    setDisplay('0')
  }

  const handleEqual = () => {
    const inputValue = parseFloat(display)
    if (operation && previousValue !== null) {
      let result = 0
      switch (operation) {
        case '+':
          result = previousValue + inputValue
          break
        case '-':
          result = previousValue - inputValue
          break
        case '*':
          result = previousValue * inputValue
          break
        case '/':
          result = previousValue / inputValue
          break
      }
      setDisplay(String(result))
      setPreviousValue(null)
      setOperation(null)
    }
  }

  const handleClear = () => {
    setDisplay('0')
    setPreviousValue(null)
    setOperation(null)
  }

  return (
    <div className="calculator">
      <div className="calculator-display">
        {display}
      </div>
      <div className="calculator-buttons">
        <button onClick={() => handleNumber('7')}>7</button>
        <button onClick={() => handleNumber('8')}>8</button>
        <button onClick={() => handleNumber('9')}>9</button>
        <button onClick={() => handleOperation('/')}>÷</button>

        <button onClick={() => handleNumber('4')}>4</button>
        <button onClick={() => handleNumber('5')}>5</button>
        <button onClick={() => handleNumber('6')}>6</button>
        <button onClick={() => handleOperation('*')}>×</button>

        <button onClick={() => handleNumber('1')}>1</button>
        <button onClick={() => handleNumber('2')}>2</button>
        <button onClick={() => handleNumber('3')}>3</button>
        <button onClick={() => handleOperation('-')}>−</button>

        <button onClick={() => handleNumber('0')}>0</button>
        <button onClick={handleClear}>C</button>
        <button onClick={handleEqual}>=</button>
        <button onClick={() => handleOperation('+')}>+</button>
      </div>
      <div className="calculator-info">
        <p>Calculator</p>
        <small>Quick calculations</small>
      </div>
    </div>
  )
}

export default FakeCalculator