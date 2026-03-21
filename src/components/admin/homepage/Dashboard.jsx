import { useEffect, useState } from "react";
import DoctorConcern from "./DoctorConcern";
import Patient from "./Patient";
import PatientHistory from "./PatientHistory";
import { useContext } from "react";
import MainContext from "../../../context/MainContext";
import { useParams } from "react-router-dom";
// import Header from "./Header";
import { useNavigate } from "react-router-dom";
import PrintHeader from "./PrintHeader";

import "./MainPrint.css"

export default function DashBoard() 
{
  const navigate = useNavigate()


  const { patientData, getPatientData, SetP_id, SetAid, DoctorDetail, getDoctorsDetail, changeStatus, getAptStatus } = useContext(MainContext);
  const { id, Aid } = useParams();
  const [status, setStatus] = useState("");
  useEffect(() => {
    getPatientData(`patient/v1/patient/${id}/${Aid}`);
    getDoctorsDetail(localStorage.getItem('doctorId'));
    SetP_id(id)
    SetAid(Aid)
    // console.log(patientData)
    getAptStatus(Aid).then((status) => {
      // console.log(status)
      setStatus(status.status);
    }).catch((e) => {
      console.log(e)
    })


  }, [id, Aid]);
  

  const refreshDashboard = () => {
    getPatientData(`patient/v1/patient/${id}/${Aid}`);
    getDoctorsDetail(localStorage.getItem('doctorId'));
    getAptStatus(Aid).then((status) => {
      setStatus(status.status);
    }).catch((e) => {
      console.log(e)
    })
  };



  let data = [
    "send",
    "History",
    "Primary",
    "Opto",
    "Remakrs",
    "Summary",
    "Procedure",
    "Proc. Summ.",
    "Document",
    "Post-Op",
    "Prog.Note",
    "IP Medicine",
    "IOG Graphs",
    "OC",
    "OT Check",
    "Drawing",
    "Drawing Summ.",
    "Template",
    "T.C.",
  ];

  const showButton = () => {
    return data.map((item, i) => (
      <button
        key={i}
        style={{ margin: 2, borderRadius: 5, background: "pink" }}
      >
        {item}
      </button>
    ));
  };

  const handleStatusChange = async (id, status) => {
    await changeStatus(id, status);
    refreshDashboard();
  }



  return (
    <div>
      <div style={{ background: "lightgrey", width: "100%", fontWeight: "bold", display: 'flex', alignItems: 'center', justifyContent: 'center' }} >

        <button className="btn p-0 border-0 bg-transparent" style={{ position: "absolute", left: "6px", fontSize: 18, marginRight: 10, fontWeight: 600 }} onClick={() => navigate('/maindashboard')} >
          Back
        </button>

        Doctor Examination
      </div>

      <div className="print-only">
        <PrintHeader Name={patientData.FullName} AppointmentNo={Aid.slice(-4)} MRDNo={patientData.id} Age={patientData.Age} DOB={patientData.Dob} Date={new Date().toLocaleDateString()} DrName={DoctorDetail.FullName} />
      </div>


      <div className="px-3">

        <div className="row mb-2 mt-2">
          <div className="col-xs-12 col-lg-2">
            <div className="input-group input-group-sm">
              <span className="input-group-text">Appointment No:</span>
              <input type="text" className="form-control" disabled value={Aid || ""} />
            </div>
          </div>
          <div className="col-xs-12 col-lg-2">
            <div className="input-group input-group-sm">
              <span className="input-group-text">MRD No.:</span>
              <input type="text" className="form-control" disabled value={patientData.id || ""} />
            </div>
          </div>

          <div className="col-xs-12 col-lg-2">
            <div className="input-group input-group-sm">
              <span className="input-group-text">Name</span>
              <input type="text" className="form-control" disabled value={patientData.FullName || ""} />
            </div>
          </div>

          <div className="col-xs-12 col-lg-2">
            <div className="input-group input-group-sm">
              <span className="input-group-text">Doctor</span>
              <input type="text" className="form-control" disabled value={DoctorDetail.FullName || ""} />
            </div>
          </div>

          <div className="col-xs-12 col-lg-2">
            <div className="input-group input-group-sm">
              <span className="input-group-text">Age</span>
              <input type="text" className="form-control" disabled value={patientData.Age || ""} />
            </div>
          </div>

          <div className="col-xs-12 col-lg-2">
            <div className="input-group input-group-sm">
              <span className="input-group-text">DOB:</span>
              <input type="text" className="form-control" disabled value={patientData.Dob || ""} />
            </div>
          </div>

          <div className="col-xs-12 col-lg-2">
            <div className="input-group input-group-sm">
              <span className="input-group-text">Reffered By:</span>
              <input type="text" className="form-control" value={patientData.Reffered_by || "N/A"} disabled />
            </div>
          </div>



        </div>


        <div id="printArea" className="row mb-3 mt-3">

          <div className="col-xs-12 col-lg-2">
            <div className="input-group input-group-sm">
              <span className="input-group-text">Address</span>
              <input type="text" className="form-control" disabled value={patientData.Address || ""} />
            </div>
          </div>


          <div className="col-xs-12 col-lg-2">
            <div className="input-group input-group-sm">
              <span className="input-group-text">Last Visit Date:</span>
              <input type="text" className="form-control" disabled value={patientData.Latest_Apt_Date} />
            </div>
          </div>

          <div className="col-xs-12 col-lg-2">
            <div className="input-group input-group-sm">
              <span className="input-group-text">Send Where To:</span>

              <select className="form-select" value={status} onChange={(e) => handleStatusChange(Aid, e.target.value)}>
                <option value="Reception">Reception</option>
                <option value='Refraction'>Refraction</option>
                <option value="Consultation">Consultation</option>
                <option value='Investigation'>Investigation</option>
                <option value='Pharmacy'>Pharmacy</option>
                <option value='Optical'>Optical</option>
                <option value='Counselling'>Counselling</option>
                <option value='Miscellaneous'>Miscellaneous</option>
              </select>
            </div>
          </div>

        </div>



        
        {/* <div className="row mb-3 mt-3">
          <div className="col-xs-12 col-lg-2">
            <div className="input-group">
              <span className="input-group-text">State</span>
              <input type="text" className="form-control" disabled value={patientData.State} />
            </div>
          </div>

          <div className="col-xs-12 col-lg-3">
            <div className="input-group">
              <span className="input-group-text">Reg.Dt:</span>
              <input type="text" className="form-control" disabled value={patientData.RegDt} />
            </div>
          </div>
        </div> */}







        {/* Components in 3 columns */}
        <div className="row">

          <div className="col-lg-4 col-sm-12">
            <DoctorConcern onRefresh={refreshDashboard} />
          </div>

          <div className="col-lg-4 col-sm-12">
            <PatientHistory onRefresh={refreshDashboard} />
          </div>

          <div className="col-lg-4 col-sm-12">
            <Patient onRefresh={refreshDashboard} />
          </div>

        </div>
      </div>
    </div>

  );
}
