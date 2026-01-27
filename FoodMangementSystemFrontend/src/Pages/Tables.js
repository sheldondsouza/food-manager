import React, { useEffect, useState } from 'react'
import Sidebar from '../Components/Sidebar'
import axios from 'axios';
import '../Pages/Table.css';
import { FaTrash } from 'react-icons/fa';
import { useRef } from 'react';
const Tables = () => {
  const [tables, setTables] = useState([]);
  const [showAddTableModal, setShowAddTableModal] = useState(false);
  const toggleAddTableModal = () => {
    setShowAddTableModal(!showAddTableModal);
  }
  const tableModalCloseRef = useRef(null);
  const handleClickOutside = (event) => {
    if (tableModalCloseRef.current && !tableModalCloseRef.current.contains(event.target)) {
      setShowAddTableModal(false);
    }
  }
  useEffect(() => {
    if (showAddTableModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAddTableModal]);

  const removeTable = async (tableId) => {
    try {
      console.log("Deleting table with ID:", tableId);

      await axios.delete(`http://localhost:5001/admin/tables/deleteTable/${tableId}`);
      console.log("Table deletion successful");

      const filteredTables = tables.filter(table => table._id.toString() !== tableId.toString());
      console.log("Filtered Tables (post-delete):", filteredTables);

      const updatedTables = filteredTables.map((table, index) => ({
        ...table,
        tableName: `Table ${index + 1 < 10 ? `0${index + 1}` : index + 1}`,
        tableNumber: index + 1
      }));
      console.log("Updated Tables to send to backend:", updatedTables);

      const response = await axios.put('http://localhost:5001/admin/tables/updateTableNumbers', {
        tables: updatedTables
      });
      console.log("Response from backend after updating table numbers:", response.data);

      const displayTables = updatedTables.map(table => ({
        ...table,
        tableNumber: table.tableNumber
      }));

      setTables(displayTables);
      alert("Table removed and numbers re-sequenced");

    } catch (error) {
      console.error("Error during table removal or renumbering:", error);
      alert("Something went wrong during deletion or updating numbers.");
      fetchTables();
    }
  };



  const fetchTables = async () => {
    try {
      const response = axios.get('http://localhost:5001/admin/tables/getAllTables').then((res) => res.data);
      const data = await response;

      console.log("Tables fetched:", data);
      if ((await response).status === 404) {
        console.warn("No tables found");
      }
      else {
        setTables(data);
      }

    }

    catch (error) {
      console.error("Error fetching tables:", error);
    }
  }
  useEffect(() => {
    fetchTables();
  }
    , []);

  const handleSearchTables = (event) => {
    if (!event.target.value) {
      fetchTables();

      return;
    }
    const searchQuery = event.target.value.toLowerCase();
    const filteredTables = tables.filter(table =>
      table.tableName.toLowerCase().includes(searchQuery) ||
      table.tableNumber.toString().includes(searchQuery)
    );
    handlesubmitSearch(filteredTables);
    console.log("Filtered tables:", filteredTables);

  }
  const handlesubmitSearch = async (filteredtables) => {
    try {
      const response = await axios.get('http://localhost:5001/admin/tables/searchTables', { query: filteredtables });
      console.log("Search results:", response.data);
      setTables(response.data);
    } catch (error) {
      console.error("Error searching tables:", error);
    }
    if (filteredtables.length === 0) {
      alert("No tables found matching your search criteria.");
    } else {
      setTables(filteredtables);
    }
  }
  return (
    <div  >
      <Sidebar />
      <div className='table-search-section'>
        <input type="text" placeholder="Search tables..." onChange={handleSearchTables} />

      </div>
      <div className="tables-container"  >

        <h1>Tables</h1>
        <div className="table-list">
          {tables.map((table) =>
            <div key={table._id} className="table-card">
              <h2> {table.tableName} </h2>
              <p>{table.tableNumber >= 10 ? table.tableNumber : `0${table.tableNumber}`}</p>
              <p id='table-count'>
                <span><img src='chair.png' alt="chair icon" /></span>
                {table.tablechaircount}
              </p>

              <button className="remove-table" onClick={() => removeTable(table._id)}><FaTrash /></button>
            </div>
          )}


          <div className='add-table-container'>
            <div className='add-table-wrapper'>
              <div className="add-table">
                <button onClick={toggleAddTableModal}>
                  <span>+</span>
                </button>

              </div>
              {showAddTableModal && (
                <div className="add-table-modal" ref={tableModalCloseRef}>
                  {/*(tables.length + 1).toString().padStart(2, '0') */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const tableName = e.target.tableName.value;
                      const chairsCount = e.target.chairsCount.value;

                      const newTable = {
                        id: (tables.length + 1).toString().padStart(2, '0'),
                        name: `Table ${tableName}`,
                        tableNumber: tables.length + 1,
                        chairsCount: parseInt(chairsCount, 10)
                      };

                      setTables([...tables, newTable]);
                      const serverdata = {
                        id: newTable.id,
                        name: ((newTable.tableNumber) > 10 ? `Table ${newTable.tableNumber}` : `Table 0${newTable.tableNumber}`) || tableName,
                        tableNumber: newTable.tableNumber,
                        chairsCount: parseInt(chairsCount, 10)
                      };
                      axios.post('http://localhost:5001/admin/tables/addTable', serverdata)
                        .then(response => {
                          console.log("Table added successfully:", response.data);
                          alert("Table added successfully");
                          fetchTables();
                        })
                        .catch(error => {
                          console.error("Error adding table:", error);
                        });

                      setShowAddTableModal(false);
                    }}
                  >
                    <label>Table name(optional)</label>
                    <input type="text" name="tableName" defaultValue={(tables.length + 1).toString().padStart(2, '0')} />


                    <label>Chair</label>
                    <select name="chairsCount" required>
                      <option value="4">4</option>
                      <option value="6">6</option>
                      <option value="8">8</option>
                      <option value="10">10</option>
                      <option value="12">12</option>
                      <option value="14">14</option>
                      <option value="16">16</option>
                      <option value="18">18</option>
                    </select>


                    <button type="submit">Create</button>

                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Tables