import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import GroupCard from '../../components/groupCard/GroupCard';
import Modal from '../../components/modal/Modal';
import './homepage.scss';
import { AuthContext } from '../../context/authContext';

const Homepage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [groupUsers, setGroupUsers] = useState('');
  const [editingGroup, setEditingGroup] = useState(null);

  useEffect(() => {
    fetchGroups();
  }, [isLoggedIn]);

  const fetchGroups = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'travelGroups'));
      const fetchedGroups = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        groupId: doc.id
      }));
      setGroups(fetchedGroups);
      console.log(fetchedGroups);
      console.log(fetchedGroups.length);
    } catch (error) {
      console.error('Error fetching groups: ', error);
    }
  };

  const handleAddGroup = () => {
    setShowAddGroupModal(true);
    setGroupName('');
    setGroupUsers('');
  };

  const submitAddGroup = async () => {
    if (!groupName) {
      alert('Group name is required');
      return;
    }
  
    if (groups.some(group => group.groupName === groupName)) {
      alert('A group with the same name already exists.');
      return;
    }
  
    try {
      const newGroup = {
        groupName: groupName,
        groupUsers: groupUsers.split(',').map(user => user.trim()), // Split users by commas and trim whitespace
        createdAt: new Date(),
        checkList: [],
        expenses: [],
      };
  
      console.log(newGroup);
      // Add the new group to Firebase
      await addDoc(collection(db, 'travelGroups'), newGroup);
  
      // Update the groups state with the new group
      setGroups([...groups, { ...newGroup, groupId: newGroup.id }]);
      
      // Reset modal state
      setShowAddGroupModal(false);
      setGroupName('');
      setGroupUsers('');
    } catch (error) {
      console.error('Error adding new group: ', error);
      alert('An error occurred while adding the group.');
    }
  };
  

  return (
    <>
      <div className='addGroupSection'>
        <button className='btn-primary' onClick={handleAddGroup}>Add New Group</button>
      </div>

      <div className="flex flex-wrap w-100 g-20">
        {groups.length > 0 && groups.map((group) => (
          <GroupCard
            key={group.groupId}
            groupDetails={group}
            setShowAddGroupModal={setShowAddGroupModal}
          />
        ))}
      </div>

      <Modal
        show={showAddGroupModal}
        onClose={() => setShowAddGroupModal(false)}
        title={editingGroup ? "Edit Group" : "Add New Group"}
      >
        <input
          name="Group Name"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <input
          name="Group Users"
          placeholder="Enter users, separated by commas"
          value={groupUsers}
          onChange={(e) => setGroupUsers(e.target.value)}
        />
        <button className='btn-primary' onClick={submitAddGroup}>
          {editingGroup ? "Update Group" : "Add"}
        </button>
      </Modal>
    </>
  );
};

export default Homepage;
