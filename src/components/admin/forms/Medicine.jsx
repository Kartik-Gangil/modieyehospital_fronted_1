import { useState } from "react"
import { postData, currentDate, putData } from "../../../services/FetchNodeAdminServices";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { useContext } from "react";
import MainContext from "../../../context/MainContext";

export default function Medicine({ onClose, onRefresh }) {
    const [drug, setDrug] = useState('');
    const [days, setDays] = useState('');
    const [dose, setDose] = useState('');
    const [intake, setIntake] = useState('');
    const [comment, setComment] = useState('');
    const { Medicine, P_id, Aid, getAllTemplates, templates, getAllTemplatesData, templateData } = useContext(MainContext)
    const [id, setid] = useState()
    const [name, setName] = useState();
    useEffect(() => {
        setDrug(Medicine[0]?.medicine)
        setDays(Medicine[0]?.Days)
        setDose(Medicine[0]?.Dose)
        setIntake(Medicine[0]?.Intake)
        setComment(Medicine[0]?.message)
        setid(Medicine[0]?.id)
        setName(Medicine[0]?.name)

        getAllTemplates()

        setTimeout(() => {
            window.$('.selectpicker').selectpicker('refresh');
        }, 500);


    }, [])

    useEffect(() => {
        if (templateData?.description) {
            setDrug(templateData.description.medicine || '');
            setDays(templateData.description.Days || '');
            setDose(templateData.description.Dose || '');
            setIntake(templateData.description.Intake || '');
            setComment(templateData.description.message || '');
            setName(templateData.name || '');
        }
    }, [templateData]);



    function resetData() {
        setDays('');
        setDose('');
        setComment('');
        setIntake('');
        setDrug('');

        onClose();
        onRefresh();
    }

    const Edit = async () => {
        const formData = new FormData();

        formData.append('medicine', drug);
        formData.append('Days', days);
        formData.append('Dose', dose);
        formData.append('Intake', intake);
        formData.append('message', comment);

        const formDataObj = {};
        formData.forEach((value, key) => {
            formDataObj[key] = value;
        });


        const result = await putData(`patient/v1/update/Medicine/${id}`, formDataObj)

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

        formData.append('medicine', drug);
        formData.append('Days', days);
        formData.append('Dose', dose);
        formData.append('Intake', intake);
        formData.append('message', comment);
        // formData.append('name', name);

        const formDataObj = {};
        formData.forEach((value, key) => {
            formDataObj[key] = value;
        });


        const result = await postData(`patient/v1/Medicine/${Aid}`, formDataObj)

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

    const handleCreateTemplate = async () => {
        try {
            const formData = new FormData();

            formData.append('medicine', drug);
            formData.append('Days', days);
            formData.append('Dose', dose);
            formData.append('Intake', intake);
            formData.append('message', comment);

            const formDataObj = {};
            formData.forEach((value, key) => {
                formDataObj[key] = value;
            });

            const Name = prompt("Template Name:", ""); // Prompt for template name

            const result = await postData(`medical/api/addTemplate`, { description: formDataObj, name: Name });
            if (result.status) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Template Created Successfully",
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
        } catch (error) {
            console.error(error)
        }
    }

    const handletemplateChange = (id) => {
        getAllTemplatesData(id);
    }

    return (<div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: 600, height: 'auto', background: '#f7f1e3', margin: 10, padding: 10, borderRadius: 10 }}>

            <div className="row">
                <div className="col-12 mb-2">
                    <div style={{ fontSize: 16, fontWeight: 'bold', margin: 3, marginLeft: 10 }}>Choose Template</div>
                    <select className="form-select selectpicker"
                        data-live-search="true"
                        value={templateData?.id || ''}
                        onChange={(e) => handletemplateChange(e.target.value)}
                    >
                        <option value=''>Select Template</option>
                        {templates.map((item) => {
                            return (<option key={item.id} value={item.id}>{item.name}</option>)
                        })}
                    </select>
                </div>
            </div>



            <div className="row">
                <div className="col-12 col-lg-6 mb-2">
                    <div style={{ fontSize: 16, fontWeight: 'bold', margin: 3, marginLeft: 10 }}>Drug/Medicine</div>
                    <select className='form-select'
                        value={drug}
                        onChange={(e) => setDrug(e.target.value)}
                    >
                        <option value='-Select-Type-'>Select-Medicine</option>
                        <option value='Investigation (Ocular)'>Investigation (Ocular)</option>
                        <option value='Investigation (Systemic)'>Investigation (Systemic)</option>
                        <option value='Medicines'>Medicines</option>
                        <option value='Glasses'>Glasses</option>
                        <option value='Contact Lens'>Contact Lens</option>
                        <option value={'Null'}>Null</option>
                    </select>
                </div>

                <div className="col-12 col-lg-6 mb-2">
                    <div style={{ fontSize: 16, fontWeight: 'bold', margin: 3, marginLeft: 10 }}>Days</div>
                    <input type="text" className="form-control" value={days} onChange={(e) => setDays(e.target.value)} placeholder="Number Of Days..." />
                </div>
            </div>


            <div className="row">
                <div className="col-12 col-lg-6 mb-2">
                    <div style={{ fontSize: 16, fontWeight: 'bold', margin: 3, marginLeft: 10 }}>Dose</div>
                    <select className='form-select'
                        value={dose}
                        onChange={(e) => setDose(e.target.value)}
                    >

                        <option value={'-Select-Dose-'}>Select-Dose</option>
                        <option value={'Twice a day, 1-0-1'}>Twice a day, 1-0-1</option>
                        <option value={'Three Time, 1-1-1'}> Three Time, 1-1-1</option>
                        <option value={'One Time, 1-0-0'}>One Time, 1-0-0</option>
                        <option value={'Morning Time Once'}>Morning Time Once</option>
                        <option value={'Afternoon Time Once'}>Afternoon Time Once</option>
                        <option value={'Night Time Once'}>Night Time Once</option>

                    </select>
                </div>

                <div className="col-12 col-lg-6 mb-2">
                    <div style={{ fontSize: 16, fontWeight: 'bold', margin: 3, marginLeft: 10 }}>Intake</div>
                    <select className='form-select'
                        value={intake}
                        onChange={(e) => setIntake(e.target.value)}
                    >

                        <option value={'-Select-Dose-'}>Select-Dose</option>
                        <option value={'Before Lunch'}>Before Lunch</option>
                        <option value={'After Lunch'}>After Lunch</option>
                        <option value={'Before Dinner'}>Before Dinner</option>
                        <option value={'After Dinner'}>After Dinner</option>
                        <option value={'Before Breakfast'}>Before Breakfast</option>
                        <option value={'After Breakfast'}>After Breakfast</option>
                    </select>
                </div>
            </div>


            <div className="mb-3">
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="form-control" rows="3" placeholder="Type Comments...."></textarea>
            </div>


            <div className="row">
                <div className="col-4 d-flex justify-content-center">
                    <button onClick={handleSubmit} type="Submit" className="btn btn-primary">Submit</button>
                </div>

                <div className="col-4 d-flex justify-content-center">
                    <button onClick={Edit} type="reset" className="btn btn-primary">Edit</button>
                </div>

                <div className="col-4 d-flex justify-content-center">
                    <button type="submit" onClick={handleCreateTemplate} className="btn btn-primary">Create Templeate</button>
                </div>
            </div>


        </div>
    </div>)
}