import data from "../data/Enchant.json";
import axios from "axios";
import { useEffect, useState } from "react";
import styles from "./GetCommand.module.css"
import React from 'react'

const GetCommand = () => {
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
  /**
   * Onchange function wich change the item name of the enchantments level
   * @param {React.FormEvent<HTMLFormElement>} e formulaire event
   */
  const handleChange = (e) => {
    e.target.id === "item"
      ? setItem(e.target.value)
      : setLevel(parseInt(e.target.value));
  };
  /**
   * add enchantments to the item u will want to give
   * @param {React.FormEvent<HTMLFormElement>} e formulaire event
   */
  const addEnchant = (e) => {
    e.preventDefault();
    if (
      !isNaN(level) &&
      list.every((elem) => elem.id !== e.target.select.value)
    ) {
      setlist(list.concat({ id: e.target.select.value, level: level }));
    }
  };

  const generateCommand = () => {
    if (allItem.some((elem) => elem.text_type === item)) {
      const str = `${list.map((x) => {
        console.log(list);
        return `{id:${x.id},lvl:${x.level}}`;
      })}`;
      setCommand(`/give @p ${item}{Enchantments:[${str}]}`);
    } else {
      console.log("wrong value");
    }
  };
 /** 
  * delete current clicked enchantements 
  * @param {Number} arg
  */

  const deleteEnchant = (arg) => {
    setlist(list.filter((x, i) => i !== arg));
  };

  const copyClipboard = () => {
    navigator.clipboard.writeText(command)
  };

  return (
    <div className={styles.getCommand}>
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
          <div className={styles.choiceList} key={i}>
            <p>{`enchant : ${elem.id} level : ${elem.level}`}</p>
            <button className={styles.delete} onClick={() => deleteEnchant(i)}>
              X
            </button>
          </div>
        );
      })}
      <button onClick={generateCommand}> generate command </button>
      <div>{command}</div>
      <button onClick={copyClipboard}>copy to clipboard</button>
    </div>
  );
};

export default GetCommand;
