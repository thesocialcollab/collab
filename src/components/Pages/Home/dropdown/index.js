import React from "react";

const PostDropdown = ({ onDelete }) => (
    <div className="dropdown-menu">
      <button onClick={onDelete}>Delete Post</button>
    </div>
  );
  

export default PostDropdown;