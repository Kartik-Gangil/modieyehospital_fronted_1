import { useState } from "react"
import { currentDate, postData, putData } from "../../../services/FetchNodeAdminServices";
import Swal from "sweetalert2";
import { useContext } from "react";
import MainContext from "../../../context/MainContext";
import { useEffect } from "react";

export default function Diagnosis({ onClose, onRefresh, index }) {

    const [leftEye, setLeftEye] = useState('');
    const [rightEye, setRightEye] = useState('');
    const [systemic, setSystemic] = useState('');
    const [other, setOther] = useState('');
    const [id, setid] = useState();

    const { diagnosisList, P_id, Aid } = useContext(MainContext)

    useEffect(() => {
        // console.log(diagnosisList[0])
        setLeftEye(diagnosisList[index]?.L_eye || diagnosisList[0]?.L_eye)
        setRightEye(diagnosisList[index]?.R_eye || diagnosisList[0]?.R_eye)
        setSystemic(diagnosisList[index]?.Systemic || diagnosisList[0]?.Systemic)
        setOther(diagnosisList[index]?.Others || diagnosisList[0]?.Others)
        setid(diagnosisList[index]?.id || diagnosisList[0]?.id)

    }, [])

    const Edit = async () => {
        const formData = new FormData();

        formData.append('L_eye', leftEye);
        formData.append('R_eye', rightEye);
        formData.append('Systemic', systemic);
        formData.append('Others', other);

        const formDataObj = {};
        formData.forEach((value, key) => {
            formDataObj[key] = value;
        });


        const result = await putData(`patient/v1/update/Diagnosis/${id}`, formDataObj);
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
        resetData()
        onClose()
        onRefresh()

    }


    const handleSubmit = async () => {
        const formData = new FormData();

        formData.append('L_eye', leftEye);
        formData.append('R_eye', rightEye);
        formData.append('Systemic', systemic);
        formData.append('Others', other);

        const formDataObj = {};
        formData.forEach((value, key) => {
            formDataObj[key] = value;
        });


        const result = await postData(`patient/v1/diagnosis/${Aid}`, formDataObj);
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
        resetData()
        onClose()
        onRefresh()

    }

    function resetData() {
        setLeftEye('');
        setRightEye('');
        setSystemic('');
        setOther('');

        onClose();
        onRefresh();
    }



    return (<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
        <div style={{ width: 600, height: 'auto', background: '#f7f1e3', margin: 10, padding: 10, borderRadius: 10 }}>

            <div className="row">
                <div className="col-12 col-lg-6 mb-3">
                    <div style={{ fontSize: 16, fontWeight: 'bold', margin: 10 }}>Right Eye</div>
                    <input type="text" className="form-control" value={rightEye ?? ""} onChange={(e) => setRightEye(e.target.value)} fullwidth="true" />
                </div>

                <div className="col-12 col-lg-6 mb-3">
                    <div style={{ fontSize: 16, fontWeight: 'bold', margin: 10 }}>Left Eye</div>
                    <div><input type="text" className="form-control" value={leftEye ?? ""} onChange={(e) => setLeftEye(e.target.value)} /></div>
                </div>
            </div>

            <div>
                <div style={{ margin: 6, fontSize: 16, fontWeight: 500 }}>Systemic</div>
                <div className="mb-2">
                    <textarea className="form-control" value={systemic} onChange={(e) => setSystemic(e.target.value)} rows="3" placeholder="Add Systemic...."></textarea>
                </div>
            </div>


            <div>
                <div style={{ margin: 6, fontSize: 16, fontWeight: 500 }}>Other</div>
                <div className="mb-2">
                    <textarea className="form-control" value={other} onChange={(e) => setOther(e.target.value)} rows="3" placeholder="Add Other...."></textarea>
                </div>
            </div>


            {/* <div className="row mb-2 mt-3"> */}
            <div className="d-flex justify-content-center">
                <button onClick={handleSubmit} type="Submit" className="btn btn-primary">Submit</button>
            </div>

            <div className="col-6 d-flex justify-content-center">
                <button onClick={Edit} type="reset" className="btn btn-primary">Edit</button>
            </div>

            {/* </div> */}




        </div>

    </div >)
}