import "./App.css";
import data from "./data/Enchant.json";
import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [command, setCommand] = useState("");
  const [level, setLevel] = useState(null);
  const [list, setlist] = useState([]);
  const [item, setItem] = useState("");
  const [allItem, setAllItem] = useState([]);

  useEffect(() => {
    axios
      .get("https://minecraft-ids.grahamedgecombe.com/items.json")
      .then((res) => {
        setAllItem(res.data);
      });
    if (localStorage.getItem("list")) {
      setlist(JSON.parse(localStorage.getItem("list")));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);

  const handleChange = (e) => {
    e.target.id === "item"
      ? setItem(e.target.value)
      : setLevel(parseInt(e.target.value));
  };

  const addEnchant = (e) => {
    console.log(list)
    e.preventDefault();
    if (typeof level === "number" && list.every( elem => elem.id !== e.target.select.value)) {
      let tab = list.concat({ id: e.target.select.value, level: level });
      setlist(tab);
    }
  };

  const generateCommand = () => {
    if (
      allItem.some((elem) => elem.text_type === item) &&
      typeof level === "number"
    ) {
      const str = `${list.map((x) => {
        return `{id:${x.id},lvl:${level}}`;
      })}`;
      setCommand(`/give @p ${item}{Enchantments:[${str}]}`);
    } else {
      console.log("wrong value");
    }
  };

  const deleteEnchant = (arg) => {
    setlist(list.filter((x, i) => i !== arg));
  };
  return (
    <div className="App">
      <input
        onChange={(e) => {
          handleChange(e);
        }}
        name="item"
        id="item"
        placeholder="item"
      />
      <input
        onChange={(e) => {
          handleChange(e);
        }}
        name="level"
        id="level"
        placeholder="level"
      />
      {Object.keys(data).map((elem, i) => {
        return (
          <div key={i}>
            <form onSubmit={(e) => addEnchant(e)}>
              <p>{elem}</p>
              <select id="select">
                {data[elem].map((option, j) => {
                  return <option key={j}>{option}</option>;
                })}
              </select>
              <button key={i} type="submit">
                add enchant
              </button>
            </form>
          </div>
        );
      })}
      {list.map((elem, i) => {
        return (
          <div className="choice-list" key={i}>
            <p>{`enchant : ${elem.id} level : ${elem.level}`}</p>
            <button className="delete" onClick={() => deleteEnchant(i)}>
              X
            </button>
          </div>
        );
      })}
      <button onClick={generateCommand}> generate command </button>
      <div>{command}</div>
    </div>
  );
}

export default App;
