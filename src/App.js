import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

const Button = ({ children, onClick }) => {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
};

const App = () => {
  const [showaddfriend, setShowaddfriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedfriend, Setselectedfriend] = useState(null);

  const handleShowForm = () => {
    setShowaddfriend((show) => !show);
  };

  const handleAddFriend = (friend) => {
    setFriends((friends) => [...friends, friend]);
    setShowaddfriend(false);
  };

  const handleSelection = (friend) => {
    //Setselectedfriend(friend);
    Setselectedfriend((curr) => (curr?.id === friend.id ? null : friend));
    setShowaddfriend(false);
  };

  const handleSplitBill = (value) => {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedfriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );

    Setselectedfriend(null);
  };
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          onSelectFriend={handleSelection}
          selectedfriend={selectedfriend}
        />
        {showaddfriend && <FormAddFriend onAddfriend={handleAddFriend} />}
        <Button onClick={handleShowForm}>
          {showaddfriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedfriend && (
        <FormSplitBill
          selectedfriend={selectedfriend}
          onHandleSplit={handleSplitBill}
        />
      )}
    </div>
  );
};

const FriendList = ({ friends, onSelectFriend, selectedfriend }) => {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          onSelectFriend={onSelectFriend}
          selectedfriend={selectedfriend}
        />
      ))}
    </ul>
  );
};

const Friend = ({ friend, onSelectFriend, selectedfriend }) => {
  const isSelected = selectedfriend?.id === friend.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}$
        </p>
      )}

      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}$
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button onClick={() => onSelectFriend(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
};

const FormAddFriend = ({ onAddfriend }) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  const handleSubmit = (e) => {
    e.preventDefault();

    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    onAddfriend(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  };

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👯‍♀️Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>🎆Image Url</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button onClick={handleSubmit}>Add</Button>
    </form>
  );
};

const FormSplitBill = ({ selectedfriend, onHandleSplit }) => {
  const [bill, setBill] = useState("");
  const [userexpense, setUserexpense] = useState("");
  const friendsExpense = bill - userexpense;
  const [payingby, setPayingby] = useState("user");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!bill || !userexpense) return;
    onHandleSplit(payingby === "user" ? friendsExpense : -userexpense);
  };

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedfriend.name}</h2>

      <label>💲 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>🕺 Your Expense</label>
      <input
        type="text"
        value={userexpense}
        onChange={(e) =>
          setUserexpense(
            Number(e.target.value) > bill ? userexpense : Number(e.target.value)
          )
        }
      />

      <label>👫 {selectedfriend.name}'s Expense</label>
      <input type="text" disabled value={friendsExpense} />

      <label>Who is paying the bill</label>
      <select value={payingby} onChange={(e) => setPayingby(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedfriend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
};

export default App;
