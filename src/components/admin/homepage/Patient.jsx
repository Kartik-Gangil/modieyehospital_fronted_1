import { useState, useEffect } from "react";
import Complaint from '../forms/Complaint';
import Treatment from '../forms/Advice';
//import Report from '../forms/Report';
import { useContext } from "react";
import MainContext from "../../../context/MainContext";
import Anterior from '../forms/Anterior';
import Posterior from '../forms/Posterior';
import Advice from "../forms/Advice";
import AnteriorIcon from "../forms/AnteriorIcon";
import PosteriorIcon from "../forms/PosteriorIcon";

import "../homepage/MainPrint.css";



export default function Patient({ onRefresh }) {
  const [showDialog, setShowDialog] = useState(false);                    //showDialog or showmodal ek h
  const [modalPage, setModalPage] = useState("");
  const { treatment, anterior, posterior, Advise, deleteTreatment, deleteAdvise, deleteAnterior, deletePosterior } = useContext(MainContext);
  const [activeDate, setActiveDate] = useState(anterior[0]?.created_at);

  const [printSection, setPrintSection] = useState(null);
  const [index, setIndex] = useState(null);
  const activeRecord = anterior.find((rec) => rec.created_at === activeDate);

  useEffect(() => {
    if (anterior.length > 0 && !activeDate) {
      setActiveDate(anterior[0].created_at);
    }
  }, [anterior, activeDate])


  const openDialog = (e , index) => {
    setShowDialog(true);
    setModalPage(e)
    setIndex(index)
  }

  const closeDialog = () => setShowDialog(false);


  const showPage = (props) => {
    if (props === "Complaints") {
      return (
        <div>
          <Complaint stat='complaint' onClose={closeDialog} onRefresh={onRefresh} />
        </div>
      );
    }
    else if (props === "Treatment") {
      return (
        <div>
          <Treatment stat="treatment" index={index} onClose={closeDialog} onRefresh={onRefresh} />
        </div>
      );
    }
    else if (props === "Advice") {
      return (
        <div>
          <Advice stat="advise" index={index} onClose={closeDialog} onRefresh={onRefresh} />
        </div>
      );
    }
    else if (props === "Anterior") {
      return (
        <div>
          <Anterior onClose={closeDialog} index={index} onRefresh={onRefresh} />
        </div>
      );
    }
    else if (props === "Posterior") {
      return (
        <div>
          <Posterior onClose={closeDialog} index={index} onRefresh={onRefresh} />
        </div>
      );
    }

    else if (props === "Anterioricon") {
      return (
        <div>
          <AnteriorIcon onClose={closeDialog} onRefresh={onRefresh} />
        </div>
      );
    }

    else if (props === "Posterioricon") {
      return (
        <div>
          <PosteriorIcon onClose={closeDialog} onRefresh={onRefresh} />
        </div>
      );
    }
    return null;
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


  const renderModal = () => {
    if (!showDialog) return null;

    return (
      <>
        <div className="modal show d-flex" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 800, width: "92%", minHeight: 100 }} >
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
      </>
    );
  };


  return (<div>


    {renderModal()}




    <div className={`print-section ${printSection === "treatment" ? "printable" : ""} table-responsive mb-3`} style={{ marginBottom: 10, overflowY: 'auto', display: 'block' }}>

      <div className="d-flex justify-content-between align-items-center w-100 mb-2 px-3" style={{ background: "#f2b4b4ff", height: "27px" }} >

        <h3 className="fs-6 fw-bold m-0">Treatment</h3>
        <button className="btn p-0 border-0 bg-transparent" style={{ marginRight: 8 }}>
          <img src="/images/printer.png" alt="edit" style={{ width: 17 }} onClick={() => handlePrint('treatment')} />
          <img src="/images/pencil.png" alt="edit" style={{ width: 17, marginLeft: 10 }} onClick={() => openDialog("Treatment")} />
        </button>

      </div>


      <div className="hide-scrollbar" style={{ maxHeight: '120px', overflowY: "auto", display: 'block', scrollbarWidth: 'none' }}>
        <table className="table table-bordered table-sm border-black w-100 mb-0 text-center" style={{ fontSize: "13.5px" }} border={2}>
          <thead>
            <tr className="table-secondary">
              <th>Date</th>
              <th>Type</th>
              <th style={{ width: '60%' }}>Message</th>
              <th className="bi">Edit/Delete</th>
            </tr>
          </thead>
          <tbody>
            {treatment.length > 0 ?
              treatment.map((item, i) => {
                return (<tr key={i} style={{ fontSize: '14px' }}>
                  <td>{new Date(item.Date).toLocaleDateString()}</td>
                  <td>{item.type}</td>
                  <td>{item.message}</td>
                  <td className="bi">
                    <i className="bi bi-pencil" onClick={() => openDialog("Treatment", item.id)} style={{ fontSize: 18, marginLeft: 5, fontWeight: 'bolder', cursor: 'pointer' }}></i>
                    <i className="bi bi-trash3-fill" onClick={() =>{ deleteTreatment(item.id).then(() => onRefresh())}} style={{ fontSize: 18, marginLeft: 15, fontWeight: 'bolder', cursor: 'pointer' }}></i>
                  </td>
                </tr>)
              }) : (<tr>
                <td colSpan="4">No record available</td>
              </tr>)}
          </tbody>
        </table>
      </div>
    </div>

    <div className={`print-section ${printSection === "advice" ? "printable" : ""} table-responsive mb-3`} style={{ marginBottom: 10, }}>

      <div className="d-flex justify-content-between align-items-center w-100 mb-2 px-3" style={{ background: "#d9e1e9ff", height: "27px" }} >

        <h3 className="fs-6 fw-bold m-0">Advice Given</h3>
        <button className="btn p-0 border-0 bg-transparent" style={{ marginRight: 8 }}>
          <img src="/images/printer.png" alt="edit" style={{ width: 17 }} onClick={() => handlePrint('advice')} />
          <img src="/images/pencil.png" alt="edit" style={{ width: 17, marginLeft: 10 }} onClick={() => openDialog("Advice")} />
        </button>

      </div>


      <div className="hide-scrollbar" style={{ maxHeight: '120px', overflowY: "auto", display: 'block', scrollbarWidth: 'none' }}>
        <table className="table table-bordered table-sm border-black w-100 mb-0 text-center" style={{ fontSize: "13.5px" }} border={2}>
          <thead>
            <tr className="table-secondary">
              <th>Date</th>
              <th>Type</th>
              <th style={{ width: '60%' }}>Message</th>
              <th className="bi">Edit/Delete</th>
            </tr>
          </thead>
          <tbody>
            {Advise.length > 0 ?
              Advise.map((item, i) => {
                return (<tr key={i} style={{ fontSize: '14px' }}>
                  <td>{new Date(item.Date).toLocaleDateString()}</td>
                  <td>{item.type}</td>
                  <td>{item.message}</td>
                  <td className="bi">
                    <i className="bi bi-pencil" onClick={() => openDialog("Advice", item.id)} style={{ fontSize: 18, marginLeft: 5, fontWeight: 'bolder', cursor: 'pointer' }}></i>
                    <i className="bi bi-trash3-fill" onClick={() => {deleteAdvise(item.id).then(() => onRefresh())}} style={{ fontSize: 18, marginLeft: 15, fontWeight: 'bolder', cursor: 'pointer' }}></i>
                  </td>
                </tr>)
              }) : (<tr>
                <td colSpan="4">No record available</td>
              </tr>)}
          </tbody>
        </table>
      </div>
    </div>


<div className={`print-section ${printSection === "anterior" ? "printable" : ""}`}>

    <div className={` d-flex justify-content-between align-items-center w-100 mb-2 px-3`} style={{ background: "#ecc99aff", height: "27px" }} >
      <h3 className="fs-6 fw-bold m-0">Anterior</h3>
      <button className="btn p-0 border-0 bg-transparent" style={{ marginRight: 8 }}>
        <img src="/images/printer.png" alt="edit" style={{ width: 17 }} onClick={() => handlePrint('anterior')} />
        <i className="bi bi-brush" style={{ fontSize: 18, color: ' #ff8800', marginLeft: 10 }} onClick={() => openDialog("Anterioricon")}></i>
        <img src="/images/pencil.png" alt="edit" style={{ width: 17, marginLeft: 5 }} onClick={() => openDialog("Anterior" , 0)} />
      </button>
    </div>


    {/* these are the date tabs which is used to see different appointment data in the table */}
    <div className="hide-scrollbar" style={{ overflowX: 'auto', whiteSpace: 'nowrap', padding: '0px 0', background: '#f5f5f5', borderRadius: 6, marginBottom: '8px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>

      <ul className="nav nav-tabs mb-0" style={{ flexWrap: 'nowrap', borderBottom: 'none', minWidth: 'max-content' }}>
        {anterior.map((rec, i) => (
          <li className="nav-item" key={i}>
            <button
              className={`nav-link ${rec.created_at === activeDate ? "active" : ""}`}
              onClick={() => setActiveDate(rec.created_at)}
              style={{ fontSize: 13, fontWeight: 'bold', letterSpacing: 0.5 }}
            >
              {new Date(rec.created_at).toLocaleDateString()} Appoint: {i + 1}
              <i className="bi bi-pencil" onClick={()=>openDialog("Anterior" ,i)} style={{ marginLeft: 10, fontWeight: 'bolder', cursor: 'pointer' }}></i>
              <i className="bi bi-trash3-fill" onClick={() => {deleteAnterior(rec.id).then(() => onRefresh())}} style={{ marginLeft: 10, fontWeight: 'bolder', cursor: 'pointer' }}></i>
            </button>
          </li>
        ))}
      </ul>

    </div>


    <div className={`table-responsive mb-3`}>
      <div className="hide-scrollbar" style={{ maxHeight: '250px', overflowY: "auto", display: 'block' }}>
        <table className="table table-bordered table-sm border-black w-100 mb-3 text-center" style={{ fontSize: "13px" }} border={2}>
          <thead>
            <tr className="table-secondary border border-dark ">

              <th style={{ textAlign: 'left' }} colSpan={19}>Right Eye</th>
            </tr>

            <tr className="table-secondary border border-dark ">
              <th><i>Intraocular pressure(NCT)</i></th>
              <th><i>Intraocular pressure(Tonopen)</i></th>
              <th><i>Intraocular pressure(AT)</i></th>
              <th><i>Eyelids</i></th>
              <th><i>Eyelashes</i></th>
              <th><i>Orbit</i></th>
              <th><i>Extraocular movements</i></th>
              <th><i>Eye position</i></th>
              <th><i>Sclera</i></th>
              <th><i>Conjunctiva</i></th>
              <th><i>Cornea</i></th>
              <th><i>Anterior chamber</i></th>
              <th><i>Angles</i></th>
              <th><i>Iris/pupil</i></th>
              <th><i>Lens</i></th>
              <th><i>Lacrimal syringing</i></th>
              <th><i>Gonioscopy</i></th>
              <th><i>Other</i></th>
              {/* <th className="bi">Edit/Delete</th> */}

            </tr>

          </thead>
          <tbody>
            {activeRecord ? (
              <tr >
                {/* <td>{new Date(item.created_at).toLocaleDateString()}</td> */}
                <td>{activeRecord.R_Intraocular_pressure_NCT}</td>
                <td>{activeRecord.R_Intraocular_pressure_Tonopen}</td>
                <td>{activeRecord.R_Intraocular_pressure_AT}</td>
                <td>{activeRecord.R_Eyelids}</td>
                <td>{activeRecord.R_Eyelashes}</td>
                <td>{activeRecord.R_Orbit}</td>
                <td>{activeRecord.R_Extraocular_movements}</td>
                <td>{activeRecord.R_Eye_position}</td>
                <td>{activeRecord.R_Sclera_episclera}</td>
                <td>{activeRecord.R_Conjunctiva}</td>
                <td>{activeRecord.R_Cornea}</td>
                <td>{activeRecord.R_Anterior_chamber}</td>
                <td>{activeRecord.R_Angles}</td>
                <td>{activeRecord.R_Iris_pupil}</td>
                <td>{activeRecord.R_Lens}</td>
                <td>{activeRecord.R_Lacrimal_syringing}</td>
                <td>{activeRecord.R_Gonioscopy}</td>
                <td>{activeRecord.R_Others}</td>

              
              </tr>)

              : (<tr>
                <td colSpan="20">No record available</td>
              </tr>)
            }
          </tbody>
        </table>


        <table className="table table-bordered table-sm border-black w-100 mb-0 text-center" style={{ fontSize: "13px" }} border={2}>
          <thead>
            <tr className="table-secondary border border-dark ">

              <th style={{ textAlign: 'left' }} colSpan={19}>Left Eye</th>
            </tr>

            <tr className="table-secondary border border-dark ">
              <th><i>Intraocular pressure(NCT)</i></th>
              <th><i>Intraocular pressure(Tonopen)</i></th>
              <th><i>Intraocular pressure(AT)</i></th>
              <th><i>Eyelids</i></th>
              <th><i>Eyelashes</i></th>
              <th><i>Orbit</i></th>
              <th><i>Extraocular movements</i></th>
              <th><i>Eye position</i></th>
              <th><i>Sclera</i></th>
              <th><i>Conjunctiva</i></th>
              <th><i>Cornea</i></th>
              <th><i>Anterior chamber</i></th>
              <th><i>Angles</i></th>
              <th><i>Iris/pupil</i></th>
              <th><i>Lens</i></th>
              <th><i>Lacrimal syringing</i></th>
              <th><i>Gonioscopy</i></th>
              <th><i>Other</i></th>
              {/* <th className="bi">Edit/Delete</th> */}

            </tr>

          </thead>
          <tbody>
            {activeRecord ? (
              <tr>

                <td>{activeRecord.L_Intraocular_pressure_NCT}</td>
                <td>{activeRecord.L_Intraocular_pressure_Tonopen}</td>
                <td>{activeRecord.L_Intraocular_pressure_AT}</td>
                <td>{activeRecord.L_Eyelids}</td>
                <td>{activeRecord.L_Eyelashes}</td>
                <td>{activeRecord.L_Orbit}</td>
                <td>{activeRecord.L_Extraocular_movements}</td>
                <td>{activeRecord.L_Eye_position}</td>
                <td>{activeRecord.L_Sclera_episclera}</td>
                <td>{activeRecord.L_Conjunctiva}</td>
                <td>{activeRecord.L_Cornea}</td>
                <td>{activeRecord.L_Anterior_chamber}</td>
                <td>{activeRecord.L_Angles}</td>
                <td>{activeRecord.L_Iris_pupil}</td>
                <td>{activeRecord.L_Lens}</td>
                <td>{activeRecord.L_Lacrimal_syringing}</td>
                <td>{activeRecord.L_Gonioscopy}</td>
                <td>{activeRecord.L_Others}</td>

              </tr>)

              : (<tr>
                <td colSpan="20">No record available</td>
              </tr>)
            }
          </tbody>
        </table>
      </div>
    </div>
</div>


<div className={`print-section ${printSection === "posterior" ? "printable" : ""}`}>

    <div className={`d-flex justify-content-between align-items-center w-100 mb-2 px-3`} style={{ background: "#d4a7deff", height: "27px" }}>
      
      <h3 className="fs-5 fw-bold m-0">Posterior</h3>
      <button className="btn p-0 border-0 bg-transparent" style={{ marginRight: 8 }}>
        <img src="/images/printer.png" alt="edit" style={{ width: 17 }} onClick={() => handlePrint('posterior')} />
        <i className="bi bi-brush" style={{ fontSize: 18, color: ' #ff8800', marginLeft: 10 }} onClick={() => openDialog("Posterioricon")}></i>
        <img src="/images/pencil.png" alt="edit" style={{ width: 17, marginLeft: 5 }} onClick={() => openDialog("Posterior")} />
      </button>
    </div>


    <div className={`table-responsive mb-3`}>
      <div className="hide-scrollbar" style={{ maxHeight: '170px', overflowY: "auto", display: 'block' }}>
        <table className="table table-bordered table-sm border-black w-100 mb-0 text-center" style={{ fontSize: "13.5px" }} border={2}>
          <thead>
            <tr className="table-secondary border border-dark ">
              <th rowSpan={2} style={{ minWidth: 125, width: 150 }}>Date</th>
              <th colSpan={7}>Right Eye</th>
              <th colSpan={8}>Left Eye</th>
            </tr>


            <tr className="table-secondary border border-dark ">
              <th>Media</th>
              <th>Vitreous</th>
              <th>Retina</th>
              <th>Optic nerve head</th>
              <th>Choroid</th>
              <th>Macula</th>
              <th>Other</th>
              <th>Media</th>
              <th>Vitreous</th>
              <th>Retina</th>
              <th>Optic nerve head</th>
              <th>Choroid</th>
              <th>Macula</th>
              <th>Other</th>
              <th className="bi">Edit/Delete</th>
            </tr>
          </thead>
          <tbody>
            {posterior.length > 0 ? posterior.map((item, i) => {
              return (
                <tr key={i} className="border border-dark">
                  <td>{new Date(item.created_at).toLocaleDateString()}</td>
                  <td>{item.R_Media}</td>
                  <td>{item.R_Vitreous}</td>
                  <td>{item.R_Retina}</td>
                  <td>{item.R_Optic_nerve_head}</td>
                  <td>{item.R_Choroid}</td>
                  <td>{item.R_Macula}</td>
                  <td>{item.R_Others}</td>
                  <td>{item.L_Media}</td>
                  <td>{item.L_Vitreous}</td>
                  <td>{item.L_Macula}</td>
                  <td>{item.L_Retina}</td>
                  <td>{item.L_Optic_nerve_head}</td>
                  <td>{item.L_Choroid}</td>
                  <td>{item.L_Others}</td>

                  <td className="bi">
                    <i className="bi bi-pencil" onClick={()=>openDialog("Posterior" , i)} style={{ fontSize: 18, marginLeft: 5, fontWeight: 'bolder', cursor: 'pointer' }}></i>
                    <i className="bi bi-trash3-fill" onClick={() => {deletePosterior(item.id).then(() => onRefresh())}} style={{ fontSize: 18, marginLeft: 15, fontWeight: 'bolder', cursor: 'pointer' }}></i>
                  </td>



                </tr>)
            })
              : (<tr>
                <td colSpan="15">No record available</td>
              </tr>)
            }
          </tbody>

        </table>
      </div>

    </div>

</div>


  </div >)
}