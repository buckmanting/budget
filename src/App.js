import React, {useEffect, useState} from 'react';
import './App.css';

function App() {
    const [budget, setBudget] = useState(100);
    const [remaining, setRemaining] = useState(budget);
    const [spend, setSpend] = useState(0);
    const [spendHistory, setSpendHistory] = useState([]);

    const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};

    const handleSubmit = (evt) => {
        evt.preventDefault();
        setSpendHistory([...spendHistory, {
            value: Number.parseInt(spend),
            date: Date.now()
        }])
        setSpend(0);
    }

    useEffect(() => {
        setRemaining(budget - spendHistory.reduce((a, b) => {
            return b.value == null ? a : a + b.value;
        }, 0));
        // save the budget here
    });

    return (
        <div className="App">
            <p className="App-header">
                You've got about £{remaining} left
            </p>
            <form onSubmit={handleSubmit}>
                <label className="spend-label--small" htmlFor="spend">
                    Spend
                </label>
                <input
                    type="number"
                    id="spend"
                    value={spend}
                    onChange={e => setSpend(e.target.value)}
                />
                <input type="submit" className="spend-button--no-style" value="Add"/>
            </form>

            <p>
                <button onClick={() => alert('i should do something')}>Configure</button>
            </p>

            <ol>
                {spendHistory.map((item, key) =>
                    <li key={item.date}>{new Date(item.date).toLocaleString('en-GB', options)} - £{item.value}</li>
                )}
            </ol>
        </div>
    );
}

export default App;
