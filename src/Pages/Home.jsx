import {
  FaSearch,
  FaTimes,
  FaBars,
  FaCalendar,
  FaBookOpen,
  FaHome,
  FaComment,
  FaSignOutAlt,
  FaArrowRight,
  FaStar,
} from "react-icons/fa";
import prof from "../assets/defaultProf.jpg";
import logo from "../assets/logo.jpg";
import counselling from "../assets/counscon.jpg";
import medical from "../assets/blackmed.jpg";
import therapy from "../assets/therapy.jpg";
import medic from "../assets/docMedic.mp4";
import "./home.css";
import { DefaultPlayer as Video } from "react-html5video";
import "react-html5video/dist/styles.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState, useEffect, useContext, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { GlobalContext } from "../Context/ContextApi";
import Person from "../Components/Profile";
import pdfIcon from "../assets/pdf-icon.png";
import libraryDefault from "../assets/libraryDefault.png";

/* sample static data kept for UI fallback */
const sampleAvailableServices = [
  { name: "medical", img: medical, desc: "Live Consultation Scheduling" },
  {
    name: "counselling",
    img: counselling,
    desc: "One-on-One and online Counselling Services",
  },
  {
    name: "Others",
    img: therapy,
    desc: "daily wellness blogs and a resource library",
  },
];

const clientReviews = [
  { username: "bra Dennis", prof: prof, time: "3:40" },
  { username: "Felix Sam", prof: medic, time: "7:53am" },
  { username: "Kuzo Music", prof: therapy, time: "10:04am" },
];

/* sample library resources used only as fallback UI */
const sampleLibResources = [
  {
    img: medical,
    username: "Bra Dennis",
    title: "Depression at its peak",
    prof: prof,
  },
  {
    img: medical,
    username: "Bra Dennis",
    title: "Depression at its peak",
    prof: prof,
  },
];

