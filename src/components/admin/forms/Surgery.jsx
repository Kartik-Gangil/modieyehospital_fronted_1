import { useNavigate } from "react-router-dom";
import MainContext from "../../../context/MainContext";
// import Header from "../../admin/homepage/Header";
import { postData, putData } from "../../../services/FetchNodeAdminServices";
import Header from "../../admin/homepage/Header";
import { useContext, useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function Surgery({ index }) {
  const { surgery, Aid } = useContext(MainContext);

  const navigate = useNavigate();

  const emptyRow = { SurgeryName: "", eye: "", message: "" };
  const [items, setItems] = useState([emptyRow]);

  function normalizeItems(data) {
    if (!data?.length) return [emptyRow];

    return data.map(item => ({
      SurgeryName: item?.name || "",
      eye: item?.eye || "",
      message: item?.message || "",
      id: item?.id || ""
    }));
  }

  useEffect(() => {
    if (!surgery?.length) {
      setItems([emptyRow]);
      return;
    }

    let dataToUse = [];

    // ✅ If index is valid → show only that index row
    if (index !== undefined && index !== null) {
      const selected = surgery[index];

      if (selected) {
        dataToUse = [selected]; // wrap single item in array
      }
    } else {
      // ✅ If no index → show full array
      dataToUse = surgery;
    }

    const normalized = normalizeItems(dataToUse);
    setItems(normalized);

    setTimeout(() => {
      window.$(".selectpicker").selectpicker("refresh");
    }, 300);

  }, [surgery, index]);

  // Update input
  const handleChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };


  // Check row complete
  const isRowComplete = (row) => {
    return Boolean(
      row?.SurgeryName?.trim() &&
      ["left", "right", "both"].includes(row?.eye) &&
      row?.message?.trim()
    );
  };


  // Enter key handler
  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();

      // If last row & completed → add new row
      if (index === items.length - 1 && isRowComplete(items[index])) {
        setItems([...items, { ...emptyRow }]);
      }
    }
  };


  const handleSave = async () => {

    // remove empty rows
    const filteredItems = items.filter(row => isRowComplete(row));

    if (filteredItems.length === 0) {
      alert("Please enter at least one item");
      return;
    }


    try {
      // console.log(filteredItems)
      const response = await postData(`patient/v1/Surgery/${Aid}`, { filteredItems });

      const result = response.data;
      console.log(response)
      if (result.success) {
        alert("surgery Saved Successfully ✅");
        setItems([emptyRow]); // reset table
      } else {
        alert("Failed to save surgery ❌");
      }

    } catch (error) {
      console.error(error);
      alert("Server Error ❌");
    }
  };


  function resetData() {
    setItems([emptyRow])
  }

