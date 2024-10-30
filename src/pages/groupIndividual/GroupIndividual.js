import { useParams } from 'react-router-dom';
import './groupIndividual.scss';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig';
import Login from '../login/Login';
import Modal from '../../components/modal/Modal';
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import Loading from '../../components/Loading/Loading';


const GroupIndividual = () => {
  const [user, setUser] = useState(null);
  const [placename, setPlacename] = useState('');
  const [group, setGroup] = useState([]);
  const { groupId } = useParams();

  
  const [isGroupLoading, setIsGroupLoading] = useState(false);
  
  const [checkList, setCheckList] = useState(group?.checkList || []);
  const [expenses, setExpenses] = useState(group?.expenses || []);
  const [showAddPlaceModal, setShowAddPlaceModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [expenseName, setExpenseName] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenseCost, setExpenseCost] = useState('');
  const [expenseSpentBy, setExpenseSpentBy] = useState('');
  const [expenseIncludedUsers, setExpenseIncludedUsers] = useState([]);
  const [totalTripCost, setTotalTripCost] = useState(0);
  
  useEffect(() => {

    setTotalTripCost(expenses.reduce((sum, expense) => sum + parseFloat(expense.expenseCost || 0), 0));

  }, [expenses]);

  useEffect(() => {
    setIsGroupLoading(true);
    // Fetch the group data by ID when the component mounts
    const fetchGroupData = async () => {
      const fetchedGroup = await fetchGroupById(groupId);
      setGroup(fetchedGroup);
      setCheckList(fetchedGroup.checkList);
      setExpenses(fetchedGroup.expenses);
      setIsGroupLoading(false);
    };
    fetchGroupData();
  }, [groupId]); // Depend on groupId instead of group

  const fetchGroupById = async (groupId) => {
    try {
      const docRef = doc(db, 'travelGroups', groupId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { groupId: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    } catch (error) {
      // console.error("Error fetching document:", error);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLoginSuccess = () => {
    setUser(auth.currentUser);
  };

  const handleCheckboxChange = async (place) => {
    const updatedCheckList = checkList.map(item =>
      item.name === place.name ? { ...item, checked: !item.checked } : item
    );
    setCheckList(updatedCheckList);
  
    // Update Firebase with the updated checkList
    try {
      const groupDocRef = doc(db, 'travelGroups', groupId);
      await updateDoc(groupDocRef, {
        checkList: updatedCheckList,
      });
    } catch (error) {
      // console.error("Error updating checkbox state in Firebase:", error);
    }
  };
  
  // Helper function to calculate each user's financials
  const calculateUserFinancials = (userName) => {
    let numberOfUsers = group.groupUsers.length;

    let amountSpent = 0;
    let totalAmountOwedToOthers = 0;
    let totalAmountOwedToUser = 0;
    let amountsOwedDetails = {};

    // Initialize amounts owed details for tracking
    group.groupUsers.forEach((user) => {
      if (user.name !== userName) {
        amountsOwedDetails[user.name] = { owedTo: 0, owedFrom: 0 };
      }
    });

    // Calculate expenses
    expenses.forEach((expense) => {
      const sharePerUser = expense.cost / numberOfUsers;

      // If this user paid for the expense, calculate how much others owe them
      if (expense.paidBy === userName) {
        amountSpent += expense.cost;
        group.groupUsers.forEach((user) => {
          if (user.name !== userName) {
            amountsOwedDetails[user.name].owedFrom += sharePerUser;
            totalAmountOwedToUser += sharePerUser;
          }
        });
      } else {
        // If another user paid for the expense, calculate how much this user owes
        if (userName !== expense.paidBy) {
          amountsOwedDetails[expense.paidBy].owedTo += sharePerUser;
          totalAmountOwedToOthers += sharePerUser;
        }
      }
    });

    // Calculate the net balance for the current user
    const amountGetBack = totalAmountOwedToUser - totalAmountOwedToOthers;

    // Format the amounts owed details
    const getBackDetails = Object.entries(amountsOwedDetails)
      .map(([user, { owedTo, owedFrom }]) => ({
        from: user,
        amountOwedTo: owedTo.toFixed(3),
        amountOwedFrom: owedFrom.toFixed(3),
        netAmount: (owedFrom - owedTo).toFixed(3)
      }))
      .filter(({ netAmount }) => netAmount !== "0.000");

    return {
      tripBudget: totalTripCost / numberOfUsers,
      amountSpent,
      amountGetBack,
      getBackDetails
    };
  };

  const handleDeletePlace = async (place) => {
    const confirmDeletePlace = window.confirm("Are you sure you want to delete this place?");
    if (!confirmDeletePlace) return;

    const updatedCheckList = checkList.filter(item => item !== place);
    setCheckList(updatedCheckList);

    // Update Firebase by removing the place
    try {
      const groupDocRef = doc(db, 'travelGroups', groupId);
      await updateDoc(groupDocRef, {
        checkList: arrayRemove(place),
      });
    } catch (error) {
      // console.error("Error removing place from Firebase:", error);
    }

  };

  const handleDeleteExpense = async (expenseId) => {
    const confirmDeleteExpense = window.confirm("Are you sure you want to delete this expense?");
    if (!confirmDeleteExpense) return;

    const updatedExpenses = expenses.filter(expense => expense.expenseId !== expenseId);
    setExpenses(updatedExpenses);
    // Update Firebase by removing the expense
    try {
      const groupDocRef = doc(db, 'travelGroups', groupId);
      await updateDoc(groupDocRef, { expenses: updatedExpenses });
    } catch (error) {
      console.error("Error removing expense from Firebase:", error);
    }
    
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setExpenseName(expense.expenseName);
    setExpenseDescription(expense.expenseDescription);
    setExpenseCost(expense.expenseCost);
    setExpenseSpentBy(expense.expenseSpentBy);
    setExpenseIncludedUsers(expense.peopleIncluded);
    setShowAddExpenseModal(true);
  };

  const addPlacehandle = async () => {
    const newPlace = { name: placename, checked: false };
    const updatedCheckList = [...checkList, newPlace];
    setCheckList(updatedCheckList);
    setShowAddPlaceModal(false);
    setPlacename('');

    // Update Firebase with the new place
    try {
      const groupDocRef = doc(db, 'travelGroups', groupId);
      await updateDoc(groupDocRef, {
        checkList: arrayUnion(newPlace),
      });
    } catch (error) {
      // console.error("Error adding place to Firebase:", error);
    }
  };

  const addExpensehandle = async () => {
    try {
      const groupDocRef = doc(db, 'travelGroups', groupId);
  
      if (editingExpense) {
        // Update existing expense
        const updatedExpenses = expenses.map(exp =>
          exp.expenseId === editingExpense.expenseId
            ? {
                ...exp,
                expenseName,
                expenseDescription,
                expenseCost,
                expenseSpentBy,
                peopleIncluded: expenseIncludedUsers
              }
            : exp
        );
        setExpenses(updatedExpenses);
  
        // Update the expense in Firebase
        await updateDoc(groupDocRef, {
          expenses: updatedExpenses
        });
      } else {
        // Add new expense
        const newExpense = {
          expenseId: Date.now().toString(),
          expenseName,
          expenseDescription,
          expenseCost,
          expenseSpentBy,
          peopleIncluded: expenseIncludedUsers
        };
        setExpenses([...expenses, newExpense]);
  
        // Add new expense to Firebase
        await updateDoc(groupDocRef, {
          expenses: arrayUnion(newExpense)
        });
      }
  
      // Reset form and state
      setEditingExpense(null);
      setExpenseName('');
      setExpenseDescription('');
      setExpenseCost('');
      setExpenseSpentBy('');
      setExpenseIncludedUsers([]);
      setShowAddExpenseModal(false);
  
    } catch (error) {
      // console.error("Error updating expenses in Firebase:", error);
    }
  };

  const handleIncludedUserChange = (user) => {
    const updatedIncludedUsers = expenseIncludedUsers.includes(user)
      ? expenseIncludedUsers.filter(u => u !== user)
      : [...expenseIncludedUsers, user];
    setExpenseIncludedUsers(updatedIncludedUsers);
  };

  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  if(isGroupLoading){
    return <Loading />;
  }

  if (!group || group.length < 1) {
    return <p>Group not found.</p>;
  }

  return (
    <div className="group-page">
      <h2>{group?.groupName}</h2>
      <p>Group ID: {group?.groupId}</p>
      {/* this is a sagregated sum of all costs of expenses */}
      <p>Total Trip Budget : {totalTripCost}</p> 
      {/* <p>Your Trip Budget : 200</p> */}
      {/* <p>Your get a total amount : 200</p> */}
      {/* {group?.groupUsers.map(user => {
        const { tripBudget, amountSpent, amountGetBack, getBackDetails } = calculateUserFinancials(user.name);
        return(
          <p key={user.email}>Your need to pay amount : {amountGetBack} to {user.email}</p>
        )}
      )} */}
      <h3>Users:</h3>

      <div className="user-tags">
        {group?.groupUsers.map(user => (
          <span key={user.email} className="user-tag">{user.email}</span>
        ))}
      </div>

      <h3>Places to Visit:</h3>
      <button className='btn-primary' onClick={() => setShowAddPlaceModal(true)}>Add new place</button>
      <div className="checklist">
        {checkList.length > 0 && checkList.map(place => (
          <div key={place.name} className="checklist-item">
            <label>
              <input
                type="checkbox"
                onChange={() => handleCheckboxChange(place)}
                checked={place.checked}
              />
              {place.name}
            </label>
            <button className="delete-button" onClick={() => handleDeletePlace(place)}>
              🗑️
            </button>
          </div>
        ))}
      </div>

      <section>
        <h3>Expenses:</h3>
        
        <button className='btn-primary' onClick={() => setShowAddExpenseModal(true)}>Add expense</button>

        {expenses.length > 0 &&
          <table className="expense-table">
            <thead>
              <tr>
                <th>Expense Name</th>
                <th>Description</th>
                <th>Cost</th>
                <th>Spent By</th>
                <th>Included</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(expense => (
                <tr key={expense.expenseId} className="expense-item">
                  <td>{expense.expenseName}</td>
                  <td>{expense.expenseDescription}</td>
                  <td>INR {expense.expenseCost}</td>
                  <td>{expense.expenseSpentBy}</td>
                  <td>{expense.peopleIncluded.join(', ')}</td>
                  <td>
                    <button className="edit-button" onClick={() => handleEditExpense(expense)}>
                      ✏️
                    </button>
                    <button className="delete-button" onClick={() => handleDeleteExpense(expense.expenseId)}>
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      </section>

      {/* Modals for Adding and Editing Place and Expense */}
      <Modal show={showAddPlaceModal} onClose={() => setShowAddPlaceModal(false)} title="Add New Place">
        <input 
          name='placename'
          type='text'
          placeholder='Enter Place'
          value={placename}
          onChange={e => setPlacename(e.target.value)}
        />
        <button className='btn-primary' onClick={addPlacehandle}>Add</button>
      </Modal>

      <Modal show={showAddExpenseModal} onClose={() => setShowAddExpenseModal(false)} title={editingExpense ? "Edit Expense" : "Add New Expense"}>
        <input 
          name='expensename'
          type='text'
          placeholder='Enter Expense name'
          value={expenseName}
          onChange={e => setExpenseName(e.target.value)}
        />
        <textarea 
          placeholder='Expense details'
          value={expenseDescription}
          onChange={e => setExpenseDescription(e.target.value)}
        ></textarea>
        <input 
          name='expensecost'
          type='number'
          placeholder='Enter Expense cost'
          value={expenseCost}
          onChange={e => setExpenseCost(e.target.value)}
        />
        <select
          value={expenseSpentBy}
          onChange={e => setExpenseSpentBy(e.target.value)}
        >
          <option value="">Select user</option>
          {group?.groupUsers.map(user => (
            <option key={user.email} value={user.email}>{user.email}</option>
          ))}x``
        </select>
        <div className='selectUsers'>
          {group?.groupUsers.map(user => (
            <div key={user.email} className='flex align-items-center'>
              <input
                type='checkbox'
                checked={expenseIncludedUsers.includes(user.email)}
                onChange={() => handleIncludedUserChange(user.email)}
              />
              {user.email}
            </div>
          ))}
        </div>
        <button className='btn-primary' onClick={addExpensehandle}>
          {editingExpense ? "Update Expense" : "Add Expense"}
        </button>
      </Modal>
    </div>
  );
};

export default GroupIndividual;
