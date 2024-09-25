import React, { useState } from 'react';

const RoleDropdown: React.FC = () => {
  const [role, setRole] = useState<string>('');
  const [dropdownOptions, setDropdownOptions] = useState<string[]>([]);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);

    if (selectedRole === 'admin') {
      setDropdownOptions(['Admin Option 1', 'Admin Option 2']);
    } else if (selectedRole === 'user') {
      setDropdownOptions(['User Option 1', 'User Option 2']);
    }
  };

  return (
    <>
      <div className="form-group">
        <label htmlFor="role">Role:</label>
        <select id="role" value={role} onChange={handleRoleChange}>
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>

      {dropdownOptions.length > 0 && (
        <div className="form-group">
          <label htmlFor="roleOptions">Options:</label>
          <select id="roleOptions">
            {dropdownOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}
    </>
  );
};

export default RoleDropdown;