// surgery ki api update karni hai put request se jisme id bhi bhejna hai taki pata chale ki konsa surgery update karna hai


  const handleEditData = async () => {
    try {
      const surgeries = items.filter(row => isRowComplete(row));

      if (surgeries.length === 0) {
        alert("Please enter at least one item");
        return;
      }


      const formData = new FormData();

      // append surgeries array
      formData.append("surgeries", JSON.stringify(surgeries));
      console.log(surgeries[0])
      // convert FormData → Object (like your code)
      const formDataObj = {};
      formData.forEach((value, key) => {
        formDataObj[key] = value;
      });
     
      const result = await putData(`patient/v1/update/surgery/${items[0].id}`, surgeries[0]);

      if (result.status) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "surgeries Updated Successfully",
          showConfirmButton: false,
          timer: 2000
        });
      } else {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "surgeries Update Failed",
          showConfirmButton: false,
          timer: 2000
        });
      }

    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Server Error",
        timer: 2000
      });
    }
  };



  return (<div>

    <div style={{ background: "lightgrey", width: "100%", fontWeight: "bold", display: 'flex', alignItems: 'center', justifyContent: 'center', height: '20' }} >
      Add surgery
    </div>

    <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ width: '100%', margin: 10, padding: 10, borderRadius: 10 }}>

        <div className="table-responsive">
          <table className="table table-bordered table-sm purchase-table">
            <thead className="table-light">
              <tr>
                <th style={{ width: '45%' }}>Surgery Name</th>
                <th style={{ width: '15%' }}>Eye</th>
                <th>Personal Comment</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (

                <tr key={index}>
                  <td>
                    <select className="form-select selectpicker"
                      data-live-search="true"
                      aria-label="Default select example"
                      value={item.SurgeryName}
                      onChange={(e) => handleChange(index, "SurgeryName", e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                    >
                      <option defaultValue={true}>Select surgery Name</option>
                      <option value='Cataract Surgery'>Cataract surgery</option>
                      <option value='Cataract surgery under GVP'>Cataract surgery under GVP</option>
                      <option value='Cataract surgery + IOL Implantation'>Cataract surgery + IOL Implantation (In Bag / In Sulcus / SFIOL) under GVP (Posterior Polar Cataract) – B</option>
                      <option value='SFIOL + Anterior Vitrectomy under GVP'>SFIOL + Anterior Vitrectomy under GVP</option>
                      <option value='Injection Anti-VEGF'>Injection Anti-VEGF</option>

                      <option value='Injection Combination IVI'>Injection Combination IVI</option>
                      <option value='Injection Moxi / Dexa'>Injection Moxi / Dexa</option>
                      <option value='Injection Ozurdex'>Injection Ozurdex</option>
                      <option value='Vitrectomy + MP + FAE + EL + SOI under GVP'>Vitrectomy + MP + FAE + EL + SOI under GVP</option>
                      <option value='Belt Buckle + Vitrectomy + MP + FAE + EL + SOI under GVP'>Belt Buckle + Vitrectomy + MP + FAE + EL + SOI under GVP</option>
                      <option value='Vitrectomy + MP + ERM Peeling + ILM Transplant + FAE + EL + Gas under GVP'>Vitrectomy + MP + ERM Peeling + ILM Transplant + FAE + EL + Gas under GVP</option>
                      <option value='SFIOL + Vitrectomy + MP + FAE + EL + Gas under GVP'>SFIOL + Vitrectomy + MP + FAE + EL + Gas under GVP</option>

                      <option value='Corneal Tear Repair under GV'>Corneal Tear Repair under GVP</option>
                      <option value='Corneo-Scleral Tear under GVP'>Corneo-Scleral Tear under GVP</option>
                      <option value='Corneo-Scleral Tear Repair + Lensectomy + AC Reformation ± Anterior Vitrectomy under GVP'>Corneo-Scleral Tear Repair + Lensectomy + AC Reformation ± Anterior Vitrectomy under GVP</option>
                      <option value='Intraocular Foreign Body Removal under GVP'>Intraocular Foreign Body Removal under GVP</option>

                      <option value='Corneal Collagen Cross Linking (C3R)'>Corneal Collagen Cross Linking (C3R)</option>
                      <option value='PRK'>PRK</option>
                      <option value='Epicontoura'>Epicontoura</option>
                      <option value='LASIK'>LASIK</option>
                      <option value='LASIK Contoura'>LASIK Contoura</option>
                      <option value='Implantable Collamer Lens (ICL'>Implantable Collamer Lens (ICL)</option>
                      <option value='Contact Lens Assisted Corneal Collagen Cross Linking (CACXL)'>Contact Lens Assisted Corneal Collagen Cross Linking (CACXL)</option>
                      <option value='Intralamellar Corneal Tattooing under NVP'>Intralamellar Corneal Tattooing under NVP</option>
                      <option value='Phototherapeutic Keratectomy (PTK)'>Phototherapeutic Keratectomy (PTK)</option>

                      <option value='Pterygium Excision surgery + Mitomycin C'>Pterygium Excision surgery + Mitomycin C</option>
                      <option value='Penetrating Full Thickness Keratoplasty under GVP'>Penetrating Full Thickness Keratoplasty under GVP</option>
                      <option value='Anterior Lamellar Keratoplasty under GVP'>Anterior Lamellar Keratoplasty under GVP</option>
                      <option value='Endothelial Keratoplasty under GVP'>Endothelial Keratoplasty under GVP</option>
                      <option value='Amniotic Membrane Grafting'>Amniotic Membrane Grafting</option>
                      <option value='Limbal Stem Cell Transplantation'>Limbal Stem Cell Transplantation</option>
                      <option value='Keratoprosthesis under GVP'>Keratoprosthesis under GVP</option>
                      <option value='Temporary Punctal Plugs'>Temporary Punctal Plugs</option>

                      <option value='Trabeculectomy'>Trabeculectomy</option>
                      <option value='Trabeculotomy'>Trabeculotomy</option>
                      <option value='Bleb Revision surgery'>Bleb Revision surgery</option>
                      <option value='Glaucoma Valve surgery'>Glaucoma Valve surgery</option>
                      <option value='Minimally Invasive Glaucoma surgery (MIGS)'>Minimally Invasive Glaucoma surgery (MIGS)</option>
                      <option value='Cyclocryotherapy'>Cyclocryotherapy</option>

                      <option value='Injection Botox<'>Injection Botox</option>
                      <option value='Squint surgery'>Squint surgery</option>
                      <option value='Pediatric Cataract under GVP'>Pediatric Cataract under GVP</option>
                      <option value='Refractive Lens Exchange'>Refractive Lens Exchange</option>

                      <option value='External Dacryocystorhinostomy'>External Dacryocystorhinostomy (DCR)</option>
                      <option value='Endonasal Dacryocystorhinostom'>Endonasal Dacryocystorhinostomy (DCR)</option>
                      <option value='Dacryocystectomy'>Dacryocystectomy (DCT)</option>
                      <option value='Canalicular Repair / Canaliculoplasty ± Mini Monoka Shunt Implant'>Canalicular Repair / Canaliculoplasty ± Mini Monoka Shunt Implant</option>

                      <option value='Ptosis surgery'>Ptosis surgery</option>
                      <option value='Blepharoplasty'>Blepharoplasty</option>
                      <option value='Orbitotomy'>Orbitotomy</option>
                      <option value='Orbital Tumor Excision / Biopsy with Histopathological Evaluation'>Orbital Tumor Excision / Biopsy with Histopathological Evaluation</option>
                      <option value='Ocular Reconstruction with Artificial Prosthesis'>Ocular Reconstruction with Artificial Prosthesis</option>

                      <option value='Enucleation'>Enucleation</option>
                      <option value='Orbital Exenteration'>Orbital Exenteration</option>
                      <option value='Lid Tear Repair surgery'>Lid Tear Repair surgery</option>
                      <option value='Electrocautery for Trichiasis'>Electrocautery for Trichiasis</option>
                      <option value='Chalazion Incision & Curettage'>Chalazion Incision & Curettage</option>

                      <option value='Intrastromal / Intracameral Antimicrobials under GVP'>Intrastromal / Intracameral Antimicrobials under GVP</option>
                      <option value='Nevus Excision'>Nevus Excision</option>
                      <option value='Single Pass Four Throw Pupilloplasty (SFT) surgery'>Single Pass Four Throw Pupilloplasty (SFT) surgery</option>
                    </select>
                  </td>


                  <td>
                    <select className="form-select selectpicker"
                      data-live-search="true"
                      value={item.eye}
                      onChange={(e) => handleChange(index, "eye", e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                    >
                      <option value='Select eye'>Select Eye</option>
                      <option value='left'>Left Eye</option>
                      <option value='right'>Right Eye</option>
                      <option value='both'>Both Eye</option>
                    </select>
                  </td>

                  <td><input size={2} type="text" className="form-control" value={item.message} onChange={(e) => handleChange(index, "message", e.target.value)} onKeyDown={(e) => handleKeyDown(e, index)} /></td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>

        <div className="row">
          <div className="col-lg-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <button onClick={handleSave} type="button" className="btn btn-primary">Save</button>
          </div>

          <div className="col-lg-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <button onClick={resetData} type="button" className="btn btn-primary">Cancel</button>
          </div>

          <div className="col-lg-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <button onClick={handleEditData} type="reset" className="btn btn-primary">Edit</button>
          </div>

          <div className="col-lg-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <button type="submit" className="btn btn-primary">Create Templeate</button>
          </div>

        </div>



      </div>
    </div>
  </div>)
}

