import RegistrationFrom from "../appointment/RegistrationFrom";
import BookAppoint from "../appointment/BookAppoint";
import Header from "../homepage/Header";
import { useContext, useEffect, useState } from "react";
import MainContext from "../../../context/MainContext";
import { useNavigate } from "react-router-dom";
import { io } from 'socket.io-client'
import InfiniteScroll from "react-infinite-scroll-component";

export default function MainDashboard() 
{
  const { getAllTodayAppointments, getAppointmentCount, changeStatus, getPatientBranch, PatientBranch, getDoctorsDetail } = useContext(MainContext)
  const navigate = useNavigate()
  const [doctorId, setDoctorId] = useState(localStorage.getItem('doctorId'))
  const [deptCounts, setDeptCounts] = useState({});
  const [hasMore, setHasMore] = useState();
  const [allTodayAppointments, setallTodayAppointments] = useState([]);
  const [page, setPage] = useState(1);
  const [city, setCity] = useState("Select-Branch")
  const socketURL = import.meta.env.VITE_socketURL || "http://localhost:8001/"

  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {

    getPatientBranch()

    if (!doctorId || doctorId === undefined || doctorId === "") {
      navigate('/')
    }


    async function loadFirstPage() {
      const res = await getAllTodayAppointments(1, city);
      setallTodayAppointments(res.data);
      setHasMore(1 < res.totalPages);
    }

    loadFirstPage();

    getAppointmentCount().then((data) => {
      setDeptCounts(data.count)
    }).catch((e) => {
      console.log(e)
    })


    if (!localStorage.getItem('branch') || localStorage.getItem('branch') === "undefined" || localStorage.getItem('branch') === "") {
      const id = localStorage.getItem('doctorId');
      getDoctorsDetail(id)
    }


    // socket io connection and event listeners
    const socket = io(socketURL, {
      withCredentials: true,
      transports: ["websocket"],
      secure: true,
    });
    socket.on("connect", () => {
      // console.log("Connected to main service:", socket.id);
    });

    socket.on("connect_error", (err) => console.error("Socket Error:", err.message));
    // this listen on the event appointmentUpdated
    socket.on('appointmentUpdated', (data) => {
      const { result } = data;
      setDeptCounts(result);
    })
    return () => { socket.off('appointmentUpdated'); socket.disconnect(); }

  }, [city])


  const fetchMoreData = async () => {
    const nextPage = page + 1;
    const res = await getAllTodayAppointments(nextPage, city);

    setallTodayAppointments((prev) => [...prev, ...res.data])
    setPage(nextPage);
    setHasMore(nextPage < res.totalPages);
  };


  const handleStatusChange = async (id, status) => {
    allTodayAppointments.find((item) => item.id === id).status = status;
    await changeStatus(id, status);

  }

  const refreshDashboard = async () => {
    setPage(1);

    const res = await getAllTodayAppointments(1, city);
    setallTodayAppointments(res.data);
    setHasMore(1 < res.totalPages);

    closeDialog(); // 🔥 close modal
  };

  // console.log(deptCounts)



  // console.log(allTodayAppointments)
  const [showDialog, setShowDialog] = useState(false);                    //showDialog or showmodal ek h
  const [modalPage, setModalPage] = useState("registration");

  const openDialog = () => setShowDialog(true);
  const closeDialog = () => setShowDialog(false);


  const showPage = (props) => {
    if (props === "registration") {
      return (
        <div>
          <RegistrationFrom onRefresh={refreshDashboard} />
        </div>
      );
    }
    else if (props === "bookappoint") {
      return (
        <div>
          <BookAppoint onRefresh={refreshDashboard} close={closeDialog} />
        </div>
      );
    }
    return null;
  };

  const renderModal = () => {
    if (!showDialog) return null;

    return (
      <div>

        <div className="modal show d-flex" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 600, width: "92%", minHeight: 100 }} >
            <div className="modal-content" style={{ minHeight: 400, height: 500 }}>
              <div className="modal-header">
                <button onClick={() => setModalPage("registration")} className="btn btn-warning btn-sm m-1"> Registration </button>
                <button onClick={() => setModalPage("bookappoint")} className="btn btn-warning btn-sm m-1">BookAppointment</button>
                <button type="button" className="btn-close" onClick={closeDialog}></button>
              </div>

              <div className="modal-body overflow-auto" style={{ height: 400 }}>
                {showPage(modalPage)}
              </div>

            </div>
          </div>
        </div>
        {/* Overlay */}
        <div className="modal-backdrop fade show" style={{ width: '100%', height: '100%' }}></div>
      </div>
    );
  };

  /********** Searching Part*********************** */

  const filteredAppointments = allTodayAppointments.filter((item) => {
  const term = searchTerm.toLowerCase();

  return (
    item?.P_id?.toString().toLowerCase().includes(term) ||
    item?.patient?.FullName?.toLowerCase().includes(term) ||
    item?.patient?.Phone?.toLowerCase().includes(term) ||
    item?.id?.toString().toLowerCase().includes(term)
  );
});


