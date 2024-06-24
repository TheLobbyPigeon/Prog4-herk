const validateUserInput = (userData) => {
    if (!userData.Name || !userData.Email || !userData.Password || !userData.FamilyId || !userData.Role) {
      return 'Required fields are missing';
    }
  
    // Additional validation logic can be added here
    return null;
  };
  
  module.exports = { validateUserInput };
  