import "./PageNav.css";
import { FaTimes } from "react-icons/fa";
import prof from "../assets/defaultProf.jpg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
function PageNav() {
  const [user, setUser] = useState([]);
  const navigate = useNavigate();
  const handleClose = () => {
    navigate("/checkAppointment");
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const result = await axios.get(
          import.meta.env.VITE_API_URL +
            "/knust.students/wellnesshub/tasks/userdetails",
          { withCredentials: true }
        );

        setUser(result.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDetails();
  }, []);
  return (
    <>
      <nav className='pagenav' style={{ padding: "40px" }}>
        <div
          className='close'
          onClick={handleClose}
          style={{ cursor: "pointer" }}
        >
          <FaTimes />
        </div>
        <div className='profileContainer'>
          <img
            src={
              user?.img
                ? `${import.meta.env.VITE_API_URL}/profImages/${user.img}`
                : prof
            }
            alt=''
            style={{ objectFit: "cover", width: "50px", borderRadius: "7px" }}
          />
        </div>
      </nav>
    </>
  );
}

export default PageNav;
