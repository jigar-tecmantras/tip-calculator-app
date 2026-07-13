import { useMemo, useState } from 'react';
import './App.css';

const PRESET_TIPS = [5, 10, 15, 20, 25];

function App() {
  const [bill, setBill] = useState('');
  const [tipPercent, setTipPercent] = useState('');
  const [people, setPeople] = useState('1');
  const [selectedPreset, setSelectedPreset] = useState(null);

  const billValue = parseFloat(bill) || 0;
  const tipValue = parseFloat(tipPercent) || 0;
  const peopleCount = parseInt(people, 10) || 0;

  const validationErrors = [];
  if (bill && billValue <= 0) {
    validationErrors.push('Bill amount must be greater than zero.');
  }
  if (tipPercent && tipValue < 0) {
    validationErrors.push('Tip percentage cannot be negative.');
  }
  if (people && peopleCount <= 0) {
    validationErrors.push('Number of people must be at least 1.');
  }

  const isValid = billValue > 0 && tipValue >= 0 && peopleCount > 0;

  const { totalTip, totalAmount, tipPerPerson, totalPerPerson } = useMemo(() => {
    if (!isValid) {
      return {
        totalTip: 0,
        totalAmount: 0,
        tipPerPerson: 0,
        totalPerPerson: 0,
      };
    }

    const totalTipCalc = (billValue * tipValue) / 100;
    const totalCalc = billValue + totalTipCalc;
    return {
      totalTip: totalTipCalc,
      totalAmount: totalCalc,
      tipPerPerson: totalTipCalc / peopleCount,
      totalPerPerson: totalCalc / peopleCount,
    };
  }, [billValue, tipValue, peopleCount, isValid]);

  const formatCurrency = (value) => value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const handleTipInput = (next) => {
    setTipPercent(next);
    if (selectedPreset !== null) {
      setSelectedPreset(null);
    }
  };

  const handlePresetClick = (preset) => {
    setTipPercent(preset.toString());
    setSelectedPreset(preset);
  };

  return (
    <div className="app-shell">
      <main className="calculator-card">
        <header>
          <p className="eyebrow">Tip Calculator</p>
          <h1>Shared bill breakdown</h1>
        </header>

        <section className="input-section">
          <label className="input-label">
            Bill amount
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={bill}
              onChange={(event) => setBill(event.target.value)}
            />
          </label>

          <label className="input-label">
            Tip percentage
            <input
              type="number"
              min="0"
              step="0.5"
              placeholder="15"
              value={tipPercent}
              onChange={(event) => handleTipInput(event.target.value)}
            />
          </label>

          <div className="preset-grid">
            {PRESET_TIPS.map((value) => (
              <button
                key={value}
                type="button"
                className={value === selectedPreset ? 'preset-btn selected' : 'preset-btn'}
                onClick={() => handlePresetClick(value)}
              >
                {value}%
              </button>
            ))}
          </div>

          <label className="input-label">
            Number of people
            <input
              type="number"
              min="1"
              step="1"
              placeholder="1"
              value={people}
              onChange={(event) => setPeople(event.target.value)}
            />
          </label>
        </section>

        {validationErrors.length > 0 && (
          <section className="validation">
            {validationErrors.map((error) => (
              <p key={error}>{error}</p>
            ))}
          </section>
        )}

        <section className="results">
          <div className="results-column">
            <p className="label">Tip amount</p>
            <p className="result value">${formatCurrency(totalTip)}</p>
            <span className="meta">${formatCurrency(tipPerPerson)} per person</span>
          </div>
          <div className="results-column">
            <p className="label">Total per person</p>
            <p className="result value">${formatCurrency(totalPerPerson)}</p>
            <span className="meta">${formatCurrency(totalAmount)} total</span>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
