import { useState } from "react"
import { currentDate, postData, putData } from "../../../services/FetchNodeAdminServices";
import Swal from "sweetalert2";
import { useContext } from "react";
import MainContext from "../../../context/MainContext";
import { useEffect } from "react";
//  this is the single form component use by complaint & allergies

export default function Complaint({ stat, onClose, onRefresh, index }) {
    const [complain, setComplain] = useState('');
    const [complainId, setComplainId] = useState('');
    const { complaint, P_id, Aid, allergies } = useContext(MainContext)

    useEffect(() => {
        if (stat === 'complaint') {
            setComplain(complaint[index]?.Complaint || complaint[0]?.Complaint)
            setComplainId(complaint[index]?.id || complaint[0]?.id)
        }
        else if (stat === 'allergies') {
            // console.log(allergies)
            setComplain(allergies)

        }

    }, [])

    function resetData() {
        setComplain('')
    }


    const Edit_Compalin = async () => {

        const result = await putData(`patient/v1/update/complaint/${complainId}`, { message: complain });

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
        const formData = new FormData()
        formData.append('D_id', localStorage.getItem('doctorId'));
        formData.append('message', complain);


        if (stat === 'complaint') {
            const formDataObj = {};
            formData.forEach((value, key) => {
                formDataObj[key] = value;
            });
            const result = await postData(`patient/v1/pre-clinical/createComplaint/${Aid}`, formDataObj);
            DisplayAknowledgement(result.status);
        }
        else if (stat === 'allergies') {
            const body = { allergies: complain };
            // console.log(body)
            const result = await postData(`patient/v1/pre-clinical/allergies/${P_id}`, body);
            DisplayAknowledgement(result.status);
        }

        resetData();
        onClose();
        onRefresh();

    }

    function DisplayAknowledgement(status) {
        if (status) {
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
    }

    return (<div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: 600, height: 'auto', background: '#f7f1e3', margin: 10, padding: 10, borderRadius: 10 }}>

            <div className="mb-3">
                <textarea value={complain} onChange={(e) => setComplain(e.target.value)} className="form-control" rows="3" placeholder="Add Compaint or Type Allergies"></textarea>
            </div>

            <div className="d-flex justify-content-center gap-5">
                <div>
                    <button onClick={handleSubmit} type="Submit" className="btn btn-primary">Submit</button>
                </div>
                {stat === 'complaint' &&
                    <div>
                        <button onClick={Edit_Compalin} type="Submit" className="btn btn-primary">Edit</button>
                    </div>
                }
            </div>



        </div>

    </div>)
}