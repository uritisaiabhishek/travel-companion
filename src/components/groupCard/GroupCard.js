import { Link } from 'react-router-dom';
import './groupcard.scss';

const GroupCard = ({ groupDetails, setShowAddGroupModal }) => {
  return (
    <Link to={`/groups/${groupDetails.groupId}`} className="groupCard">
      <h4>{groupDetails.groupName}</h4>
      <div className='memberCounttext'>
        Members: 
        <div className='membersCount'>
          {groupDetails.groupUsers.length}
        </div>
      </div>
    </Link>
  );
};

export default GroupCard;
