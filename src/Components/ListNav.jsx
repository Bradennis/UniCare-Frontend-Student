import { useContext, useEffect, useState } from "react";
import "./ListNav.css";
import { GlobalContext } from "../Context/ContextApi";
import Person from "./Profile";
import BookingForm from "./BookingForm";
import prof from "../assets/defaultProf.jpg";
import { FaCheck, FaTimes } from "react-icons/fa";
import axios from "axios";

function ListNav() {
  const [navigateProvider, setNavigateProvider] = useState(false);
  const [selectProfessional, setSelectProfile] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [counsellors, setCounsellors] = useState([]);
  const [index, setIndex] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const doc = await axios.get(
          import.meta.env.VITE_API_URL +
            "/knust.students/wellnesshub/tasks/getdoctors",
          { withCredentials: true }
        );

        const couns = await axios.get(
          import.meta.env.VITE_API_URL +
            "/knust.students/wellnesshub/tasks/getcounsellors",
          { withCredentials: true }
        );

        setDoctors(doc.data);
        setCounsellors(couns.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDetails();
  }, []);

  return (
    <nav className='listna'>
      {!navigateProvider ? (
        <>
          <div className='greenNav'>
            <p className='listnav-header'>Choose a Doctor or a Counsellor</p>
            <div className='altBtns'>
              <p
                onClick={() => setSelectProfile(true)}
                className={selectProfessional ? "unvisited" : "visited"}
              >
                Doctors
              </p>
              <p
                onClick={() => setSelectProfile(false)}
                className={selectProfessional ? "visited" : "unvisited"}
              >
                Counsellors
              </p>
            </div>

            <div className='professionalsList'>
              {selectProfessional ? (
                <div className='usersCustomized'>
                  {doctors?.map(({ first_name, last_name, img }, index) => {
                    return (
                      <div
                        className='usersCustomized-singles'
                        onClick={() => {
                          setIndex(index);
                          setNavigateProvider(!navigateProvider);
                        }}
                        key={index}
                      >
                        <Person
                          img={
                            img
                              ? `${
                                  import.meta.env.VITE_API_URL
                                }/profImages/${img}`
                              : prof
                          }
                        />
                        <p className='usersCustomized-name'>
                          Dr. {`${first_name} ${last_name}`}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className='usersCustomized'>
                  {counsellors?.map(({ first_name, last_name, img }, index) => {
                    return (
                      <div
                        className='usersCustomized-singles'
                        onClick={() => {
                          setIndex(index);
                          setNavigateProvider(!navigateProvider);
                        }}
                        key={index}
                      >
                        <Person
                          img={
                            img
                              ? `${
                                  import.meta.env.VITE_API_URL
                                }/profImages/${img}`
                              : prof
                          }
                        />
                        <p className='usersCustomized-name'>
                          Dr. {`${first_name} ${last_name}`}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className='listnav'>
          {navigateProvider && (
            <div className='selectSide'>
              <div
                className='backbtn'
                onClick={() => setNavigateProvider(!navigateProvider)}
              >
                <FaTimes size='15' />
              </div>
            </div>
          )}
          {selectProfessional ? (
            <div className='prof-details'>
              <div className='prof-detailed-info'>
                <div className='prof-detailed-info-img'>
                  <img
                    src={
                      doctors[index]?.img
                        ? `${import.meta.env.VITE_API_URL}/profImages/${
                            doctors[index]?.img
                          }`
                        : prof
                    }
                    alt='profile Picture'
                  />
                </div>
                <p className='prof-detailed-info-name'>
                  Dr.
                  {`${doctors[index]?.first_name} ${doctors[index]?.last_name}`}
                </p>
                <h3 className='prof-detailed-info-txt'>KNUST Hospital</h3>
                <p className='prof-detailed-info-txt spec'>
                  {doctors[index]?.specialization}
                </p>
              </div>
              <BookingForm details={doctors[index]} />
            </div>
          ) : (
            <div className='prof-details'>
              <div className='prof-detailed-info'>
                <div className='prof-detailed-info-img'>
                  <img
                    src={
                      counsellors[index]?.img
                        ? `${import.meta.env.VITE_API_URL}/profImages/${
                            counsellors[index]?.img
                          }`
                        : prof
                    }
                    alt='profile Picture'
                  />
                </div>
                <p className='prof-detailed-info-name'>
                  Dr.
                  {`${counsellors[index]?.first_name} ${counsellors[index]?.last_name}`}
                </p>
                <h3 className='prof-detailed-info-txt'>
                  KNUST Couselling Center
                </h3>
                <p className='prof-detailed-info-txt spec'>
                  {" "}
                  {counsellors[index]?.specialization}
                </p>
              </div>
              <BookingForm details={counsellors[index]} />
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default ListNav;
