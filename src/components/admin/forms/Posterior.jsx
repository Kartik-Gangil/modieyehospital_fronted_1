import { useState } from "react"
import { currentDate, postData, putData } from "../../../services/FetchNodeAdminServices";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { useContext } from "react";
import MainContext from "../../../context/MainContext";

export default function Posterior({ onClose, onRefresh , index }) {
  const { P_id, posterior, Aid } = useContext(MainContext)
  const [leftMedia, setLeftMedia] = useState('');
  const [leftVitreous, setLeftVitreous] = useState('');
  const [leftRetina, setLeftRetina] = useState('');
  const [leftOptic, setLeftOptic] = useState('');
  const [leftChoroid, setLeftChoroid] = useState('');
  const [leftMacula, setLeftMacula] = useState('');
  const [leftOther, setLeftOther] = useState('');

  const [rightMedia, setRightMedia] = useState('');
  const [rightVitreous, setRightVitreous] = useState('');
  const [rightRetina, setRightRetina] = useState('');
  const [rightOptic, setRightOptic] = useState('');
  const [rightChoroid, setRightChoroid] = useState('');
  const [rightMacula, setRightMacula] = useState('');
  const [rightOther, setRightOther] = useState('');
  const [id, setid] = useState()


  useEffect(() => {

    const v = posterior[index] || posterior[0];
    setid(v?.id)
    // Right Eye
    setRightMedia(v?.R_Media);
    setRightVitreous(v?.R_Vitreous);
    setRightRetina(v?.R_Retina);
    setRightOptic(v?.R_Optic_nerve_head);
    setRightChoroid(v?.R_Choroid);
    setRightMacula(v?.R_Macula);
    setRightOther(v?.R_Others);

    // Left Eye
    setLeftMedia(v?.L_Media);
    setLeftVitreous(v?.L_Vitreous);
    setLeftRetina(v?.L_Retina);
    setLeftOptic(v?.L_Optic_nerve_head);
    setLeftChoroid(v?.L_Choroid);
    setLeftMacula(v?.L_Macula);
    setLeftOther(v?.L_Others);

  }, []);


  const Edit = async () => {
    const formData = new FormData();
    // Right Eye
    formData.append('R_Media', rightMedia);
    formData.append('R_Vitreous', rightVitreous);
    formData.append('R_Retina', rightRetina);
    formData.append('R_Optic_nerve_head', rightOptic);
    formData.append('R_Choroid', rightChoroid);
    formData.append('R_Macula', rightMacula);
    formData.append('R_Others', rightOther);

    // Left Eye
    formData.append('L_Media', leftMedia);
    formData.append('L_Vitreous', leftVitreous);
    formData.append('L_Retina', leftRetina);
    formData.append('L_Optic_nerve_head', leftOptic);
    formData.append('L_Choroid', leftChoroid);
    formData.append('L_Macula', leftMacula);
    formData.append('L_Others', leftOther);

    const formDataObj = {};

    formData.forEach((value, key) => {
      formDataObj[key] = value;
    });

    const result = await putData(`patient/v1/update/Posterior/${id}`, formDataObj);
    if (result.status) {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Category Submit Successfully",
        showConfirmButton: false,
        timer: 2000
      });
    }
    else {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Your work has been not saved",
        showConfirmButton: false,
        timer: 2000
      });
    }

    resetData();
    onClose();
    onRefresh();

  }


  const handleSubmit = async () => {
    const formData = new FormData();
    // Right Eye
    formData.append('R_Media', rightMedia);
    formData.append('R_Vitreous', rightVitreous);
    formData.append('R_Retina', rightRetina);
    formData.append('R_Optic_nerve_head', rightOptic);
    formData.append('R_Choroid', rightChoroid);
    formData.append('R_Macula', rightMacula);
    formData.append('R_Others', rightOther);

    // Left Eye
    formData.append('L_Media', leftMedia);
    formData.append('L_Vitreous', leftVitreous);
    formData.append('L_Retina', leftRetina);
    formData.append('L_Optic_nerve_head', leftOptic);
    formData.append('L_Choroid', leftChoroid);
    formData.append('L_Macula', leftMacula);
    formData.append('L_Others', leftOther);

    const formDataObj = {};

    formData.forEach((value, key) => {
      formDataObj[key] = value;
    });

    const result = await postData(`patient/v1/Clinical/posterior/${Aid}`, formDataObj);
    if (result.status) {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Category Submit Successfully",
        showConfirmButton: false,
        timer: 2000
      });
    }
    else {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Your work has been not saved",
        showConfirmButton: false,
        timer: 2000
      });
    }

    resetData();
    onClose();
    onRefresh();

  }

  function resetData() {
    setLeftMedia('');
    setRightMedia('');
    setLeftVitreous('');
    setRightVitreous('');
    setLeftRetina('');
    setRightRetina('');
    setLeftOptic('');
    setRightOptic('');
    setLeftMacula('');
    setRightMacula('');
    setRightChoroid('');
    setLeftChoroid('');
    setLeftOther('');
    setRightOther('');

    onClose();
    onRefresh();
  }



  return (<div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <div style={{ width: 600, height: 'auto', background: '#f7f1e3', margin: 10, padding: 10, borderRadius: 10 }}>

      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-secondary">
            <tr>
              <th>Visual Acuity</th>
              <th>Right Eye</th>
              <th>Left Eye</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td><b><i>Media</i></b></td>
              <td><input value={rightMedia} onChange={(e) => setRightMedia(e.target.value)} type="text" className="form-control" /></td>
              <td><input value={leftMedia} onChange={(e) => setLeftMedia(e.target.value)} type="text" className="form-control" /></td>
            </tr>

            <tr>
              <td><b><i>Vitreous</i></b></td>
              <td><input value={rightVitreous} onChange={(e) => setRightVitreous(e.target.value)} type="text" className="form-control" /></td>
              <td><input value={leftVitreous} onChange={(e) => setLeftVitreous(e.target.value)} type="text" className="form-control" /></td>
            </tr>

            <tr>
              <td><b><i>Retina</i></b></td>
              <td><input value={rightRetina} onChange={(e) => setRightRetina(e.target.value)} type="text" className="form-control" /></td>
              <td><input value={leftRetina} onChange={(e) => setLeftRetina(e.target.value)} type="text" className="form-control" /></td>
            </tr>

            <tr>
              <td><b><i>Optic nerve head</i></b></td>
              <td><input value={rightOptic} onChange={(e) => setRightOptic(e.target.value)} type="text" className="form-control" /></td>
              <td><input value={leftOptic} onChange={(e) => setLeftOptic(e.target.value)} type="text" className="form-control" /></td>
            </tr>

            <tr>
              <td><b><i>Choroid</i></b></td>
              <td><input value={rightChoroid} onChange={(e) => setRightChoroid(e.target.value)} type="text" className="form-control" /></td>
              <td><input value={leftChoroid} onChange={(e) => setLeftChoroid(e.target.value)} type="text" className="form-control" /></td>
            </tr>

            <tr>
              <td><b><i>Macula</i></b></td>
              <td><input value={rightMacula} onChange={(e) => setRightMacula(e.target.value)} type="text" className="form-control" /></td>
              <td><input value={leftMacula} onChange={(e) => setLeftMacula(e.target.value)} type="text" className="form-control" /></td>
            </tr>

            <tr>
              <td><b><i>Other</i></b></td>
              <td><input value={rightOther} onChange={(e) => setRightOther(e.target.value)} type="text" className="form-control" /></td>
              <td><input value={leftOther} onChange={(e) => setLeftOther(e.target.value)} type="text" className="form-control" /></td>
            </tr>


          </tbody>
        </table>
      </div>


      <div className="row mb-2"> 
        <div className="col-6 d-flex justify-content-center">
          <button onClick={handleSubmit} type="Submit" className="btn btn-primary">Submit</button>
        </div>

        <div className="col-6 d-flex justify-content-center">
          <button onClick={Edit} type="reset" className="btn btn-primary">Edit</button>
        </div>

      </div> 

    </div>

  </div>)
}