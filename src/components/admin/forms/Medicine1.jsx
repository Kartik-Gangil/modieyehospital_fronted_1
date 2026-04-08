import { Link, useNavigate } from "react-router-dom";
import MainContext from "../../../context/MainContext";
import { postData, putData } from "../../../services/FetchNodeAdminServices";
import Swal from "sweetalert2";
import { useContext, useState, useEffect, useRef } from "react";

export default function Medicine1({ onClose, onRefresh, index }) 
{

  const { Medicine, getAllProduct, product, Aid, getAllTemplatesData, templateData, getAllTemplates, templates } = useContext(MainContext);
  const navigate = useNavigate();
  const emptyRow = { DrugName: "", customDrug: "", eye: "", type: "", dose: "", duration: "", time: "", comment: "." };
  const [items, setItems] = useState([emptyRow]);
  const [source, setSource] = useState("medicine");



  // this is for the search medicine implementation 
  const [highlighted, setHighlighted] = useState(-1);
  const [searchValues, setSearchValues] = useState([]); // one search string per row
  const [openRows, setOpenRows] = useState([]);          // which rows have dropdown open
  const dropdownRefs = useRef([]);                       // one ref per row

  // console.log(Medicine[index]);




  // Initialize when items change
  useEffect(() => {
    if (items.length > 1) {
      setSearchValues(items.map(item =>
        item.DrugName && item.DrugName !== "Other" ? item.DrugName : "Other"
      ));
    }
    setOpenRows(items.map(() => false));
  }, [items.length]);




  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      dropdownRefs.current.forEach((ref, i) => {
        if (ref && !ref.contains(e.target)) {
          setOpenRows(prev => { const copy = [...prev]; copy[i] = false; return copy; });
        }
      });
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);




  // const handleSelect = (id) => {
  //   handletemplateChange(id);
  //   setIsOpen(false);
  //   setSearch('');
  //   setHighlighted(-1);
  // };

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
      let duration = item.duration || item.Duration || "";
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
        customDrug: item?.customDrug || (!isInList && drug ? drug : ""),
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
      dataToUse = Medicine;
    }


    const normalized = normalizeItems(dataToUse);
    setItems(normalized);

    setSearchValues(normalized.map(item =>
      item.DrugName !== "Other" ? item.DrugName : item.customDrug || ""
    ));
    setOpenRows(normalized.map(() => false));


    setSource("medicine");

    setTimeout(() => {
      window.$('.selectpicker').selectpicker('refresh');
    }, 300);

  }, [Medicine, index]);

  useEffect(() => {
    if (templateData?.description) {
      const normalized = normalizeItems(templateData?.description);
      setItems(normalized);
      setSearchValues(normalized.map(item =>
        item.DrugName !== "Other" ? item.DrugName : item.customDrug || ""
      ));
      setOpenRows(normalized.map(() => false));
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


    

  // yh remove krega row ko jis row k cross pr ap click karoge usi row ko delete kr dega

  const handleRemoveRow = (index) => {
  if (items.length === 1) {
    setItems([emptyRow]); // at least one row rahe
    return;
  }

  const updated = items.filter((_, i) => i !== index);
  setItems(updated);
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
        alert("Medicine Saved Successfully ✅");
        setItems([emptyRow]); // reset table
      } else {
        alert("Failed to save Medicine ❌");
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
      let dataToUse = [];
      if (index !== undefined && index !== null) {
        const selected = Medicine[index];
        dataToUse = selected ? [selected] : [];
      } else {
        dataToUse = Medicine; // ✅ was wrongly wrapped as [Medicine] before
      }
      const normalized = normalizeItems(dataToUse);
      setItems(normalized);
      setSearchValues(normalized.map(item =>
        item.DrugName !== "Other" ? item.DrugName : item.customDrug || ""
      ));
      setOpenRows(normalized.map(() => false));
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
          Duration: row.duration && row.time ? `${row.duration} ${row.time}` : row.duration
        };
      });

      const filteredItems = preparedItems.filter(row => isRowComplete(row));

      if (filteredItems.length === 0) {
        alert("Please enter at least one item");
        return;
      }

      // console.log({ filteredItems });

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
    onClose();
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

          <div className="table-responsive" style={{ overflow: "visible", width: "100%" }}>
            <table className="table table-bordered table-sm purchase-table">
              <thead className="table-light">
                <tr>
                  <th>Drug Name</th>
                  <th>Eye</th>
                  <th>Type</th>
                  <th>Dose</th>
                  <th>Duration</th>
                  <th>Personal Comment</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (

                  <tr key={index}>
                    
                      {/*<select
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
*/}


                    <td>
  <div ref={el => dropdownRefs.current[index] = el} style={{ position: 'relative' }}>

    <input
      type="text"
      className="form-control form-control-sm"
      placeholder="Type medicine name..."
      value={searchValues[index] || ''}
      autoComplete="off"
      disabled={index == null && item.id}
      onChange={(e) => {
        const val = e.target.value;

        const newSearch = [...searchValues];
        newSearch[index] = val;
        setSearchValues(newSearch);

        const newOpen = [...openRows];
        newOpen[index] = val.length > 0;
        setOpenRows(newOpen);

        if (!val) handleChange(index, "DrugName", "");
      }}

      // ✅ ENTER + AUTO DETECT
      onKeyDown={(e) => {
        const val = searchValues[index]?.trim();

        const rowFiltered = product?.filter(p =>
          p.name.toLowerCase().includes(val?.toLowerCase())
        ) || [];

        if (e.key === 'ArrowDown') {
          setHighlighted(prev => Math.min(prev + 1, rowFiltered.length - 1));
        } 
        else if (e.key === 'ArrowUp') {
          setHighlighted(prev => Math.max(prev - 1, 0));
        } 
        else if (e.key === 'Enter') {
          e.preventDefault();

          if (highlighted >= 0 && rowFiltered[highlighted]) {
            const selected = rowFiltered[highlighted];

            const newSearch = [...searchValues];
            newSearch[index] = selected.name;
            setSearchValues(newSearch);

            handleChange(index, "DrugName", selected.name);
            handleChange(index, "customDrug", "");
          } else {
            // ✅ NOT FOUND → SAVE CUSTOM
            const exists = product?.some(p =>
              p.name.toLowerCase() === val.toLowerCase()
            );

            if (!exists && val) {
              handleChange(index, "DrugName", "Other");
              handleChange(index, "customDrug", val);
            }
          }

          const newOpen = [...openRows];
          newOpen[index] = false;
          setOpenRows(newOpen);
          setHighlighted(-1);

          handleKeyDown(e, index);
        } 
        else if (e.key === 'Escape') {
          const newOpen = [...openRows];
          newOpen[index] = false;
          setOpenRows(newOpen);
        }
      }}

      // ✅ BLUR FIX (MOST IMPORTANT)
      onBlur={() => {
        const val = searchValues[index]?.trim();
        if (!val) return;

        const exists = product?.some(p =>
          p.name.toLowerCase() === val.toLowerCase()
        );

        if (exists) {
          handleChange(index, "DrugName", val);
          handleChange(index, "customDrug", "");
        } else {
          handleChange(index, "DrugName", "Other");
          handleChange(index, "customDrug", val);
        }
      }}
    />

    {/* ✅ DROPDOWN */}
    {openRows[index] && (
      <div style={{
        position: 'absolute',
        width: '100%',
        zIndex: 1000,
        background: '#fff',
        border: '1px solid #ced4da',
        borderRadius: 4,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }}>

       <ul style={{listStyle: 'none', margin: 0, padding: 0}}>
        
          {(() => {
            const val = searchValues[index] || '';

            const rowFiltered = product?.filter(p =>
              p.name.toLowerCase().includes(val.toLowerCase())
            ) || [];

            if (rowFiltered.length > 0) {
              return rowFiltered.map((p, pIdx) => (
                <li
                  key={p.id}
                  style={{
                    padding: '6px 12px',
                    cursor: 'pointer',
                    fontSize: 13,
                    background: highlighted === pIdx ? '#e9ecef' : 'transparent'
                  }}
                  onMouseEnter={() => setHighlighted(pIdx)}
                  onClick={() => {
                    const newSearch = [...searchValues];
                    newSearch[index] = p.name;
                    setSearchValues(newSearch);

                    handleChange(index, "DrugName", p.name);
                    handleChange(index, "customDrug", "");

                    const newOpen = [...openRows];
                    newOpen[index] = false;
                    setOpenRows(newOpen);

                    setHighlighted(-1);
                  }}
                >
                  {p.name}
                </li>
              ));
            } else {
              // ✅ NOT FOUND OPTION
              return (
                <li
                  style={{
                    padding: '6px 12px',
                    color: '#007bff',
                    cursor: 'pointer',
                    fontStyle: 'italic'
                  }}
                  onClick={() => {
                    const val = searchValues[index];

                    handleChange(index, "DrugName", "Other");
                    handleChange(index, "customDrug", val);

                    const newOpen = [...openRows];
                    newOpen[index] = false;
                    setOpenRows(newOpen);
                  }}
                >
                  Add "{val}"
                </li>
              );
            }
          })()}

        </ul>
      </div>
    )}
  </div>

  {/* ✅ CUSTOM INPUT */}
  {item.DrugName === "Other" && (
    <input
      type="text"
      className="form-control mt-1"
      placeholder="Enter Medicine Name"
      value={item.customDrug}
      onChange={(e) =>
        handleChange(index, "customDrug", e.target.value)
      }
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

                      </select>
                    </td>

                    <td>
                      <select className="form-select selectpicker"
                               data-live-search="true"
                               aria-label="Default select example"
                               value={item.dose}
                               onChange={(e) => handleChange(index, "dose", e.target.value)} 
                               onKeyDown={(e) => handleKeyDown(e, index)}
                               disabled={index == null && item.id}
                      >
                        <option value='Select-Dose'>Select-Dose-</option>
                        <option value='1 Times/Day'>1 Times/Day</option>
                        <option value='2 Times/Day'>2 Times/Day</option>
                        <option value='3 Times/Day'>3 Times/Day</option>
                        <option value='4 Times/Day'>4 Times/Day</option> 
                        <option value='6 Times/Day'>6 Times/Day</option> 
                        <option value='Half Hourly'>Half Hourly </option> 
                        <option value='One Hourly'>One Hourly</option>  
                        <option value='Two Hourly'>Two Hourly</option> 
                        <option value='Two Hourly'>At night time</option> 

                      </select>
                    </td>

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
                    <td><i className="bi bi-x-circle" style={{justifyItems:'center', fontSize:24,marginLeft:25,cursor:'pointer'}} onClick={() => handleRemoveRow(index)} ></i></td>

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
    </div >)
}




