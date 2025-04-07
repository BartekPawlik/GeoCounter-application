import React from "react";


function UserPanel({
    addNewUser,
    handleKeyDown,
    setNewUser,
    userActive,
    newUser,
    userData,
    deleteUsers,
  }) {
    return (
      <div className="users-container">
        <div className="button-container">
          <button onClick={addNewUser}>users</button>
        </div>
        {userActive && (
          <div className="user-box">
            <div className="add-user-container">
              <h4>Lista</h4>
              <input
                value={newUser}
                placeholder="Dodaj"
                onChange={(e) => setNewUser(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className="user-list">
              {userData.map((item) => (
                <div key={item.id} className="user-container">
                  <p>{item.name}</p>
                  <button onClick={() => deleteUsers(item.id)}>x</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  export default UserPanel