import { FaArrowRight, FaCheck, FaEllipsisV, FaTimes } from "react-icons/fa";
import prof from "../assets/defaultProf.jpg";
import logo from "../assets/logo.jpg";
import { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./checkAppointment.css";
import axios from "axios";
import Person from "./Profile";
import { GlobalContext } from "../Context/ContextApi";

const CheckAppointment = () => {
  const [catClick, setCatClick] = useState("all");
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  const { sized, handleResizing } = useContext(GlobalContext);

  console.log(sized);

  // Function to format the date and get the day of the week
  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      const pending = await axios.get(
        import.meta.env.VITE_API_URL +
          "/knust.students/wellnesshub/appointments/pending",
        { withCredentials: true }
      );

      const appointments = await axios.get(
        import.meta.env.VITE_API_URL +
          "/knust.students/wellnesshub/appointments/appointments",
        { withCredentials: true }
      );
      setAppointments(appointments.data.appointments);
      setPendingAppointments(pending.data.appointments);
    };

    fetchAppointments();
  }, []);

  useEffect(() => {
    handleResizing();
    window.addEventListener("resize", handleResizing);

    return () => {
      window.removeEventListener("resize", handleResizing);
    };
  }, [handleResizing]);

  return (
    <div className='check-appointment'>
      <div className='chat-menu'>
        <div className='library-side-logo'>
          <div>
            <img src={logo} alt='' style={{ width: "50px" }} />
          </div>
          <p className='library-title'>Appointments</p>
        </div>

        <div className='logout'>
          <button className='logout-btn'>
            <NavLink
              to='/home'
              style={{ color: "white", textDecoration: "none" }}
            >
              <FaArrowRight style={{ paddingTop: "5px" }} />
              <span style={{ color: "white", textDecoration: "none" }}>
                Back Home
              </span>
            </NavLink>
          </button>
        </div>
      </div>

      <div className='check-appointment-body'>
        <div className='check-appointment-left-side'>
          <div className='check-appointment-left-side-top'>
            <div
              className={
                sized
                  ? catClick === "all"
                    ? "spaced-minor"
                    : "unspaced-minor "
                  : catClick === "all"
                  ? "spaced-visited"
                  : "unspaced"
              }
              onClick={() => setCatClick("all")}
            >
              <p>All</p>
            </div>
            <div
              className={
                sized
                  ? catClick === "upcoming"
                    ? "spaced-minor"
                    : "unspaced-minor "
                  : catClick === "upcoming"
                  ? "spaced-visited"
                  : "unspaced"
              }
              onClick={() => setCatClick("upcoming")}
            >
              <p>Upcoming</p>
            </div>
          </div>
          <div
            className='check-appointment-left-side-bottom'
            onClick={() => navigate("/appointmentScheduling")}
          >
            New appointment
          </div>
        </div>
        <div className='check-appointment-right-side'>
          <div className='appointment-list'>
            <div className='list-header'>Consultations</div>
            <div className='list-container'>
              <div className='appointments'>Appointments Pending</div>
              {pendingAppointments.length > 0 ? (
                <div className='list-container-sub'>
                  {pendingAppointments?.map(
                    (
                      { name, img, date, time, status, specialization, type },
                      index
                    ) => {
                      return (
                        <div className='list' key={index}>
                          <div className='app-details-heading'>
                            <Person
                              img={
                                img
                                  ? `${
                                      import.meta.env.VITE_API_URL
                                    }/profImages/${img}`
                                  : prof
                              }
                            />
                            <div className='app-details'>
                              <p className='list-name'>{name}</p>
                              <p
                                className='list-portfolio'
                                style={{ color: "grey", fontSize: "0.8rem" }}
                              >
                                {specialization}
                              </p>
                            </div>
                          </div>
                          <div className='app-timings'>
                            <p
                              className='list-date'
                              style={{ textAlign: "center" }}
                            >
                              {time}
                            </p>
                            <p
                              className='list-date'
                              style={{ color: "grey", fontSize: "0.8rem" }}
                            >
                              {formatDate(date)}
                            </p>
                          </div>

                          <div
                            className='app-status'
                            onClick={() => navigate("/switchAppointment")}
                            style={{ cursor: "pointer" }}
                          >
                            {status === "approve" && (
                              <div>
                                <div className='app-status'>
                                  <p>{status}</p>
                                  <FaCheck color='rgb(89, 220, 89)' />
                                </div>

                                <p
                                  style={{
                                    color: "grey",
                                    fontSize: "0.8rem",
                                    cursor: "pointer",
                                  }}
                                >
                                  {type}
                                </p>
                              </div>
                            )}

                            {status === "reject" && (
                              <div>
                                <div className='app-status'>
                                  <p>{status}</p>
                                  <FaTimes color='rgb(240, 74, 74)' />
                                </div>
                                <p
                                  style={{ color: "grey", fontSize: "0.8rem" }}
                                >
                                  {type}
                                </p>
                              </div>
                            )}

                            {status === "pending" && (
                              <div className='app-status'>
                                <div>
                                  <p>{status} ...</p>
                                  <p
                                    style={{
                                      color: "grey",
                                      fontSize: "0.8rem",
                                    }}
                                  >
                                    {type}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              ) : (
                <div style={{ color: "grey" }}>
                  You have no pending appointment
                </div>
              )}
            </div>
            <div className='list-container'>
              <div className='appointments'>Upcoming </div>

              <div>
                {appointments.length > 0 ? (
                  <div className='list-container-sub'>
                    {appointments?.map(
                      (
                        { name, img, date, time, status, specialization, type },
                        index
                      ) => {
                        return (
                          <div className='list' key={index}>
                            <div className='app-details-heading'>
                              <Person
                                img={
                                  img
                                    ? `${
                                        import.meta.env.VITE_API_URL
                                      }/profImages/${img}`
                                    : prof
                                }
                              />
                              <div className='app-details'>
                                <p className='list-name'>{name}</p>
                                <p
                                  className='list-portfolio'
                                  style={{ color: "grey", fontSize: "0.8rem" }}
                                >
                                  {specialization}
                                </p>
                              </div>
                            </div>
                            <div className='app-timings'>
                              <p
                                className='list-date'
                                style={{ textAlign: "center" }}
                              >
                                {time}
                              </p>
                              <p
                                className='list-date'
                                style={{ color: "grey", fontSize: "0.8rem" }}
                              >
                                {formatDate(date)}
                              </p>
                            </div>

                            <div
                              className='app-status'
                              onClick={() => navigate("/switchAppointment")}
                              style={{ cursor: "pointer" }}
                            >
                              {status === "approved" && (
                                <div>
                                  <div className='app-status'>
                                    <p>{status}</p>
                                    <FaCheck color='rgb(89, 220, 89)' />
                                  </div>

                                  <p
                                    style={{
                                      color: "grey",
                                      fontSize: "0.8rem",
                                      cursor: "pointer",
                                    }}
                                  >
                                    {type}
                                  </p>
                                </div>
                              )}

                              {status === "rejected" && (
                                <div>
                                  <div className='app-status'>
                                    <p>{status}</p>
                                    <FaTimes color='rgb(240, 74, 74)' />
                                  </div>
                                  <p
                                    style={{
                                      color: "grey",
                                      fontSize: "0.8rem",
                                    }}
                                  >
                                    {type}
                                  </p>
                                </div>
                              )}

                              {status === "pending" && (
                                <div className='app-status'>
                                  <div>
                                    <p>{status} ...</p>
                                    <p
                                      style={{
                                        color: "grey",
                                        fontSize: "0.8rem",
                                      }}
                                    >
                                      {type}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                ) : (
                  <div style={{ color: "grey" }}>
                    You have no appointments upcoming
                  </div>
                )}
              </div>
            </div>

            <div className='list-container'>
              <div className='appointments'>Past</div>

              <div>
                {appointments.length > 0 ? (
                  <div className='list-container-sub'>
                    {appointments?.map(
                      (
                        { name, img, date, time, status, specialization, type },
                        index
                      ) => {
                        return (
                          <div className='list' key={index}>
                            <div className='app-details-heading'>
                              <Person
                                img={
                                  img
                                    ? `${
                                        import.meta.env.VITE_API_URL
                                      }/profImages/${img}`
                                    : prof
                                }
                              />
                              <div className='app-details'>
                                <p className='list-name'>{name}</p>
                                <p
                                  className='list-portfolio'
                                  style={{ color: "grey", fontSize: "0.8rem" }}
                                >
                                  {specialization}
                                </p>
                              </div>
                            </div>
                            <div className='app-timings'>
                              <p
                                className='list-date'
                                style={{ textAlign: "center" }}
                              >
                                {time}
                              </p>
                              <p
                                className='list-date'
                                style={{ color: "grey", fontSize: "0.8rem" }}
                              >
                                {formatDate(date)}
                              </p>
                            </div>

                            <div
                              className='app-status'
                              onClick={() => navigate("/switchAppointment")}
                              style={{ cursor: "pointer" }}
                            >
                              {status === "approved" && (
                                <div>
                                  <div className='app-status'>
                                    <p>{status}</p>
                                    <FaCheck color='rgb(89, 220, 89)' />
                                  </div>

                                  <p
                                    style={{
                                      color: "grey",
                                      fontSize: "0.8rem",
                                      cursor: "pointer",
                                    }}
                                  >
                                    {type}
                                  </p>
                                </div>
                              )}

                              {status === "rejected" && (
                                <div>
                                  <div className='app-status'>
                                    <p>{status}</p>
                                    <FaTimes color='rgb(240, 74, 74)' />
                                  </div>
                                  <p
                                    style={{
                                      color: "grey",
                                      fontSize: "0.8rem",
                                    }}
                                  >
                                    {type}
                                  </p>
                                </div>
                              )}

                              {status === "pending" && (
                                <div className='app-status'>
                                  <div>
                                    <p>{status} ...</p>
                                    <p
                                      style={{
                                        color: "grey",
                                        fontSize: "0.8rem",
                                      }}
                                    >
                                      {type}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                ) : (
                  <div style={{ color: "grey" }}>
                    You have no past consultations
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CheckAppointment;
