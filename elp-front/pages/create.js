// pages/create.js
import Navbar from "../components/Navbar";
import HeaderBar from "@/components/Headerbar";
import { useState } from "react";
import styles from '../styles/Create.module.css';

export default function Create() {
  const [columns, setColumns] = useState([]);
  const [newColumn, setNewColumn] = useState({
    name: "",
    type: "INT",
    maxLength: "",
    autoIncrement: false,
    defaultValue: "",
    foreignKey: false,
    nullable: false,
    unique: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewColumn((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddColumn = () => {
    setColumns([...columns, newColumn]);
    setNewColumn({
      name: "",
      type: "INT",
      maxLength: "",
      autoIncrement: false,
      defaultValue: "",
      foreignKey: false,
      nullable: false,
      unique: false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/create-table", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ columns }),
    });
    const data = await response.json();
    alert(data.message);
  };

  return (
    <div>
      <HeaderBar />
      <div className={styles.container}>
        <Navbar />
        <div className={styles.content}>
          <h1>Créer une nouvelle table</h1>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Nom de la colonne</label>
              <input
                type="text"
                name="name"
                value={newColumn.name}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Type</label>
              <select
                name="type"
                value={newColumn.type}
                onChange={handleChange}
                className={styles.input}
              >
                <option value="INT">INT</option>
                <option value="VARCHAR">VARCHAR</option>
                <option value="TEXT">TEXT</option>
                <option value="DATE">DATE</option>
              </select>
            </div>
            {(newColumn.type === 'VARCHAR' || newColumn.type === 'TEXT') && (
              <div className={styles.formGroup}>
                <label>Nombre de caractères max.</label>
                <input
                  type="number"
                  name="maxLength"
                  value={newColumn.maxLength}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>
            )}
            <div className={styles.formGroup}>
              <label>Valeur par défaut</label>
              <input
                type="text"
                name="defaultValue"
                value={newColumn.defaultValue}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.checkboxContainer}>
              <div className={styles.formGroup}>
                <label>AI</label>
                <input
                  type="checkbox"
                  name="autoIncrement"
                  checked={newColumn.autoIncrement}
                  onChange={handleChange}
                  className={styles.checkbox}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Clé étrangère</label>
                <input
                  type="checkbox"
                  name="foreignKey"
                  checked={newColumn.foreignKey}
                  onChange={handleChange}
                  className={styles.checkbox}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Nullable</label>
                <input
                  type="checkbox"
                  name="nullable"
                  checked={newColumn.nullable}
                  onChange={handleChange}
                  className={styles.checkbox}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Unique</label>
                <input
                  type="checkbox"
                  name="unique"
                  checked={newColumn.unique}
                  onChange={handleChange}
                  className={styles.checkbox}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleAddColumn}
              className={styles.button}
            >
              Ajouter la colonne
            </button>
            <button type="submit" className={styles.button}>
              Créer la table
            </button>
          </form>
          <div className={styles.tablePreview}>
            <h2>Prévisualisation de la table</h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nom de la colonne</th>
                  <th>Type</th>
                  <th>Nombre de caractères max.</th>
                  <th>Auto-increment</th>
                  <th>Valeur par défaut</th>
                  <th>Clé étrangère</th>
                  <th>Nullable</th>
                  <th>Unique</th>
                </tr>
              </thead>
              <tbody>
                {columns.map((col, index) => (
                  <tr key={index}>
                    <td>{col.name}</td>
                    <td>{col.type}</td>
                    <td>{col.maxLength}</td>
                    <td>{col.autoIncrement ? "Oui" : "Non"}</td>
                    <td>{col.defaultValue}</td>
                    <td>{col.foreignKey ? "Oui" : "Non"}</td>
                    <td>{col.nullable ? "Oui" : "Non"}</td>
                    <td>{col.unique ? "Oui" : "Non"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