const Home = () => {
  const [toggle, setToggle] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [libResources, setLibResources] = useState([]); // state for fetched resources
  const [errorMsg, setErrorMsg] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(false);

  const { setChat, currentUser, setCurrentUser, profImage, setProfImage } =
    useContext(GlobalContext);
  const navigate = useNavigate();

  // base API url (pointing at the route root used in your project)
  const BASE_URL = import.meta.env.VITE_API_URL + "/knust.students/wellnesshub";

  const handleToggle = () => {
    setToggle(!toggle);
  };

  const handleLogOut = async () => {
    try {
      const url = `${BASE_URL}/auth/logout`;
      await axios.post(
        url,
        { _id: currentUser?._id },
        { withCredentials: true }
      );

      // clear frontend state
      setCurrentUser(null);
      localStorage.removeItem("currentUser");
      setChat(null);
      localStorage.removeItem("selectedChat");

      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      setErrorMsg("Logout failed. Try again.");
    }
  };

  // keep menu closed on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 767) {
        setToggle(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch profile image / user details
  useEffect(() => {
    const fetchDetails = async () => {
      setLoadingProfile(true);
      try {
        const result = await axios.get(`${BASE_URL}/tasks/userdetails`, {
          withCredentials: true,
        });

        if (result?.data?.img) {
          setProfImage(result.data.img);
        } else if (result?.data) {
          // if backend returns user object
          if (result.data.img) setProfImage(result.data.img);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        // set friendly error if session expired
        if (error.response?.status === 401 || error.response?.status === 400) {
          setErrorMsg(
            "Session expired or unauthenticated. Please log in again."
          );
        }
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchDetails();
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // handle input change for search box
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // general debounce helper
  const debounce = (func, wait) => {
    let timeout;
    return function (...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  };

  // fetch users safely using params (avoids building raw query string)
  const fetchUsers = useCallback(
    debounce(async (query) => {
      try {
        const cleanQuery = query?.trim() || "";
        const url = `${BASE_URL}/tasks/getusers`;

        const response = await axios.get(url, {
          params: { search: cleanQuery }, // axios will serialize correctly
          withCredentials: true,
        });

        // backend may return array directly
        setUsers(response.data || []);
      } catch (error) {
        // don't spam console if user clears the input; only log meaningful errors
        if (error.response) {
          // backend responded with an error status
          console.error(
            "fetchUsers response error:",
            error.response.status,
            error.response.data
          );
        } else {
          console.error("fetchUsers network error:", error);
        }
      }
    }, 300),
    [] // created once
  );

  // call fetchUsers whenever searchQuery changes
  useEffect(() => {
    fetchUsers(searchQuery);
  }, [searchQuery, fetchUsers]);

  // fetch library resources (returns files array -> we slice to latest 3)
  useEffect(() => {
    const fetchLibraryResources = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/tasks/library/resources`,
          {
            withCredentials: true,
          }
        );

        // backend may return { files: [...] } or return array directly
        const files = response.data?.files ?? response.data ?? [];
        const latestResources = Array.isArray(files) ? files.slice(0, 3) : [];
        setLibResources(latestResources);
      } catch (error) {
        console.error("Error fetching library resources:", error);
        // fallback to sample resources so UI doesn't break
        setLibResources(sampleLibResources);
      }
    };

    fetchLibraryResources();
  }, [BASE_URL]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className='home-page'>
      <div className='menu-updated'>
        <div className='menu-logo'>
          <img src={logo} alt='logo' />
        </div>
        <div className='menu-list-container'>
          <button
            onClick={handleToggle}
            style={{ border: "none", background: "transparent", color: "grey" }}
            className='toggle-menu'
            aria-label='Toggle menu'
          >
            {!toggle ? (
              <FaBars size={25} />
            ) : (
              <div className='fa-times'>
                <FaTimes size={25} />
              </div>
            )}
          </button>

          <div className={toggle ? "display" : "menu-list"}>
            <div className='list-items'>
              <NavLink
                to='/home'
                style={{ textDecoration: "none", color: "black" }}
              >
                <div className='items itms-btns home-active'>
                  {toggle && <FaHome size={15} />}
                  home
                </div>
              </NavLink>

              <NavLink
                to='/chatroom'
                style={{ textDecoration: "none", color: "black" }}
              >
                <div className='items itms-btns'>
                  {toggle && <FaComment size={15} />}
                  Chatroom
                </div>
              </NavLink>

              <NavLink
                to='/library'
                style={{ textDecoration: "none", color: "black" }}
              >
                <div className='items itms-btns'>
                  {toggle && <FaBookOpen size={15} />}
                  Resources
                </div>
              </NavLink>

              <NavLink
                to='/checkAppointment'
                style={{ textDecoration: "none", color: "black" }}
              >
                <div className='items itms-btns'>
                  {toggle && <FaCalendar size={15} />}
                  Appointments
                </div>
              </NavLink>
            </div>

            <NavLink
              to='/profileManagement'
              style={{ textDecoration: "none", color: "black" }}
            >
              <div className='profile'>
                <img
                  src={
                    profImage
                      ? `${
                          import.meta.env.VITE_API_URL
                        }/profImages/${profImage}`
                      : prof
                  }
                  alt='profile'
                />
              </div>
            </NavLink>

            <div
              className='items itms-btns'
              onClick={handleLogOut}
              style={{ cursor: "pointer" }}
              role='button'
              tabIndex={0}
            >
              <FaSignOutAlt size={20} />
            </div>
          </div>
        </div>
      </div>

      <div className='main-page'>
        <div className='main-page-sub'>
          <div className='heading-txt'>
            <h2>Find a wellness Professional</h2>
          </div>

          <div className='search-bar'>
            <div className='search-input-bar'>
              <input
                type='text'
                name='search'
                placeholder='Search for a doctor, a counsellor, or others'
                value={searchQuery}
                onChange={handleSearchInputChange}
              />
              <div className='search-icon'>
                <FaSearch size={15} color='grey' />
              </div>
            </div>
          </div>

          {/* show search results when there is a query and results exist */}
          {searchQuery.trim() !== "" && users.length > 0 && (
            <div className='search-bar-display'>
              {users.map(({ username, img, _id, specialization }, index) => (
                <div
                  className='users search-users'
                  style={{ cursor: "pointer" }}
                  key={_id ?? index}
                  onClick={() => {
                    navigate("/Chatroom");
                  }}
                >
                  <div className='single-user'>
                    <Person
                      img={
                        img
                          ? `${import.meta.env.VITE_API_URL}/profImages/${img}`
                          : prof
                      }
                    />
                    <div className='msg-txt-time'>
                      <div className='person-txt-info'>
                        <p className='msg-username'>{username}</p>
                        <p className='msg'>{specialization}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className='intro-txt'>
            <div className='intro-trust-wrap'>
              <span className='intro-trust'>trust us for your wellness</span>
            </div>

            <h3 className='intro-bold'>
              Let's get back your <span>physical and mental health </span> with
              our health care professionals
            </h3>

            <p className='intro-lorem'>
              Empower your journey to wellness with our all-in-one app, designed
              to nurture your mind, body, and soul. Discover personalized
              guidance, track your progress, and unlock your full potential, one
              mindful step at a time.
            </p>

            <div className='services-btn'>
              <button
                onClick={() =>
                  document
                    .getElementById("what-we-do")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Our Services
              </button>
            </div>
          </div>
        </div>

        <div id='what-we-do' className='what-we-do'>
          <div className='what-we-do-txt'>
            <p className='txt-first'>what we do</p>
            <p className='txt-second'>
              we're here to help you. please follow to check the services we
              provide.
            </p>
          </div>

          <ul className='search-list available-ul'>
            {sampleAvailableServices.map((itms, index) => {
              return (
                <li className='available-list' key={index}>
                  <img
                    src={itms.img}
                    alt={itms.name}
                    className='available-img'
                  />
                  <div className='job-titles-list'>
                    <p className='job-titles'>{itms.name}</p>
                    <p className='job-description'>{itms.desc}</p>
                    <div className='learn-more-btn'>
                      <button className='learn-more'>learn more</button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className='about-us'>
            <div className='about-txt'>
              <p className='about-title'>about us</p>
            </div>
            <div className='about-video'>
              <div className='div'>
                <Video autoPlay loop style={{ width: "100%", height: "100%" }}>
                  <source src={medic} type='video/webm' />
                </Video>
              </div>

              <div className='p-txt'>
                <h3 className='about-info '>
                  We combine medical consultations and counseling services for
                  students' physical health, depression and other mental health
                  conditions.
                </h3>

                <p className='about-smaller-info '>
                  Elevating student wellness, our app merges medical
                  consultations and counseling services to effectively tackle
                  comprehensive physical and mental health conditions.
                </p>
                <p className='about-smaller-info '>
                  Locate us at the Knust hospital and our counselling offices
                  across all the various colleges for in-person medical and
                  counselling consultations respectively, not forgetting our
                  live online sessions at the comfort of your homes.
                </p>
              </div>
            </div>
          </div>

          <div className='library-blogs' style={{ width: "100%" }}>
            <p className='library-blogs-title'>resource library</p>
            <div className='library-blogs-header'>
              <p className='library-blogs-title-sub'>
                check our resource library
              </p>
              <div
                className='lib-button'
                onClick={() => navigate("/library")}
                role='button'
                tabIndex={0}
              >
                <span>All Resources</span>
                <FaArrowRight />
              </div>
            </div>

            {/* Uncomment and use when you want to show the actual cards instead of the simple list */}
            <div className='blogs-file-loop'>
              {libResources.length > 0 ? (
                libResources.map((res, index) => {
                  // adapt to your resource object fields
                  const img = res.img ?? res.thumbnail ?? libraryDefault;
                  const title = res.title ?? res.filename ?? "Untitled";
                  const username = res.username ?? res.uploader ?? "Unknown";

                  return (
                    <div className='blogs-file' key={res._id ?? index}>
                      <div
                        className='blogs-file-card'
                        onClick={() => {
                          // open single resource page; adapt as needed
                          navigate("/singleResource", {
                            state: { resource: res },
                          });
                        }}
                      >
                        <img
                          src={img}
                          alt={title}
                          style={{
                            width: "100%",
                            borderTopLeftRadius: "10px",
                            borderTopRightRadius: "10px",
                          }}
                        />
                      </div>
                      <div className='file-txt'>
                        <p
                          className='file-txt-title'
                          style={{
                            cursor: "pointer",
                            textAlign: "center",
                            color: "white",
                            fontSize: "1.2rem",
                            fontWeight: "bold",
                          }}
                        >
                          {title}
                        </p>

                        <div className='blog-post-prof'>
                          <div style={{ marginLeft: "20px" }}>
                            <Person img={prof} />
                          </div>

                          <span
                            className='file-txt-author'
                            style={{
                              cursor: "pointer",
                              color: "white",
                              paddingTop: "10px",
                            }}
                          >
                            {username}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className='no-resources'>
                  <img
                    src={libraryDefault}
                    alt='no resources'
                    style={{ width: 120 }}
                  />
                  <p>No resources available yet.</p>
                </div>
              )}
            </div>
          </div>

          <div className='client-review'>
            <div className='review-left'>
              <p className='review-title'>clients review</p>
              <h4 className='review-left-heading'>
                discover our client feedback
              </h4>
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Corrupti debitis enim atque quae, reiciendis consectetur magni
                officiis vel molestias veniam iusto natus at. Provident maxime
                error, dignissimos repellat.
              </p>

              <div className='review-btn' role='button' tabIndex={0}>
                <div>discover all</div>
                <FaArrowRight />
              </div>
            </div>

            <div className='review-right-container'>
              <Slider {...settings}>
                {clientReviews.map(({ username, prof, time }, index) => {
                  return (
                    <div className='review-right' key={index}>
                      <div>
                        <div className='stars'>
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStar />
                        </div>

                        <p>
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit. Dolorem, provident harum unde sed non ea ipsum
                          deserunt nostrum hic amet libero.
                        </p>
                        <div className='review-person'>
                          <Person img={prof} />
                          <div className='review-person-name'>
                            <p style={{ fontWeight: "bold" }}>{username}</p>
                            <p style={{ color: "green" }}>{time}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </Slider>
            </div>
          </div>

          <div className='footer' style={{ width: "100%" }}>
            <p>Kwame Nkrumah University of Science and Technology &copy;2024</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
