import { Link, useNavigate } from "react-router-dom";
import MainContext from "../../../context/MainContext";
import { postData, putData } from "../../../services/FetchNodeAdminServices";
import Swal from "sweetalert2";
import { useContext, useState, useEffect } from "react";

export default function Medicine1({ onClose, onRefresh, index }) {
  const { Medicine, getAllProduct, product, Aid, getAllTemplatesData, templateData, getAllTemplates, templates } = useContext(MainContext);
  const navigate = useNavigate();
  const emptyRow = { DrugName: "", customDrug: "", eye: "", type: "", dose: "", duration: "", time: "", comment: "" };
  const [items, setItems] = useState([emptyRow]);
  const [source, setSource] = useState("medicine");
  useEffect(() => {
    getAllProduct()
    getAllTemplates()
  }, [])


  const normalizeItems = (data) => {
    if (!data) return [emptyRow];
    const arr = Array.isArray(data) ? data : [data];

    return arr.map(item => {
      const drug = item.DrugName || item.medicine || "";

      // prepare duration/time separation when backend sends combined string
      let duration = item.duration || "";
      let time = item.time || item.Intake || "";
      if (!time && duration) {
        const parts = duration.split(" ");
        time = parts.pop();
        duration = parts.join(" ");
      }

      // check if drug exists in product list
      const isInList = product?.some(p => p.name === drug);

      return {
        id: item.id || "",
        DrugName: isInList ? drug : "Other",
        customDrug: isInList ? "" : drug,
        eye: item.eye || "",
        type: item.type || "",
        dose: item.Dose || item.dose || "",
        duration,
        time,
        comment: item.comment || item.message || ""
      };
    });
  };


  useEffect(() => {

    if (!Medicine?.length) {
      setItems([emptyRow]);
      return;
    }

    let dataToUse = [];

    // ✅ If index is provided → show only that row
    if (index !== undefined && index !== null) {
      const selected = Medicine[index];
      if (selected) {
        dataToUse = [selected];
      }
    }
    // ✅ If index not provided → show full array (global mode)
    else {
      // include an extra blank row so user can add new items without affecting existing ones
      dataToUse = [Medicine];
    }

    const normalized = normalizeItems(dataToUse);
    setItems(normalized);
    setSource("medicine");

    setTimeout(() => {
      window.$('.selectpicker').selectpicker('refresh');
    }, 300);

  }, [Medicine, index]);

  useEffect(() => {
    if (templateData?.description) {
      setItems(normalizeItems(templateData?.description));
      setSource("template");
    }
  }, [templateData]);



  // Update input
  const handleChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };


  // Check row complete
  const isRowComplete = (row) => {

    return (
      row.DrugName &&
      row.eye &&
      row.type &&
      row.dose &&
      row.duration &&
      row.time &&
      row.comment
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

    // combine duration and time into single string so backend receives a unified value
    const preparedItems = items.map(row => {
      const drugName = row.DrugName === "Other" ? row.customDrug : row.DrugName;
      return {
        ...row,
        DrugName: drugName,
        duration: row.duration && row.time ? `${row.duration} ${row.time}` : row.duration
      };
    });

    // in global mode we only want to send rows without an id (new rows)
    const newItems = preparedItems.filter(row => isRowComplete(row) && !row.id);

    if (newItems.length === 0) {
      alert("Please enter at least one new medicine to save");
      return;
    }

    try {
      const response = await postData(`patient/v1/Medicine/${Aid}`, { filteredItems: newItems });
      const result = response.data;
      if (result.success) {
        alert("Bill Saved Successfully ✅");
        setItems([emptyRow]); // reset table
      } else {
        alert("Failed to save bill ❌");
      }
    } catch (error) {
      console.error(error);
      alert("Server Error ❌");
    }
    onClose();
    onRefresh();
  };


  function resetData() {
    setItems([emptyRow])
  }

  // synchronize items when Medicine or product list changes
  // but respect `index` so single-row mode isn't overwritten.
  useEffect(() => {
    if (Medicine?.length && product?.length) {
      if (index !== undefined && index !== null) {
        const selected = Medicine[index];
        setItems(normalizeItems(selected ? [selected] : []));
      } else {
        setItems(normalizeItems([Medicine]));
      }
    }
  }, [Medicine, product, index]);



  {/* const handleEditData = async () => {
    try {
      const medicines = items;

      // if (filteredItems.length === 0) {
      //   alert("Please enter at least one item");
      //   return;
      // }
      console.log(items)

      const formData = new FormData();

      // append medicines array
      formData.append("medicines", JSON.stringify(medicines));

      // convert FormData → Object (like your code)
      const formDataObj = {};
      formData.forEach((value, key) => {
        formDataObj[key] = value;
      });

      const result = await putData(`patient/v1/update/Medicine/${medicines[0]?.id}`, medicines[0]);

      if (result.status) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Medicine Updated Successfully",
          showConfirmButton: false,
          timer: 2000
        });
      } else {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Medicine Update Failed",
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
    onClose();
    onRefresh();
  };
*/}

  const handleEditData = async () => {
    try {
      // ✅ convert Other → real value and concat duration/time
      const preparedItems = items.map(row => {
        const drugName = row.DrugName === "Other" ? row.customDrug : row.DrugName;
        return {
          ...row,
          DrugName: drugName,
          duration: row.duration && row.time ? `${row.duration} ${row.time}` : row.duration
        };
      });

      const filteredItems = preparedItems.filter(row => isRowComplete(row));

      if (filteredItems.length === 0) {
        alert("Please enter at least one item");
        return;
      }

      console.log(filteredItems);

      const result = await putData(`patient/v1/update/Medicine/${filteredItems[0]?.id}`, filteredItems[0]);

      if (result.status) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Medicine Updated Successfully",
          showConfirmButton: false,
          timer: 2000
        });
      } else {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Medicine Update Failed",
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

    onClose();
    onRefresh();
  };



  const handleCreateTemplate = async () => {
    try {
      const filteredItems = items
        .map(row => ({
          ...row,
          duration: row.duration && row.time ? `${row.duration} ${row.time}` : row.duration
        }))
        .filter(row => isRowComplete(row));

      if (filteredItems.length === 0) {
        alert("Please enter at least one item");
        return;
      }

      const Name = prompt("Template Name:", ""); // Prompt for template name

      const result = await postData(`medical/api/addTemplate`, { description: filteredItems, name: Name });
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
    onRefresh();
  }

  const handletemplateChange = (id) => {
    if (items.some(isRowComplete)) {
      if (!window.confirm("This will overwrite current medicines. Continue?")) return;
    }
    getAllTemplatesData(id);
  }


  return (
    <div>

      <div style={{ background: "lightgrey", width: "100%", fontWeight: "bold", display: 'flex', alignItems: 'center', justifyContent: 'center', height: '20' }} >
        Add Medicine
      </div>
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
      <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '100%', margin: 10, padding: 10, borderRadius: 10 }}>

          <div className="table-responsive">
            <table className="table table-bordered table-sm purchase-table">
              <thead className="table-light">
                <tr>
                  <th>Drug Name</th>
                  <th>Eye</th>
                  <th>Type</th>
                  <th>Dose</th>
                  <th>Duration</th>
                  <th>Personal Comment</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (

                  <tr key={index}>
                    <td>
                      <select
                        className="form-select"
                        value={item.DrugName}
                        onChange={(e) => {
                          const value = e.target.value;
                          handleChange(index, "DrugName", value);

                          if (value !== "Other") {
                            handleChange(index, "customDrug", "");
                          }
                        }}
                        disabled={index == null && item.id}
                      >
                        <option value="">Select Drug Name</option>

                        {product?.map((p) => (
                          <option key={p.id} value={p.name}>
                            {p.name}
                          </option>
                        ))}

                        <option value="Other">Other</option>
                      </select>

                      {/* Show textbox ONLY when Other selected */}
                      {item.DrugName === "Other" && (
                        <input
                          type="text"
                          className="form-control mt-1"
                          placeholder="Enter Medicine Name"
                          value={item.customDrug}
                          onChange={(e) =>
                            handleChange(index, "customDrug", e.target.value)
                          }
                          disabled={index == null && item.id}
                        />
                      )}
                    </td>


                    <td>
                      <select className="form-select selectpicker"
                        data-live-search="true"
                        value={item.eye}
                        onChange={(e) => handleChange(index, "eye", e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        disabled={index == null && item.id}
                      >
                        <option value='Select eye'>Select Eye</option>
                        <option value='Left eye'>Left Eye</option>
                        <option value='Right eye'>Right Eye</option>
                        <option value='Both eye'>Both Eye</option>
                      </select>
                    </td>

                    <td>
                      <select className="form-select selectpicker"
                        data-live-search="true"
                        aria-label="Default select example"
                        value={item.type}
                        onChange={(e) => handleChange(index, "type", e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        disabled={index == null && item.id}
                      >
                        <option value='Select Type'>Select Type</option>
                        <option value='Eye Drop'>Eye Drop</option>
                        <option value='Eye/o'>Eye/o</option>
                        <option value='Tablet'>Tablet</option>
                        <option value='Syrup'>Syrup</option>
                        <option value='Other'>Other</option>

                      </select>
                    </td>

                    <td><input size={2} type="text" className="form-control" value={item.dose} onChange={(e) => handleChange(index, "dose", e.target.value)} onKeyDown={(e) => handleKeyDown(e, index)} disabled={index == null && item.id} /></td>

                    <td>
                      <div style={{ display: 'flex' }}>
                        <input size={2} style={{ width: "70px", marginRight: 5 }} type="text" className="form-control form-control-sm" value={item.duration} onChange={(e) => handleChange(index, "duration", e.target.value)} onKeyDown={(e) => handleKeyDown(e, index)} disabled={index == null && item.id} />
                        <select className="form-select selectpicker"
                          data-live-search="true"
                          value={item.time}
                          onChange={(e) => handleChange(index, "time", e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, index)}
                          disabled={index == null && item.id}
                        >
                          <option value='Select Duration'>Select Duration</option>
                          <option value='Days'>Days</option>
                          <option value='Week'>Week</option>
                          <option value='Month'>Month</option>
                          <option value='Year'>Year</option>


                        </select>
                      </div>
                    </td>

                    <td><input size={2} type="text" className="form-control" value={item.comment} onChange={(e) => handleChange(index, "comment", e.target.value)} onKeyDown={(e) => handleKeyDown(e, index)} disabled={index == null && item.id} /></td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>

          <div className="row">
            {index !== undefined && index !== null ? (
              <div className="col-lg-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <button onClick={handleEditData} type="reset" className="btn btn-primary">Update</button>
              </div>
            ) : (
              <div className="col-lg-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <button onClick={handleSave} type="button" className="btn btn-primary">Save</button>
              </div>
            )}

            <div className="col-lg-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <button onClick={resetData} type="button" className="btn btn-primary">Cancel</button>
            </div>

            <div className="col-lg-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <button type="submit" onClick={handleCreateTemplate} className="btn btn-primary">Create Templeate</button>
            </div>

          </div>



        </div>
      </div>
    </div>)
}




