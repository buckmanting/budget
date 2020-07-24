import React, {useEffect, useState} from 'react';
import './App.css';

function App() {
    const [budget, setBudget] = useState(100);
    const [remaining, setRemaining] = useState(100);
    const [spend, setSpend] = useState(0);
    const [spendHistory, setSpendHistory] = useState([]);

    const handleSubmit = (evt) => {
        evt.preventDefault();
        setSpendHistory([...spendHistory, spend])
        setSpend(0);
    }

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        // Update the document title using the browser API
        // document.title = `You clicked ${spend} times`;
        if (spendHistory.length) {
            setRemaining(budget - spendHistory.reduce((total, curr) => total + curr));
        }
    });

    return (
        <div className="App">
            <p className="App-header">You've got about £
                <button className="budget-button--no-style">{remaining}</button>
                left
            </p>
            <form onSubmit={handleSubmit}
                  className="spend-form--extra-margin">
                <label className="spend-label--small" htmlFor="spend">
                    Spend
                </label>
                <input
                    type="number"
                    id="spend"
                    onChange={e => setSpend(e.target.value)}
                />
                <input type="submit" className="spend-button--no-style" value="Add"/>
            </form>
            <ol>
                {spendHistory.map((item) =>
                    <li>£{item}</li>
                )}
            </ol>
        </div>
    );
}

export default App;
