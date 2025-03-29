import React from "react";
import { useColorTransition } from "../hooks/useColorTransition";

interface AnimatedTitleProps {
  user: string;
}

const colors = [
  'text-red-500',
  'text-orange-500',
  'text-yellow-500',
  'text-green-500',
  'text-blue-500',
  'text-indigo-500',
  'text-purple-500'
];

export const AnimatedTitle: React.FC<AnimatedTitleProps> = ({ user }) => {
  const currentColor = useColorTransition(colors, 2000);

  return (
    <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold mt-10 mb-6 text-center transition-colors duration-1000 ${currentColor}`}>
      Espero que estés teniendo un lindo día, {user}
    </h1>
  );
};