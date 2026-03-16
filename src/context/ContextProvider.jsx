import MainContext from './MainContext'
import { deleteData, getData, putData } from "../services/FetchNodeAdminServices"
import { useState } from 'react'


const ContextProvider = ({ children }) => {


  const [P_id, SetP_id] = useState('')
  const [Aid, SetAid] = useState('')

  const [allPatients, setAllPatients] = useState([])
  const [DoctorDetail, setDoctorDetail] = useState([])
  const [allDoctors, setAllDoctors] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [diagnosisList, setDiagnosisList] = useState([])
  const [patientData, SetPatientData] = useState({
    Age: "",
    Address: "",
    Branch: "",
    State: "",
    RegDt: "",
    FullName: "",
    Dob: "",
    Latest_Apt: "",
    Latest_Apt_Date: ""
  })

  const [vision, SetVision] = useState([{
    L_Distance_With_CT: "",
    L_Distance_With_PMT: "",
    L_Distance_With_Pin_Hole: "",
    L_Distance_unaided: "",
    L_Distance_with_current_subjective: "",
    L_Distance_with_previous_glasses: "",
    R_Distance_With_CT: "",
    R_Distance_With_PMT: "",
    R_Distance_With_Pin_Hole: "",
    R_Distance_unaided: "",
    R_Distance_with_current_subjective: "",
    R_Distance_with_previous_glasses: "",
    appointmentId: "",
    created_at: "",
    id: "",
    patientId: ""
  }])

  const [histroy, setHistroy] = useState([{
    D_id: "",
    Dite_Histroy: "",
    Family_Histroy: "",
    P_id: "",
    Systemic_illness: "",
    Treatment_Histroy: "",
    appointmentId: "",
    id: "",
    created_at: "",
  }])

  const [Advise, setAdvise] = useState([{
    Date: "",
    type: "",
    message: "",
    id: ""
  }])
  const [complaint, setComplaint] = useState([{
    Date: "",
    Complaint: "",
    AptId: "",
    id: ""
  }])

  const [treatment, setTreatment] = useState([{
    Date: "",
    type: "",
    message: "",
    id: ""
  }])
  const [Medicine, setMedicine] = useState([{
    Medicine: "", duration: "", Dose: "", Intake: "", Comment: "", date: "", id: "", eye: "", type: ""
  }])

  const [surgery, setSurgery] = useState([{ name: "", eye: "", message: "", id: "", date: "" }]);

  const [refractionData, setRefractionData] = useState([{
    Glass_Type: "",
    L_D_AXIS: "",
    L_D_CYL: "",
    L_D_SPH: "",
    L_D_VA: "",
    L_N_AXIS: "",
    L_N_CYL: "",
    L_N_SPH: "",
    L_N_VA: "",
    R_D_AXIS: "",
    R_D_CYL: "",
    R_D_SPH: "",
    R_D_VA: "",
    R_N_AXIS: "",
    R_N_CYL: "",
    R_N_SPH: "",
    R_N_VA: "",
    appointmentId: "",
    created_at: "",
    id: "",
    patientId: "",
    refractionType: "",
  }]);

  const [anterior, setAnterior] = useState([{
    L_Angles: "",
    L_Anterior_chamber: "",
    L_Conjunctiva: "",
    L_Cornea: "",
    L_Extraocular_movements: "",
    L_Eye_position: "",
    L_Eyelashes: "",
    L_Eyelids: "",
    L_Gonioscopy: "",
    L_Intraocular_pressure_AT: "",
    L_Intraocular_pressure_NCT: "",
    L_Intraocular_pressure_Tonopen: "",
    L_Iris_pupil: "",
    L_Lacrimal_punctum: "",
    L_Lacrimal_syringing: "",
    L_Lens: "",
    L_Orbit: "",
    L_Others: "",
    L_Sclera_episclera: "",
    R_Angles: "",
    R_Anterior_chamber: "",
    R_Conjunctiva: "",
    R_Cornea: "",
    R_Extraocular_movements: "",
    R_Eye_position: "",
    R_Eyelashes: "",
    R_Eyelids: "",
    R_Gonioscopy: "",
    R_Intraocular_pressure_AT: "",
    R_Intraocular_pressure_NCT: "",
    R_Intraocular_pressure_Tonopen: "",
    R_Iris_pupil: "",
    R_Lacrimal_punctum: "",
    R_Lacrimal_syringing: "",
    R_Lens: "",
    R_Orbit: "",
    R_Others: "",
    R_Sclera_episclera: "",
    appointmentId: "",
    created_at: "",
    id: "",
    patientId: "",
  }]);

  const [posterior, setPosterior] = useState([{
    L_Choroid: "",
    L_Macula: "",
    L_Media: "",
    L_Optic_nerve_head: "",
    L_Others: "",
    L_Retina: "",
    L_Vitreous: "",
    R_Choroid: "",
    R_Macula: "",
    R_Media: "",
    R_Optic_nerve_head: "",
    R_Others: "",
    R_Retina: "",
    R_Vitreous: "",
    appointmentId: "",
    created_at: "",
    id: "",
    patientId: "",
  }]);

  const [PatientReports, setReports] = useState([])
  const [PatientBranch, setPatientBranch] = useState([])
  const [allergies, setAllergies] = useState("")

  const [product, setProduct] = useState([]);
  const [supplier, setCompany] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [templateData, setTemplatesData] = useState();


  const getPatientData = async (url) => {
    try {
      const response = await getData(url);
      const data = response;

      // console.log("Patient API Response:", data);

      // ✅ normalize Appointment once
      const appointments = Array.isArray(data?.Appointment)
        ? data.Appointment
        : [];

      // ---------------- PATIENT BASIC INFO ----------------
      SetPatientData({
        id: data?.id ?? "",
        Age: data?.Age ?? "",
        Address: data?.Address ?? "",
        Branch: data?.Branch ?? "",
        State: data?.State ?? "",
        RegDt: data?.RegDt ?? "",
        FullName: data?.FullName ?? "",
        Dob: data?.DOB ? new Date(data.DOB).toLocaleDateString() : "",
        Latest_Apt: data?.Latest_Apt ?? "",
        Latest_Apt_Date: data?.Latest_Apt_Date ?? ""
      });

      // ---------------- COMPLAINT ----------------
      setComplaint(
        appointments
          .filter(apt => apt?.Complaint)
          .map(apt => ({
            Date: apt.Complaint?.created_at ?? "",
            Complaint: apt.Complaint?.message ?? "",
            AptId: apt?.Complaint?.appointmentId ?? "",
            id: apt?.Complaint?.id ?? ""
          }))
      );

      // ---------------- HISTORY ----------------
      setHistroy(
        appointments
          .filter(apt => apt?.History)
          .map(apt => ({
            id: apt.History?.id ?? "",
            D_id: apt.History?.D_id ?? "",
            Systemic_illness: apt.History?.Systemic_illness ?? "",
            Treatment_Histroy: apt.History?.Treatment_Histroy ?? "",
            Dite_Histroy: apt.History?.Dite_Histroy ?? "",
            Family_Histroy: apt.History?.Family_Histroy ?? "",
            appointmentId: apt?.id ?? "",
            created_at: apt.History?.created_at ?? ""
          }))
      );

      // ---------------- DIAGNOSIS ----------------
      setDiagnosisList(
        appointments
          .filter(apt => apt?.Diagnosis)
          .map(apt => ({
            L_eye: apt.Diagnosis?.L_eye ?? "",
            R_eye: apt.Diagnosis?.R_eye ?? "",
            Systemic: apt.Diagnosis?.Systemic ?? "",
            Others: apt.Diagnosis?.Others ?? "",
            appointmentId: apt?.id ?? "",
            created_at: apt.Diagnosis?.created_at ?? "",
            id: apt.Diagnosis?.id ?? ""
          }))
      );

      // ---------------- ALLERGIES ----------------
      setAllergies(
        Array.isArray(data?.allergies) && data.allergies[0]
          ? data.allergies[0].allergies ?? ""
          : ""
      );

      // ---------------- REPORTS ----------------
      setReports(
        Array.isArray(data?.Report) && data.Report[0]
          ? data.Report[0].document ?? []
          : []
      );

      // ---------------- VISION ----------------
      SetVision(
        appointments
          .filter(apt => apt?.Vision)
          .map(apt => ({
            ...apt.Vision,
            appointmentId: apt.Vision?.appointmentId ?? "",
            created_at: apt.Vision?.created_at ?? "",
            id: apt.Vision?.id ?? ""
          }))
      );

      // ---------------- MEDICINE ----------------
      setMedicine(
        appointments.flatMap(apt =>
          Array.isArray(apt?.Medicine)
            ? apt.Medicine.map(med => ({
              id: med?.id ?? "",
              medicine: med?.medicine ?? "",
              duration: med?.Duration ?? "",
              Dose: med?.Dose ?? "",
              eye: med?.eye ?? "",
              type: med?.type ?? "",
              Intake: med?.Intake ?? "",
              message: med?.message ?? "",
              appointmentId: apt?.id ?? "",
              Date: med?.created_at ?? ""
            }))
            : []
        )
      );

      //----------------- Surgery -------------------
      setSurgery(
        appointments.flatMap(apt => Array.isArray(apt?.Surgery) ? apt.Surgery.map(surgery => ({
          id: surgery?.id ?? "",
          name: surgery?.SurgeryName ?? "",
          eye: surgery?.eye ?? "",
          message: surgery?.message ?? "",
          appointmentId: apt?.id ?? "",
          Date: surgery?.created_at ?? ""
        }))
          : []
        )
      )

      // ---------------- REFRACTION ----------------
      setRefractionData(
        appointments.flatMap(apt =>
          Array.isArray(apt?.Refraction)
            ? apt.Refraction.map(ref => ({
              ...ref,
              appointmentId: apt.id,
              created_at: ref.created_at ?? "",
              id: ref.id ?? ""
            }))
            : []
        )
      );
      // ---------------- TREATMENT ----------------
      setTreatment(
        appointments.flatMap(apt =>
          Array.isArray(apt?.Treatment)
            ? apt.Treatment.map(trt => ({
              id: trt?.id ?? "",
              type: trt?.type ?? "",
              message: trt?.message ?? "",
              appointmentId: apt?.id ?? "",
              Date: trt?.created_at ?? ""
            }))
            : []
        )
      );

      // ---------------- ANTERIOR ----------------
      setAnterior(
        appointments
          .filter(apt => apt?.Anterior)
          .map(apt => ({
            ...apt.Anterior,
            appointmentId: apt.Anterior?.appointmentId ?? "",
            created_at: apt.Anterior?.created_at ?? "",
            id: apt.Anterior?.id ?? ""
          }))
      );

      // ---------------- POSTERIOR ----------------
      setPosterior(
        appointments
          .filter(apt => apt?.Posterior)
          .map(apt => ({
            ...apt.Posterior,
            appointmentId: apt.Posterior?.appointmentId ?? "",
            created_at: apt.Posterior?.created_at ?? "",
            id: apt.Posterior?.id ?? ""
          }))
      );

      // ---------------- ADVISE ----------------
      setAdvise(
        appointments.flatMap(apt =>
          Array.isArray(apt?.Advise)
            ? apt.Advise.map(adv => ({
              id: adv?.id ?? "",
              type: adv?.type ?? "",
              message: adv?.message ?? "",
              appointmentId: apt?.id ?? "",
              Date: adv?.created_at ?? ""
            }))
            : []
        )
      );

    } catch (error) {
      console.error("Error fetching patient data:", error);
    }
  };



  //  fetch all the patients
  const getAllPatients = async () => {
    try {
      const result = await getData('patient/v1/patient/allPatient')
      // console.log(result)
      setAllPatients(result)
    } catch (error) {
      console.log(error)
    }
  }


  // fetch all the doctors
  const getAllDoctors = async () => {
    try {
      const result = await getData('doctor/api/v1/get/allDoctors')
      // console.log(result)
      setAllDoctors(result)
    } catch (error) {
      console.log(error)
    }
  }


  // fetch all the users
  const getAllUser = async () => {
    try {
      const result = await getData('doctor/api/v1/get/allUsers')
      // console.log(result)
      setAllUsers(result)
    } catch (error) {
      console.log(error)
    }
  }


  const getDoctorsDetail = async (id) => {
    try {
      const result = await getData(`doctor/api/v1/${id}`, { Authorization: localStorage.getItem('token') })
      // console.log(result)
      setDoctorDetail(result)
      if (result.branch) {
        localStorage.setItem('branch', result.branch);
      }
      return result
    } catch (error) {
     return console.log(error)
    }
  }


  const getAppointmentCount = async () => {
    try {
      const result = await getData(`patient/v1/appointment/latestCounts`)
      return result
      // console.log(result)
    } catch (error) {
      return console.log(error)
    }
  }


  const getAllTodayAppointments = async (pageNum = 1, Branch) => {
    try {
      // const designation = localStorage.getItem('designation')
      // console.log({ pageNum })
      if (Branch === "Select-Branch" || Branch === "" || Branch === null) {
        const { data, totalPages, currentPage } = await getData(`patient/v1/appointment/allTodayAppointment?page=${pageNum}&limit=10`)
        return {
          data,
          totalPages,
          currentPage
        };

      }
      else {
        const { data, totalPages, currentPage } = await getData(`patient/v1/appointment/allTodayAppointment?page=${pageNum}&limit=10&Branch=${Branch}`)
        return {
          data,
          totalPages,
          currentPage
        };
      }
    } catch (error) {
      console.log(error)
      return { data: [], totalPages: 0, currentPage: 0 };
    }
  }


  const getPatientBranch = async () => {
    try {
      const data = await getData('patient/v1/appointment/allPatientBranch');
      // console.log(data)
      setPatientBranch(data);
    } catch (error) {
      console.error(error)
    }
  }


  const getAllAppointments = async (pageNum = 1, Branch) => {
    try {
      if (Branch === "Select-Branch" || Branch === "" || Branch === null) {
        const { data, totalPages, currentPage } = await getData(`patient/v1/appointment/allAppointment?page=${pageNum}&limit=10`)
        return {
          data,
          totalPages,
          currentPage
        };
      }
      else {
        const { data, totalPages, currentPage } = await getData(`patient/v1/appointment/allAppointment?page=${pageNum}&limit=10&Branch=${Branch}`)
        // console.log({ data, totalPages, currentPage })
        return {
          data,
          totalPages,
          currentPage
        };
      }
    } catch (error) {
      console.log(error);
      return { data: [], totalPages: 0, currentPage: 0 };
    }
  }


  const getAptStatus = async (id) => {
    try {
      const data = await getData(`patient/v1/appointment/AppointmentDetail/${id}`)
      return data
    } catch (error) {
      console.log(error)
    }
  }


  const changeStatus = async (id, status) => {
    try {
      const res = await putData(`patient/v1/appointment/updateStatus/${id}`, { status })
      // console.log(res.data.updatedAppointment)

    } catch (error) {
      console.log(error)
    }
  }


  const AppointmentSearch = async (searchKey, nextPage) => {
    try {
      if (searchKey === '') {
        return { data: [], totalPages: 0, currentPage: 0 }
      }
      else {
        const { data, totalPages, currentPage } = await getData(`patient/v1/appointment/Appointments/search?search=${searchKey}&page=${nextPage}&limit=10`)
        // console.log({data, totalPages, currentPage})
        return {
          data, totalPages, currentPage
        }
      }
    } catch (error) {
      console.log(error)
    }
  }


  //fetch  all Product
  const getAllProduct = async () => {
    try {
      const result = await getData('medical/api/getProduct')
      // console.log(result)
      setProduct(result)
    } catch (error) {
      console.log(error)
    }

  }


  //fetch  all company
  const getAllCompany = async () => {
    try {
      const result = await getData('medical/api/getSuppliers')
      // console.log(result)
      setCompany(result)
    } catch (error) {
      console.log(error)
    }

  }

  const getAllTemplates = async () => {
    try {
      const result = await getData('medical/api/getTemplates')
      setTemplates(result)
    } catch (error) {
      console.log(error)
    }
  }

  const getAllTemplatesData = async (id) => {
    try {
      const result = await getData(`medical/api/getTemplatesData/${id}`)
      setTemplatesData(result)
    } catch (error) {
      console.log(error)
    }
  }

  // delete functions

  const deleteComplaint = async (id) => {
    try {
      const res = await deleteData(`patient/v1/delete/deleteComplaint/${id}`)
      console.log(res)
      alert("item deleted successfully")
      return res
    } catch (error) {
      console.log(error)
      alert("item not deleted")
    }
  }

  const deleteHistroy = async (id) => {
    try {
      const res = await deleteData(`patient/v1/delete/deletehistroy/${id}`)
      console.log(res)
      alert("item deleted successfully")
      return res
    } catch (error) {
      console.log(error)
      alert("item not deleted")
    }
  }

  const deleteRefraction = async (id) => {
    try {
      const res = await deleteData(`patient/v1/delete/deleterefraction/${id}`)
      console.log(res)
      alert("item deleted successfully")
      return res
    } catch (error) {
      console.log(error)
      alert("item not deleted")
    }
  }

  const deleteDiagnosis = async (id) => {
    try {
      const res = await deleteData(`patient/v1/delete/deleteDiagnosis/${id}`)
      console.log(res)
      alert("item deleted successfully")
      return res
    } catch (error) {
      console.log(error)
      alert("item not deleted")
    }
  }

  const deleteAdvise = async (id) => {
    try {
      const res = await deleteData(`patient/v1/delete/deleteAdvise/${id}`)
      console.log(res)
      alert("item deleted successfully")
      return res
    } catch (error) {
      console.log(error)
      alert("item not deleted")
    }
  }

  const deleteMedicine = async (id) => {
    try {
      const res = await deleteData(`patient/v1/delete/deleteMedicine/${id}`)
      console.log(res)
      alert("item deleted successfully")
      return res
    } catch (error) {
      console.log(error)
      alert("item not deleted")
    }
  }

  const deleteVision = async (id) => {
    try {
      const res = await deleteData(`patient/v1/delete/deleteVision/${id}`)
      console.log(res)
      alert("item deleted successfully")
      return res
    } catch (error) {
      console.log(error)
      alert("item not deleted")
    }
  }

  const deleteTreatment = async (id) => {
    try {
      const res = await deleteData(`patient/v1/delete/deleteTreatment/${id}`)
      console.log(res)
      alert("item deleted successfully")
      return res
    } catch (error) {
      console.log(error)
      alert("item not deleted")
    }
  }

  const deleteAnterior = async (id) => {
    try {
      const res = await deleteData(`patient/v1/delete/deleteAnterior/${id}`)
      console.log(res)
      alert("item deleted successfully")
      return res
    } catch (error) {
      console.log(error)
      alert("item not deleted")
    }
  }

  const deletePosterior = async (id) => {
    try {
      const res = await deleteData(`patient/v1/delete/deletePosterior/${id}`)
      console.log(res)
      alert("item deleted successfully")
      return res
    } catch (error) {
      console.log(error)
      alert("item not deleted")
    }
  }

  const deleteSurgery = async (id) => {
    try {
      const res = await deleteData(`patient/v1/delete/deleteSurgery/${id}`)
      console.log(res)
      alert("item deleted successfully")
      return res
    } catch (error) {
      console.log(error)
      alert("item not deleted")
    }
  }



  return (
    <MainContext.Provider value={{
      allUsers, getAllUser, getAptStatus, changeStatus, getAppointmentCount, PatientReports, SetAid, Aid, getPatientData, diagnosisList, patientData, vision, histroy, Advise, treatment, Medicine, complaint, refractionData, anterior, posterior, SetP_id, P_id, getAllPatients, allPatients, getAllDoctors, allDoctors, getAllTodayAppointments, getDoctorsDetail, DoctorDetail, allergies, getAllAppointments, getPatientBranch, PatientBranch, AppointmentSearch, getAllCompany, getAllProduct, supplier, product, getAllTemplates, templates, getAllTemplatesData, templateData, surgery, setSurgery
      // delete functions
      , deleteComplaint, deleteHistroy, deleteRefraction, deleteDiagnosis, deleteAdvise, deleteMedicine, deleteVision, deleteTreatment, deleteAnterior, deletePosterior, deleteSurgery

    }}>
      {children}
    </MainContext.Provider>
  )
}

export default ContextProvider
