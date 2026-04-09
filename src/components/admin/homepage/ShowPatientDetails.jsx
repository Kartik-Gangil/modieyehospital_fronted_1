import { useContext, useState } from 'react'
import Header from '../homepage/Header'
import MainContext from '../../../context/MainContext'
import { useEffect } from 'react'
import { putData } from '../../../services/FetchNodeAdminServices';
import Swal from 'sweetalert2';

export default function ShowPatientDetails()
{

  const { allPatients, getAllPatients } = useContext(MainContext);

  const [showModal, setShowModal] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState({})

  const [searchTerm,setSearchTerm]=useState("")


  useEffect(() => {
    getAllPatients()
  }, [])



  const handleUpdateData = (patient) => {
    setSelectedPatient(patient)
    setShowModal(true)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setSelectedPatient({ ...selectedPatient, [name]: value })
  }

  const handleClose = () => setShowModal(false)

  const handleSave = async () => {
   // console.log("Updated Patient:", selectedPatient)
    try {

      const result = await putData(`patient/v1/update/Patient/${selectedPatient.id}`, selectedPatient);
     // console.log("xxxx",result)
      if (result.status) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Patient Updated Successfully",
          showConfirmButton: false,
          timer: 2000,
        });
        
      } else {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Patient Update Failed",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({ icon: "error", title: "Server Error", timer: 2000 });
    }
     getAllPatients();
    setShowModal(false)
  }


  /********** Searching Part*********************** */

  const filteredPatients = allPatients.filter((item) => {
  const term = searchTerm.toLowerCase();

  return (
    item?.FullName?.toLowerCase().includes(term) ||
    item?.Phone?.toLowerCase().includes(term)
   
  );
});


/***************************************************** */
  


  return (

    <div>
      {showModal &&
        (

          <>
            <div
              className="modal fade show d-block "
              tabIndex="-1"
              style={{ display: "block", zIndex: 1055 }}
            >
              <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Update Patient</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={handleClose}
                    ></button>
                  </div>

                  <div className="modal-body">
                    <div className="row g-3">

                      <div className="col-md-6">
                        <label className="form-label">Full Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="FullName"
                          value={selectedPatient.FullName || ""}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Mobile</label>
                        <input
                          type="text"
                          className="form-control"
                          name="Phone"
                          value={selectedPatient.Phone || ""}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Gender</label>
                        <select
                          className="form-select"
                          name="Gender"
                          value={selectedPatient.Gender || ""}
                          onChange={handleChange}
                        >
                          <option value="">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">DOB</label>
                        <input
                          type="date"
                          className="form-control"
                          name="DOB"
                          value={selectedPatient.DOB?.split("T")[0] || ""}
                          onChange={handleChange}
                        />
                      </div>

                      
                      <div className="col-md-6">
                        <label className="form-label">State</label>
                        <input
                          type="text"
                          className="form-control"
                          name="State"
                          value={selectedPatient.State || ""}
                          onChange={handleChange}
                        />
                      </div>

                      
                      <div className="col-md-6">
                        <label className="form-label">City</label>
                        <input
                          type="text"
                          className="form-control"
                          name="City"
                          value={selectedPatient.City || ""}
                          onChange={handleChange}
                        />
                      </div>

                      
                      <div className="col-md-6">
                        <label className="form-label">Hospital Branch</label>
                        <input
                          type="text"
                          className="form-control"
                          name="Branch"
                          value={selectedPatient.Branch || ""}
                          onChange={handleChange}
                        />
                      </div>

                       <div className="col-md-6">
                        <label className="form-label">Reffered By</label>
                        <input
                          type="text"
                          className="form-control"
                          name="Reffered_by"
                          value={selectedPatient.Reffered_by || ""}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Insurance</label>
                        <input
                          type="text"
                          className="form-control"
                          name="Insurance"
                          value={selectedPatient.Insurance || ""}
                          onChange={handleChange}
                        />
                      </div>

        

                      <div className="col-md-6">
                        <label className="form-label">Address</label>
                        <textarea
                          className="form-control"
                          name="Address"
                          value={selectedPatient.Address || ""}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={handleClose}>
                      Cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleSave}>
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-backdrop fade show w-100 h-100"></div>
          </>
        )
      }
      <div>
        <Header />
      </div>

      
      <div style={{width: '100%',height: '50px',background: "lightgrey",display: 'flex',alignItems: 'center',position: 'relative', padding: '0 10px'}}>
        <div style={{display: 'flex',alignItems: 'center',background: "#fff",borderRadius: 20, padding: '0 10px'}}>
          <i className="bi bi-search"></i>
          <input type="text" placeholder="Search Here..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{border: "none", outline: "none", marginLeft: 8, height: 30}}/>
        </div>

        <div style={{position: 'absolute',left: '50%',transform: 'translateX(-50%)',fontWeight: 'bold',fontSize: 20}}>
           Patient List
        </div>
      </div>

      <div className="table-responsive">
        <table className='table'>
          <thead>
            <tr>
              <th>Patient Id</th>
              <th>Patient Name</th>
              <th>Mobile No.</th>
              <th>Gender</th>
              <th>Dob</th>
              <th>Address</th>
              <th>State</th>
              <th>City</th>
              <th>Hospital Branch</th>
              <th>Reffered By</th>
              <th>Insurance</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody className="table-group-divider">
            {allPatients.length > 0 ?
              filteredPatients.map((item, i) => {
                return (
                  <tr key={i}>
                    <td>{item.id}</td>
                    <td>{item.FullName}</td>
                    <td>{item.Phone}</td>
                    <td>{item.Gender}</td>
                    <td>{new Date(item.DOB).toLocaleDateString()}</td>
                    <td>{item.Address}</td>
                    <td>{item.State}</td>
                    <td>{item.City}</td>
                    <td>{item.Branch}</td>
                    <td>{item.Reffered_by}</td>
                    <td>{item.Insurance}</td>
                    <td><button onClick={() => handleUpdateData(item)} type='button' className="btn btn-warning">Update</button></td>
                  </tr>)
              })
              : (
                <tr >
                  <td colSpan="11" className="text-center">No Data Found</td>
                </tr>
              )
            }


          </tbody>
        </table>
      </div>

    </div>)
}