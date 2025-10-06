import { useState } from "react";
import "./switchAppointment.css";

const SwitchAppointment = () => {
  const [option, setOption] = useState(true);
  return (
    <div className='switch-mode'>
      <div className='switch-mode-heading'>Change appointment mode</div>
      <div className='switch-mode-txt'>
        You can switch your appointment mode between virtual and in-person. Note
        that not all appointments are eligible for in-person consultations 😊
      </div>

      <div className='switch-mode-options'>
        <button
          className={option ? "option-clicked" : "unclicked"}
          onClick={() => setOption(true)}
        >
          Virtual
        </button>
        <button
          className={option ? "unclicked" : "option-clicked"}
          onClick={() => setOption(false)}
        >
          In-Person
        </button>
      </div>

      <div className='switch-mode-btn'>
        <button className='switch-mode-btn-cancel'>Cancel</button>
        <button className='switch-mode-btn-save'>Save</button>
      </div>
    </div>
  );
};
export default SwitchAppointment;
