import { useContext, useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import GroupCard from '../../components/groupCard/GroupCard';
import Modal from '../../components/modal/Modal';
import './homepage.scss';
import { AuthContext } from '../../context/authContext';
import { toast } from 'react-toastify';

const Homepage = () => {
  const { isLoggedIn, loggedUser } = useContext(AuthContext);
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [groupUsers, setGroupUsers] = useState('');
  const [editingGroup, setEditingGroup] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState(null); // State to hold the editing group's ID

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
    } catch (error) {
      console.error('Error fetching groups: ', error);
    }
  };

  const handleAddGroup = () => {
    setShowAddGroupModal(true);
    setGroupName('');
    setGroupUsers('');
    setEditingGroup(false); // Reset editing state
    setEditingGroupId(null); // Reset editing group ID
  };

  const submitAddGroup = async () => {
    if (!groupName) {
      toast.error('Group name is required');
      return;
    }

    if (!editingGroup && groups.some(group => group.groupName === groupName)) {
      toast.error('A group with the same name already exists.');
      return;
    }

    try {
      const newGroup = {
        groupName: groupName,
        groupUsers: groupUsers.split(',').map(userEmail => ({
          name: null, // Set to null or modify as necessary
          email: userEmail.trim(), // Trim whitespace from user emails
        })),
        createdBy: loggedUser.email,
        createdAt: new Date(),
        checkList: [],
        expenses: [],
      };

      if (editingGroup && editingGroupId) {
        // Use the editing group's ID directly
        await updateDoc(doc(db, 'travelGroups', editingGroupId), newGroup); // Update the group in Firestore

        // Update the groups state
        setGroups(groups.map(group => group.groupId === editingGroupId ? { ...group, ...newGroup } : group));

        toast.success('Group updated successfully');
      } else {
        // Add the new group to Firebase
        const docRef = await addDoc(collection(db, 'travelGroups'), newGroup);
        // Update the groups state with the new group
        setGroups([...groups, { ...newGroup, groupId: docRef.id }]);
        toast.success('Group added successfully');
      }

      // Reset modal state
      setShowAddGroupModal(false);
      setGroupName('');
      setGroupUsers('');
    } catch (error) {
      console.error('Error submitting group: ', error);
      toast.error('An error occurred while submitting the group.');
    }
  };

  const deleteGroup = async (groupId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this group?");
    if (!confirmDelete) return;

    try {
      // Delete the group from Firebase
      await deleteDoc(doc(db, 'travelGroups', groupId));

      // Update the groups state to remove the deleted group
      setGroups(groups.filter(group => group.groupId !== groupId));
      alert('Group deleted successfully');
    } catch (error) {
      console.error('Error deleting group: ', error);
      alert('An error occurred while deleting the group.');
    }
  };

  const handleEditGroup = (group) => {
    setShowAddGroupModal(true);
    setEditingGroup(true);
    setGroupName(group.groupName);
    setGroupUsers(group.groupUsers.map(user => user.email).join(', ')); // Populate emails as a comma-separated string
    setEditingGroupId(group.groupId); // Set the editing group's ID
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
            onEdit={() => handleEditGroup(group)}
            onDelete={() => deleteGroup(group.groupId)}
          />
        ))}
      </div>

      <Modal
        show={showAddGroupModal}
        onClose={() => {
          setEditingGroup(false);
          setShowAddGroupModal(false);
          setEditingGroupId(null); // Reset editing group ID when modal closes
        }}
        title={editingGroup ? "Edit Group" : "Add New Group"}
      >
        <input
          name="Group Name"
          type='text'
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <input
          name="Group Users"
          type='text'
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
