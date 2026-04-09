import { useState } from "react";
import Complaint from '../forms/Complaint';
import History from '../forms/History';
import Allegries from '../forms/Complaint';
import Diagnosis from '../forms/Diagnosis';
import Doctor from '../forms/Doctor';
import Treatment from '../forms/Advice';
import Advice from "../forms/Advice";
import Report from '../forms/Report';
import { useContext } from "react";
import MainContext from "../../../context/MainContext";

import "../homepage/MainPrint.css"




export default function DoctorConcern({ onRefresh }) 
{
  const [showDialog, setShowDialog] = useState(false);                    //showDialog or showmodal ek h
  const [selectedID, setSelectedID] = useState(null);                    //showDialog or showmodal ek h
  const [selectedIndex, setSelectedIndex] = useState(null);                    //showDialog or showmodal ek h
  const [modalPage, setModalPage] = useState("");
  const { diagnosisList, histroy, complaint, PatientReports, allergies, deleteComplaint, deleteHistroy, deleteDiagnosis } = useContext(MainContext);
  const [printSection, setPrintSection] = useState(null);
  const doctor = [];
  const openDialog = (e, id = null, index = null) => {
    setShowDialog(true);
    setSelectedID(id);
    setSelectedIndex(index);
    setModalPage(e)
  }

  const closeDialog = () => setShowDialog(false);
  const serverURL = import.meta.env.VITE_Server_files_url || "http://localhost:8001";

  const showPage = (props) => {
    if (props === "Complaints") {
      return (
        <div>
          <Complaint stat='complaint' onClose={closeDialog} index={selectedIndex} onRefresh={onRefresh} />
        </div>
      );
    }
    else if (props === "History") {
      return (
        <div>
          <History onClose={closeDialog} onRefresh={onRefresh} index={selectedIndex} />
        </div>
      );
    }
    else if (props === "Allergies") {
      return (
        <div>
          <Allegries stat='allergies' onClose={closeDialog} onRefresh={onRefresh} />
        </div>
      );
    }
    else if (props === "Doctor") {
      return (
        <div>
          <Doctor onClose={closeDialog} onRefresh={onRefresh} />
        </div>
      );
    }
    else if (props === "Diagnosis") {
      return (
        <div>
          <Diagnosis onClose={closeDialog} onRefresh={onRefresh} index={selectedIndex} />
        </div>
      );
    }
    else if (props === "Treatment") {
      return (
        <div>
          <Treatment stat="treatment" onClose={closeDialog} onRefresh={onRefresh} index={selectedIndex} />
        </div>
      );
    }
    else if (props === "Advice") {
      return (
        <div>
          <Advice stat="advise" onClose={closeDialog} onRefresh={onRefresh} index={selectedIndex} />
        </div>
      );
    }
    else if (props === "Report") {
      return (
        <div>
          <Report onClose={closeDialog} onRefresh={onRefresh} />
        </div>
      );
    }
    else if (props === "Medicine") {
      return (
        <div>
          <Medicine onClose={closeDialog} onRefresh={onRefresh} index={selectedIndex} />
        </div>
      );
    }
    return null;
  };


  const safeValue = (val) => {
  if (val === undefined || val === null || val === "undefined" || val === "null") 
  {
    return "";
  }
  
  return val;
};



  const renderModal = () => {
    if (!showDialog) return null;

    return (
      <div>
        <div className="modal show d-flex" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 700, width: "92%", minHeight: 100 }} >
            <div className="modal-content" style={{ minHeight: 400, height: 'auto' }}>
              <div className="modal-header h4">
                {modalPage}
                <button type="button" className="btn-close" onClick={closeDialog}></button>
              </div>

              <div className="modal-body">
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

  {/**********Print Function************ */ }

  const handlePrint = (sectionId) => {
    setPrintSection(sectionId);

    setTimeout(() => {
      window.print();
    }, 200);

    setTimeout(() => {
      setPrintSection(null);
    }, 500);
  };

  /************************************** */


  return (<div>

    {renderModal()}




    <div className={`print-section ${printSection === "complaints" ? "printable" : ""} table-responsive mb-3`} style={{ marginBottom: '10px', display: 'block' }}>

      <div className="d-flex justify-content-between align-items-center w-100 mb-2 px-3" style={{ background: "#c5e1f4ff", height: "27px" }} >

        <h3 className="fs-6 fw-bold m-0">Complaints</h3>
        <button className="btn p-0 border-0 bg-transparent" style={{ marginRight: 8 }}>
          <img src="/images/printer.png" alt="edit" style={{ width: 17 }} onClick={() => handlePrint("complaints")} />
          <img src="/images/pencil.png" alt="edit" style={{ width: 17, marginLeft: 10 }} onClick={() => openDialog("Complaints")} />
        </button>

      </div>

      <div className="hide-scrollbar" style={{ maxHeight: '120px', overflowY: "auto", display: 'block', scrollbarWidth: 'none' }}>
        <table className="table table-bordered table-sm border-black w-100 mb-0 text-center" style={{ fontSize: "13.5px" }} border={2}>
          <thead>
            <tr className="table-secondary">
              <th className="p-1" style={{ width: "90px" }}>Start Date</th>
              <th className="p-1" style={{ width: "150px" }}>Complain</th>
              <th className="p-1" style={{ width: "40px" }}>AppointmentId</th>
              <th className="p-1 bi" style={{ width: "40px" }}>Edit/Delete</th>
            </tr>
          </thead>

          <tbody>
            {complaint.length > 0 ?
              complaint.map((item, i) => {
                // {console.log(item)}
                return (<tr key={i} style={{ height: "20px", fontSize: "13.5px" }}>
                  <td className="p-1">{new Date(item.Date).toLocaleDateString()}</td>
                  <td className="p-1">{item.Complaint}</td>
                  <td className="p-1">{item.AptId}</td>
                  <td className="p-1 bi">
                    <i className="bi bi-pencil" onClick={() => openDialog("Complaints", item.id , i)} style={{ fontSize: 18, marginLeft: 5, fontWeight: 'bolder', cursor: 'pointer' }}></i>
                    <i className="bi bi-trash3-fill" onClick={() => { deleteComplaint(item.id).then(() => onRefresh())}} style={{ fontSize: 18, marginLeft: 15, fontWeight: 'bolder', cursor: 'pointer' }}></i>
                  </td>
                </tr>)
              }) : (<tr>
                <td colSpan="4">No record available</td>
              </tr>)
            }

          </tbody>

        </table>
      </div>
    </div>


    <div className={`print-section ${printSection === "history" ? "printable" : ""} table-responsive mb-3`} style={{ marginBottom: '5px', display: 'block', }}>

      <div className="d-flex justify-content-between align-items-center w-100 mb-2 px-3" style={{ background: "#c8ebedff", height: "27px" }} >

        <h3 className="fs-6 fw-bold m-0">History</h3>
        <button className="btn p-0 border-0 bg-transparent" style={{ marginRight: 8 }}>
          <img src="/images/printer.png" alt="edit" style={{ width: 17 }} onClick={() => handlePrint("history")} />
          <img src="/images/pencil.png" alt="edit" style={{ width: 17, marginLeft: 10 }} onClick={() => openDialog("History")} />
        </button>

      </div>

      <div className="hide-scrollbar" style={{ maxHeight: '120px', overflowY: "auto", display: 'block', scrollbarWidth: 'none' }}>
        <table className="table table-bordered table-sm border-black w-100 mb-0 text-center" style={{ fontSize: "13.5px" }} border={2}>
          <thead>
            <tr className="table-secondary">
              <th className="p-1 w-25">Date</th>
              <th className="p-1">Systemic illness</th>
              <th className="p-1">Treatment History</th>
              <th className="p-1">Diet History</th>
              <th className="p-1">Family History</th>
              <th className="p-1 bi">Edit/Delete</th>
            </tr>
          </thead>

          <tbody>
            {histroy.length > 0 ?
              histroy.map((item, i) => {
                return (<tr key={i} style={{ height: "20px", fontSize: '14px' }}>
                  <td className="p-1">{new Date(item.created_at).toLocaleDateString()}</td>
                  <td className="p-1">{safeValue(item.Systemic_illness)}</td>
                  <td className="p-1">{safeValue(item.Treatment_Histroy)}</td>
                  <td className="p-1">{safeValue(item.Dite_Histroy)}</td>
                  <td className="p-1">{safeValue(item.Family_Histroy)}</td>
                  <td className="p-1 bi">
                    <i className="bi bi-pencil" onClick={() => openDialog("History", item.id , i)} style={{ fontSize: 18, marginLeft: 5, fontWeight: 'bolder', cursor: 'pointer' }}></i>
                    <i className="bi bi-trash3-fill" onClick={() => {deleteHistroy(item.id).then(() => onRefresh())}} style={{ fontSize: 18, marginLeft: 15, fontWeight: 'bolder', cursor: 'pointer' }}></i>
                  </td>
                </tr>)
              }) : (<tr>
                <td colSpan="6">No record available</td>
              </tr>)
            }
          </tbody>

        </table>
      </div>
    </div>



    {/*
    <div id="printArea" className="d-flex  gap-3">
      <div style={{ flex: '2 1 350px', minWidth: 250 }}>

        <div className="d-flex justify-content-between align-items-center w-100 mb-2 px-3" style={{ background: "#dae6f2ff", height: "27px" }} >

          <h3 className="fs-6 fw-bold m-0">Doctor</h3>
          <button className="btn p-0 border-0 bg-transparent" style={{ marginRight: 8 }}>
            <img src="/images/printer.png" alt="edit" style={{ width: 17 }}   onClick={() => window.print()}/>
            <img src="/images/pencil.png" alt="edit" style={{ width: 17,marginLeft:10 }} onClick={() => openDialog("Doctor")} />
          </button>
        </div>


       <div className="hide-scrollbar" style={{ maxHeight: '120px', overflowY: "auto", display: 'block', scrollbarWidth: 'none' }}>
          <table className="table table-bordered table-sm border-black w-100 mb-0 text-center" style={{ fontSize: "13.5px" }} border={2} >
            <thead>
              <tr className="table-secondary">
                <th className="p-1">Doctor</th>
                <th className="p-1">Date</th>
                <th className="p-1">Branch</th>
              </tr>
            </thead>

            <tbody>
              {doctor.length > 0 ? <tr style={{ height: "20px", fontSize: '14px' }}>
                <td className="p-1"></td>
                <td className="p-1"></td>
                <td className="p-1"></td>
              </tr> : (<tr>
                <td colSpan="4">No record available</td>
              </tr>)}
            </tbody>

          </table>
        </div>
      </div>
    </div>
*/}


    <div className={`print-section ${printSection === "diagnosis" ? "printable" : ""} table-responsive mb-3`} style={{ marginBottom: 10, marginTop: 10, overflowY: 'auto', display: 'block' }}>

      <div className="d-flex justify-content-between align-items-center w-100 mb-2 px-3" style={{ background: "#e4dcbcff", height: "27px" }} >

        <h3 className="fs-6 fw-bold m-0">Diagnosis</h3>
        <button className="btn p-0 border-0 bg-transparent" style={{ marginRight: 8 }}>
          <img src="/images/printer.png" alt="edit" style={{ width: 17 }} onClick={() => handlePrint("diagnosis")} />
          <img src="/images/pencil.png" alt="edit" style={{ width: 17, marginLeft: 10 }} onClick={() => openDialog("Diagnosis")} />
        </button>

      </div>

      <div className="hide-scrollbar" style={{ maxHeight: '120px', overflowY: "auto", display: 'block', scrollbarWidth: 'none' }}>
        <table className="table table-bordered table-sm border-black w-100 mb-0 text-center" style={{ fontSize: "13.5px" }} border={2}>
          <thead>
            <tr className="table-secondary">
              <th>Date</th>
              <th>Right Eye</th>
              <th>Left Eye</th>
              <th className="w-25">Systemic</th>
              <th>Other</th>
              <th className="p-1 bi">Edit/Delete</th>
            </tr>
          </thead>
          <tbody>
            {diagnosisList.length > 0 ?
              diagnosisList.map((diagnosis, i) => {
                return (<tr key={i} style={{ fontSize: '14px' }}>
                  <td>{new Date(diagnosis.created_at).toLocaleDateString()}</td>
                  <td>{safeValue(diagnosis.R_eye)}</td>
                  <td>{safeValue(diagnosis.L_eye)}</td>
                  <td>{safeValue(diagnosis.Systemic)}</td>
                  <td>{safeValue(diagnosis.Others)}</td>
                  <td className="p-1 bi">
                    <i className="bi bi-pencil" onClick={() => openDialog("Diagnosis", diagnosis.id, i)} style={{ fontSize: 18, marginLeft: 5, fontWeight: 'bolder', cursor: 'pointer' }}></i>
                    <i className="bi bi-trash3-fill" onClick={() => {deleteDiagnosis(diagnosis.id).then(() => onRefresh())}} style={{ fontSize: 18, marginLeft: 15, fontWeight: 'bolder', cursor: 'pointer' }}></i>
                  </td>
                </tr>)
              }) : (<tr>
                <td colSpan="6">No record available</td>
              </tr>)
            }
          </tbody>
        </table>
      </div>
    </div>




    <div className={`print-section ${printSection === "allegries" ? "printable" : ""} table-responsive mb-3`} style={{ marginBottom: '10px' }}>

      <div className="d-flex justify-content-between align-items-center w-100 mb-2 px-3" style={{ background: "#f0d5d6ff", height: "27px" }} >

        <h3 className="fs-6 fw-bold m-0">Allergies</h3>
        <button className="btn p-0 border-0 bg-transparent" style={{ marginRight: 8 }}>
          <img src="/images/printer.png" alt="edit" style={{ width: 17 }} onClick={() => handlePrint("allegries")} />
          <img src="/images/pencil.png" alt="edit" style={{ width: 17, marginLeft: 10 }} onClick={() => openDialog("Allergies")} />
        </button>

      </div>

      <div className="hide-scrollbar" style={{ maxHeight: '120px', overflowY: "auto", display: 'block', scrollbarWidth: 'none' }}>
        <table className="table table-bordered table-sm border-black w-100 mb-0 text-center" style={{ fontSize: "13.5px" }} border={2}>
          <thead>
            <tr className="table-secondary">
              <th className="p-1">Allergies</th>
            </tr>
          </thead>

          <tbody>
            {allergies.length > 0 ? <tr style={{ height: "20px" }}>
              <td className="p-1">{allergies.map((item, i) => {
                return (item + (i !== allergies.length - 1 ? ", " : ""))
              })}</td>
            </tr> : (<tr style={{ height: "20px", fontSize: '14px' }}>
              <td colSpan="3">No record available</td>
            </tr>)
            }
          </tbody>

        </table>
      </div>
    </div>




    <div className={`print-section ${printSection === "report" ? "printable" : ""} table-responsive mb-3`} style={{ marginBottom: 10, overflowY: 'auto', display: 'block', maxHeight: "130px" }}>

      <div className="d-flex justify-content-between align-items-center w-100 mb-2 px-3" style={{ background: "#8596a8ff", height: "27px" }} >

        <h3 className="fs-6 fw-bold m-0">Report</h3>
        <button className="btn p-0 border-0 bg-transparent" style={{ marginRight: 8 }}>
          <img src="/images/printer.png" alt="edit" style={{ width: 17 }} onClick={() => handlePrint("report")} />
          <img src="/images/pencil.png" alt="edit" style={{ width: 17, marginLeft: 10 }} onClick={() => openDialog("Report")} />
        </button>

      </div>


      <div className="hide-scrollbar" style={{ maxHeight: '120px', overflowY: "auto", display: 'block', scrollbarWidth: 'none' }}>
        <table className="table table-bordered table-sm border-black w-100 mb-0 text-center" style={{ fontSize: "13.5px" }} border={2}>
          <thead>
            <tr className="table-secondary">

              <th>Report Name</th>
              <th>View</th>
              {/* <th className="bi">Edit/Delete</th> */}
            </tr>
          </thead>
          <tbody>
            {PatientReports?.length > 0 ? PatientReports.map((item, i) => {
              return (
                <tr style={{ fontSize: '14px' }} key={i}>
                  <td>{safeValue(item.name)}</td>
                  <td><a target="blank" href={`${serverURL}/${item.path}`}>View</a></td>
                  {/* <td className="bi">
                    <i className="bi bi-pencil" style={{ fontSize: 18, marginLeft: 5, fontWeight: 'bolder', cursor: 'pointer' }}></i>
                    <i className="bi bi-trash3-fill" style={{ fontSize: 18, marginLeft: 15, fontWeight: 'bolder', cursor: 'pointer' }}></i>
                  </td> */}
                </tr>)
            }) : (<tr>
              <td colSpan="4">No record available</td>
            </tr>)
            }

          </tbody>
        </table>
      </div>
    </div>



    {/*
    <div className="table-responsive mb-3" style={{ marginBottom: 10, overflowY: 'auto', display: 'block', maxHeight: "130px" }}>

      <div className="d-flex justify-content-between align-items-center w-100 mb-2 px-3" style={{ background: "lightgrey", height: "27px" }} >

        <h3 className="fs-6 fw-bold m-0">Treatment</h3>
        <button className="btn p-0 border-0 bg-transparent" style={{ marginRight: 8 }} onClick={() => openDialog("Treatment")}>
          <img src="/images/pencil.png" alt="edit" style={{ width: 17 }} />
        </button>

      </div>


   <div className="hide-scrollbar" style={{ maxHeight: '120px', overflowY: "auto", display: 'block', scrollbarWidth: 'none' }}>
      <table className="table table-bordered table-sm border-black w-100 mb-0 text-center" style={{ fontSize: "13.5px" }} border={2}>
        <thead>
          <tr className="table-secondary">
            <th>Date</th>
            <th>Type</th>
            <th style={{ width: '60%' }}>Message</th>
          </tr>
        </thead>
        <tbody>
          {treatment.length > 0 ?
            treatment.map((item, i) => {
              return (<tr key={i} style={{ fontSize: '14px' }}>
                <td>{new Date(item.Date).toLocaleDateString()}</td>
                <td>{item.type}</td>
                <td>{item.message}</td>
              </tr>)
            }) : (<tr>
              <td colSpan="3">No record available</td>
            </tr>)}
        </tbody>
      </table>
    </div>
</div>

    <div className="table-responsive mb-3" style={{ marginBottom: 10, overflowY: 'auto', display: 'block', maxHeight: "130px" }}>

      <div className="d-flex justify-content-between align-items-center w-100 mb-2 px-3" style={{ background: "lightgrey", height: "27px" }} >

        <h3 className="fs-6 fw-bold m-0">Report</h3>
        <button className="btn p-0 border-0 bg-transparent" style={{ marginRight: 8 }} onClick={() => openDialog("Report")}>
          <img src="/images/pencil.png" alt="edit" style={{ width: 17 }} />
        </button>

      </div>


     <div sclassName="hide-scrollbar" style={{ maxHeight: '120px', overflowY: "auto", display: 'block', scrollbarWidth: 'none' }}>
      <table className="table table-bordered table-sm border-black w-100 mb-0 text-center" style={{ fontSize: "13.5px" }} border={2}>
        <thead>
          <tr className="table-secondary">
            <th>Date</th>
            <th>Report Name</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody>
          {Report.length > 0 ? <tr style={{ fontSize: '14px' }}>
            <td></td>
            <td></td>
            <td></td>
          </tr> : (<tr>
            <td colSpan="3">No record available</td>
          </tr>)
          }

        </tbody>
      </table>
    </div>
</div>

*/}


  </div >)
}