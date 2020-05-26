import React, { useState, useEffect, useRef } from 'react';
import FlashcardList from './FlashcardList';
import './App.css'
import axios from 'axios'
import logo from './test.png'

function App() {
  const [flashcards, setFlashcards] = useState(Sample)
  const [categories, setCategories] = useState([])

  const categoryEl = useRef()
  const amountEl = useRef()

  useEffect(() => {
    axios
      .get('https://opentdb.com/api_category.php')
      .then(res => {
        setCategories(res.data.trivia_categories)
      })
  }, [])

  useEffect(() => {
   
  }, [])

  function decodeString(str) {
    const textArea = document.createElement('textarea')
    textArea.innerHTML= str
    return textArea.value
  }

  function handleSubmit(e) {
    e.preventDefault()
    axios
    .get('https://opentdb.com/api.php', {
      params: {
        amount: amountEl.current.value,
        category: categoryEl.current.value
      }
    })
    .then(res => {
      setFlashcards(res.data.results.map((questionItem, index) => {
        const answer = decodeString(questionItem.correct_answer)
        const options = [
          ...questionItem.incorrect_answers.map(a => decodeString(a)),
          answer
        ]
        return {
          id: `${index}-${Date.now()}`,
          question: decodeString(questionItem.question),
          answer: answer,
          options: options.sort(() => Math.random() - .5)
        }
      }))
    })
  }

  return (
    <>
      <form className="header row" onSubmit={handleSubmit}>
          <div className="row logo">
            <div className="col-12 col-md">
              <center> <img src={logo} height="120px" /> </center>
            </div>
          </div>
         
          <div className="form-group form-control">
            <label htmlFor="category"><strong>Category</strong></label>
            <select id="category" ref={categoryEl}>
              {categories.map(category => {
                return <option value={category.id} key={category.id}>{category.name}</option>
              })}
            </select>
          </div>
          <div className="form-group form-control">
            <label htmlFor="amount"><strong>Number of Questions</strong></label>
            <input type="number" id="amount" min="2" max="50" step="1" defaultValue={10} ref={amountEl} />
          </div>
          <div className="form-group form-control">
            <button className="btn btn-primary">Generate</button>
          </div>
        </form>
    

        <div className="container">
          <FlashcardList flashcards={flashcards} />
        </div>
    </>
  );
}

const Sample = [
  {
    id: 1,
    question: `This is a Sample Question, Please tap on the flashcard to check the answer:------------------------ What's my Roll no. ? `,
    answer: '18CS04 . Great!, Now Select the category you want and start testing your knowledge.',
    options:[
      '18CS04', '18CSE', '18CS', '18CS4'
    ]
  }
]
export default App;