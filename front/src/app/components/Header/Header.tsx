import React from "react";
import { AnimatedTitle } from "../AnimatedTitle";
import { HeaderButtons } from "../HeaderButtons";

interface HeaderProps {
  user: string;
  handleLogout: () => void;
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({ user, handleLogout, setShowAddModal }) => {
  return (
    <div>
      <AnimatedTitle user={user} />
      <HeaderButtons 
        onAdd={() => setShowAddModal(true)} 
        onLogout={handleLogout} 
      />
    </div>
  );
};

export default Header;