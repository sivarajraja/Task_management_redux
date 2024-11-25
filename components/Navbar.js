import React from "react";
import { useSelector } from "react-redux";

const Navbar = () => {
  const taskCount = useSelector((state)=> state.tasks.tasksList.length)
  const error = useSelector((state)=> state.tasks.error)
  return (
    <>
      <h1 className="text-center my-4 text-primary">Project Management</h1>
      <p className="text-center lead">{`Currently ${taskCount} task(s) pending`}</p>
      {
        error !== ''? <h6 className="text-center text-danger">{error}</h6>:null
      }
    </>
  );
};

export default Navbar;