/***************************************************** */


  return (<div>

    <div>
      <Header />
    </div>



    <div className="p-3 bg-light">
      <div className="d-flex flex-wrap mb-3">
        <button className="btn btn-secondary btn-sm m-1">Reception [{deptCounts.Reception ? deptCounts?.Reception : 0}]</button>
        <button className="btn btn-secondary btn-sm m-1">Refraction [{deptCounts.Refraction ? deptCounts?.Refraction : 0}]</button>
        <button className="btn btn-secondary btn-sm m-1">Consultation [{deptCounts.Consultation ? deptCounts?.Consultation : 0}]</button>
        <button className="btn btn-secondary btn-sm m-1">Investigation [{deptCounts.Investigation ? deptCounts?.Investigation : 0}]</button>
        <button className="btn btn-secondary btn-sm m-1">Pharmacy [{deptCounts.Pharmacy ? deptCounts?.Pharmacy : 0}]</button>
        <button className="btn btn-secondary btn-sm m-1">Optical [{deptCounts.Optical ? deptCounts?.Optical : 0}]</button>
        <button className="btn btn-secondary btn-sm m-1">Councelling [{deptCounts.Councelling ? deptCounts?.Councelling : 0}]</button>
        <button className="btn btn-secondary btn-sm m-1">Miscellaneous [{deptCounts.Miscellaneous ? deptCounts?.Miscellaneous : 0}]</button>

        <button onClick={() => openDialog()} className="btn btn-warning btn-sm m-1"> Registration / Book Appointment </button>
        <div style={{ marginLeft: 5 }}>
          <select className="form-select" onClick={e => setCity(e.target.value)}>
            <option value="Select-Branch">-Select-Branch-</option>
            {PatientBranch.map((Patient, i) => {
              return (<option key={i} value={Patient.Branch} >{Patient.Branch}</option>)
            }
            )}

          </select>
        </div>

        <div>
          

          <div style={{ display: 'flex', alignItems: 'center', background: "lightgrey", borderRadius: 25, margin: 0, marginLeft:10 }}>
            <i className="bi bi-search fs-4 ms-4" ></i>
             <input type="text" placeholder="Search Here....."  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{width: '40%', height: 30, border: 0, marginLeft: 10, outline: 0, fontSize: 18, color: '#000', background: 'transparent'}}/>
          </div>
          
        </div>

        {renderModal()}
      </div>


      <div id="scrollableDiv" className="table-responsive" style={{ height: "70vh", overflow: "auto" }}>
        <InfiniteScroll
          dataLength={allTodayAppointments.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<h6 className="text-center p-2">Loading more...</h6>}
          scrollableTarget="scrollableDiv"
          endMessage={<p className="text-center text-muted">No more data to load</p>}
        >

          <table className="table table-bordered table-sm">
            <thead className="table-secondary">
              <tr>
                <th className="text-center">Seq</th>
                <th className="text-center">MRD ID</th>
                <th className="text-center">Patient Name</th>
                <th className="text-center">Status</th>
                <th className="text-center">Sex/Age</th>
                <th className="text-center">Appointment Id</th>
                <th className="text-center">Date</th>
                <th className="text-center">Time</th>
                <th className="text-center">Contact</th>
                {/* <th className="text-center">Doctor</th> */}
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {
                allTodayAppointments.length > 0 ? (

                  filteredAppointments.map((item, i) => {

                    return (<tr key={i}>
                      <td className="text-center">{i + 1}</td>
                      <td className="text-center">{item?.P_id}</td>
                      <td className="text-center">{item?.patient?.FullName}</td>
                      <td className="text-center">
                        <select className="form-select" value={item?.status} onChange={e => handleStatusChange(item.id, e.target.value)}>
                          <option value="Reception">Reception</option>
                          <option value='Refraction'>Refraction</option>
                          <option value="Consultation">Consultation</option>
                          <option value='Investigation'>Investigation</option>
                          <option value='Pharmacy'>Pharmacy</option>
                          <option value='Optical'>Optical</option>
                          <option value='Counselling'>Counselling</option>
                          <option value='Miscellaneous'>Miscellaneous</option>
                          <option value='Pending'>Pending</option>
                          <option value='Complete'>Complete</option>
                          <option value='Cancel'>Cancel</option>
                          
                          

                        </select>
                      </td>
                      <td className="text-center">{item?.patient?.Gender}/{item?.patient?.Age}</td>
                      <td className="text-center">{item?.id}</td>
                      <td className="text-center">{new Date(item?.Appointment_date).toLocaleDateString()}</td>
                      <td className="text-center">{item?.Time}</td>
                      <td className="text-center">{item?.patient?.Phone}</td>
                      {/* <td className="text-center">{item.doctor.FullName} </td> */}
                      <td className="text-center">
                        <button onClick={() => navigate(`/dashboard/${item.P_id}/${item.id}`)} className="bg-primary px-3 text-uppercase text-white rounded border border-0">View</button>
                      </td>
                    </tr>
                    )
                  }
                  )
                )
                  : (
                    <tr>
                      <td colSpan="10" className="text-center">
                        No Data Available
                      </td>
                    </tr>
                  )
              }
            </tbody>
          </table>
        </InfiniteScroll>
      </div>

    </div >



  </div>
  );
}