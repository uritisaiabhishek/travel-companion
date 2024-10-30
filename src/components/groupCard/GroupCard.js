import { Link } from 'react-router-dom';
import './groupcard.scss';
import { auth } from '../../firebaseConfig';

const GroupCard = ({ groupDetails, onEdit, onDelete }) => {

  
  return (
    <div className="groupCard">
      <Link to={`/groups/${groupDetails.groupId}`} className="groupContent">
        <h4>{groupDetails.groupName}</h4>
        <div className="memberCounttext">
          Members:
          <div className="membersCount">
            {groupDetails.groupUsers.length}
          </div>
        </div>
      </Link>
      {
        groupDetails.createdBy === auth.currentUser.email && 
          <div className="buttons">
            <button className='editGroupBtn' onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}>✏️</button>
            <button className='deleteGroupBtn' onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}>🗑️</button>
          </div>
      }
    </div>
  );
};

export default GroupCard;
