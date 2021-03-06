import {useEffect, useState} from 'react';
import {BAN_DAYS, HOST} from '../common/constants.js';
import {FaTrashAlt, FaBan} from "react-icons/fa";
import {useHistory} from 'react-router-dom';

const Users = () => {
  const history = useHistory();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch(`${HOST}/users`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${localStorage.getItem('token')}`
      },    
    })
    .then(res => res.json())
    .then(data => setUsers(data))
    .then(() => setLoading(false))
    .catch(() => history.push('/500'));
  }, [history]);

  useEffect(() => {
    setFilteredUsers(users.filter(user => {
      return user.username.toLowerCase().includes(search.toLowerCase())
    }));
  }, [search, users]);

  let foundUsers = filteredUsers;

  const Loader = () => <div className="Loader"></div>;

  const showLoader = () => {
    if (loading) {
      return <Loader />
    }
  };

  const updateUser = (i, userId, prop, value)=> {
    let user = {...users[i], [prop]: value}

    fetch(`${HOST}/users/${userId}/update`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(user)
    })
    .then(res => res.json())
    .then(data => users[i] = data)
    .then(()=> setLoading(false))
    .catch(() => history.push('/500'));

    users[i]=user;
    const updatedUsers = [...users];
    setUsers(updatedUsers);
  };

  const deleteUser = (id) => {
    fetch(`${HOST}/users/${id}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${localStorage.getItem('token')}`
      },
    })
    .then((res) => res.json())
    .then(() => setUsers(users.filter(u => u.users_id !== id)))
    .catch(() => history.push('/500'));
  };

  const displayUsers = foundUsers.map((user, i) => {
    return (
      <tbody key={user.users_id}>
        <tr style={{outline: '#202027 thin solid'}}>
          <td>{user.username}</td>
          <td>{user.first_name} {user.last_name}</td>
          <td>{user.email}</td>
          <td>{user.user_age}</td>
          <td>
            <div className="inline-td">
              {user.ban_date ?
                <p className="ban-date">Banned until: {new Date(user.ban_date).toLocaleDateString()}</p> 
              :
                <button className="ban-btn-users" onClick={() => updateUser(i, user.users_id, 'ban_date', new Date(new Date().getTime() + BAN_DAYS))}><FaBan/></button>
              }
              <button className="delete-btn-users" onClick={() => deleteUser(user.users_id)}><FaTrashAlt/></button>
            </div>
          </td>
        </tr>
      </tbody>
    )
  });

  return(
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
      <section className="genre-section">
        <div className="boxContainer">
          <table className = "elementsContainer">
            <tbody><tr>
              <td>
                <input type="text" placeholder="search by username" className="search" onChange={e => setSearch(e.target.value)}/>
              </td>
              <td>
                <>
                  <i className="material-icons">search</i>
                </>
              </td>
            </tr></tbody>
          </table>
        </div>
      </section>
      <br/>
      <div className="songs-container-main-section">
        {showLoader()}
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th colSpan="5">List of Users</th>
              </tr>
            </thead>
            {displayUsers}
          </table>
        </div>
      </div>
    </>
  )
};

export default Users;
