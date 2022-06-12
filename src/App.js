import React, { useCallback, useEffect, useMemo, useState } from "react";

import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [amount1, setAmount1] = useState("0");
  const [amount2, setAmount2] = useState("0");
  const [currency1, setCurrency1] = useState("UAH");
  const [currency2, setCurrency2] = useState("UAH");

  const rate = useMemo(() => {
    if (currency1 === currency2) {
      return 1;
    } else if (currency1 === "UAH" && currency2 === "USD") {
      return data[0].buy;
    } else if (currency1 === "UAH" && currency2 === "EUR") {
      return data[1].buy;
    } else if (currency1 === "USD" && currency2 === "UAH") {
      return data[0].buy;
    } else if (currency1 === "EUR" && currency2 === "UAH") {
      return data[1].buy;
    } else if (currency1 === "USD" && currency2 === "EUR") {
      return data[0].buy / data[1].buy;
    } else if (currency1 === "EUR" && currency2 === "USD") {
      return data[1].buy / data[0].buy;
    }
  }, [amount1, amount2, currency1, currency2]);

  useEffect(() => {
    fetch(`https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        return response.json();
      })
      .then((actualData) => {
        if (actualData !== "") {
          setLoading(false);
        }

        if (!loading) {
          setData(actualData);
        }
      })
      .catch((err) => {
        console.error(err.message);
      });
  }, [loading]);

  let calculate = useCallback(
    (part, value) => {
      switch (part) {
        case 1:
          if (value) {
            setAmount2(value * rate);
          } else {
            setAmount2(amount1 * rate);
          }
          break;

        case 2:
          if (value) {
            setAmount1(value / rate);
          } else {
            setAmount1(amount2 / rate);
          }
          break;

        default:
          break;
      }
    },
    [amount1, amount2, currency1, currency2, rate]
  );

  for (let key in data) {
    if (data[key].ccy === "USD") {
      document.getElementById("usdBuy").innerHTML = `
      <div>${data[key].ccy}</div>
      <div>
        buy: 
          <span>${Math.round(parseFloat(data[key].buy) * 100) / 100} ${
        data[key].base_ccy
      }</span> /
        sale:
          <span>${Math.round(parseFloat(data[key].sale) * 100) / 100} ${
        data[key].base_ccy
      }</span>
      </div>
      `;
    }
    if (data[key].ccy === "EUR") {
      document.getElementById("eurBuy").innerHTML = `
      <div>${data[key].ccy}</div>
      <div>
        buy: 
          <span>${Math.round(parseFloat(data[key].buy) * 100) / 100} ${
        data[key].base_ccy
      }</span> /
        sale:
          <span>${Math.round(parseFloat(data[key].sale) * 100) / 100} ${
        data[key].base_ccy
      }</span>
      </div>
      `;
    }
  }

  return (
    <div className="App">
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <div className="container">
          <header>
            <h4>Текущий курс:</h4>
            <div className="currentRate">
              <div id="usdBuy"></div>
              <div id="eurBuy"></div>
            </div>
          </header>

          <main>
            <div>
              <h4>Конвертер валют:</h4>
            </div>

            <div>
              <input
                type="number"
                value={amount1}
                onChange={(e) => {
                  setAmount1(e.target.value);
                  calculate(1, e.target.value);
                }}
              />
              <select
                id="selectField"
                defaultValue={currency1}
                onChange={(e) => {
                  setCurrency1(e.target.value);
                  calculate(1);
                }}
              >
                <option value="UAH">UAH</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>

              <input
                type="number"
                value={amount2}
                onChange={(e) => {
                  setAmount2(e.target.value);
                  calculate(2, e.target.value);
                }}
              />
              <select
                defaultValue={currency2}
                onChange={(e) => {
                  setCurrency2(e.target.value);
                  calculate(2);
                }}
              >
                <option value="UAH">UAH</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}

export default App;
