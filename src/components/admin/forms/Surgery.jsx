import { useNavigate } from "react-router-dom";
import MainContext from "../../../context/MainContext";
import { postData, putData } from "../../../services/FetchNodeAdminServices";
import Header from "../../admin/homepage/Header";
import { useContext, useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import Swal from "sweetalert2";

const ALL_SURGERIES = [
  'Amniotic Membrane Grafting',
  'Anterior Lamellar Keratoplasty under GVP',
  'Belt Buckle + Vitrectomy + MP + FAE + EL + SOI under GVP',
  'Blepharoplasty',
  'Bleb Revision surgery',
  'Canalicular Repair / Canaliculoplasty ± Mini Monoka Shunt Implant',
  'Cataract Surgery',
  'Cataract surgery under GVP',
  'Cataract surgery + IOL Implantation',
  'Chalazion Incision & Curettage',
  'Corneal Collagen Cross Linking (C3R)',
  'Corneal Tear Repair under GVP',
  'Corneo-Scleral Tear under GVP',
  'Corneo-Scleral Tear Repair + Lensectomy + AC Reformation ± Anterior Vitrectomy under GVP',
  'Contact Lens Assisted Corneal Collagen Cross Linking (CACXL)',
  'Cyclocryotherapy',
  'Dacryocystectomy',
  'Electrocautery for Trichiasis',
  'Endonasal Dacryocystorhinostomy',
  'Endothelial Keratoplasty under GVP',
  'Enucleation',
  'Epicontoura',
  'External Dacryocystorhinostomy',
  'Glaucoma Valve surgery',
  'Implantable Collamer Lens (ICL)',
  'Injection Anti-VEGF',
  'Injection Botox',
  'Injection Combination IVI',
  'Injection Moxi / Dexa',
  'Injection Ozurdex',
  'Intralamellar Corneal Tattooing under NVP',
  'Intrastromal / Intracameral Antimicrobials under GVP',
  'Intraocular Foreign Body Removal under GVP',
  'Keratoprosthesis under GVP',
  'LASIK',
  'LASIK Contoura',
  'Lid Tear Repair surgery',
  'Limbal Stem Cell Transplantation',
  'Minimally Invasive Glaucoma surgery (MIGS)',
  'Nevus Excision',
  'Ocular Reconstruction with Artificial Prosthesis',
  'Orbital Exenteration',
  'Orbital Tumor Excision / Biopsy with Histopathological Evaluation',
  'Orbitotomy',
  'PRK',
  'Pediatric Cataract under GVP',
  'Penetrating Full Thickness Keratoplasty under GVP',
  'Phototherapeutic Keratectomy (PTK)',
  'Pterygium Excision surgery + Mitomycin C',
  'Ptosis surgery',
  'Refractive Lens Exchange',
  'SFIOL + Anterior Vitrectomy under GVP',
  'SFIOL + Vitrectomy + MP + FAE + EL + Gas under GVP',
  'Single Pass Four Throw Pupilloplasty (SFT) surgery',
  'Squint surgery',
  'Temporary Punctal Plugs',
  'Trabeculectomy',
  'Trabeculotomy',
  'Vitrectomy + MP + FAE + EL + SOI under GVP',
  'Vitrectomy + MP + ERM Peeling + ILM Transplant + FAE + EL + Gas under GVP',
];

// ─── Searchable Surgery Dropdown ────────────────────────────────────────────
function SurgerySearchSelect({ value, onChange, onKeyDown }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const [dropdownStyle, setDropdownStyle] = useState({});

  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  const filtered = query.trim()
    ? ALL_SURGERIES.filter(s => s.toLowerCase().startsWith(query.toLowerCase()))
    : ALL_SURGERIES;

  // ✅ Calculate position on open
  useEffect(() => {
    if (open && wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: "fixed",
        top: rect.bottom + 2,
        left: rect.left,
        width: rect.width,
        zIndex: 99999,
      });
    }
  }, [open]);

  // ✅ Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (surgery) => {
    onChange(surgery);
    setQuery("");
    setOpen(false);
  };

  const handleKeyboardNav = (e) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted(h => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted(h => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[highlighted]) handleSelect(filtered[highlighted]);
      if (onKeyDown) onKeyDown(e);
    } else if (e.key === "Escape") {
      setOpen(false);
      setQuery("");
    }
  };

  const dropdown = (
    <ul style={{
      ...dropdownStyle,
      background: "#fff",
      border: "1px solid #ccc",
      borderRadius: 4,
      maxHeight: 220,
      overflowY: "auto",
      marginTop: '40px',
      padding: 0,
      listStyle: "none",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    }}>
      {filtered.length === 0 ? (
        <li style={{ padding: "8px 12px", color: "#999", fontSize: 13 }}>
          No results found
        </li>
      ) : (
        filtered.map((surgery, i) => (
          <li
            key={surgery}
            onMouseDown={() => handleSelect(surgery)}
            onMouseEnter={() => setHighlighted(i)}
            style={{
              padding: "7px 12px",
              fontSize: 13,
              cursor: "pointer",
              background: i === highlighted ? "#e8f0fe" : "transparent",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <strong>{surgery.slice(0, query.length)}</strong>
            {surgery.slice(query.length)}
          </li>
        ))
      )}
    </ul>
  );

  return (
    <div ref={wrapperRef} style={{ position: "relative" }}>

      {/* ✅ Fixed height box — never resizes */}
      <div
        className="form-control"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "0 8px",
          height: 34,
          cursor: "text",
          boxSizing: "border-box",
          overflow: "hidden",
          position: "relative",
        }}
        onClick={() => {
          setOpen(true);
          inputRef.current?.focus();
        }}
      >
        {/* ✅ Selected value shown as non-interactive overlay */}
        {!open && value && query === "" && (
          <span style={{
            position: "absolute",
            left: 8,
            right: 24,
            fontSize: 13,
            pointerEvents: "none",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            color: "#212529",
          }}>
            {value}
          </span>
        )}

        {/* ✅ Input always mounted — no swap, no resize */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          placeholder={!value ? "Search surgery..." : ""}
          onChange={(e) => {
            setQuery(e.target.value);
            setHighlighted(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyboardNav}
          style={{
            border: "none",
            outline: "none",
            flex: 1,
            fontSize: 13,
            background: "transparent",
            minWidth: 0,
            height: "100%",
            cursor: "text",
            color: "#212529",
          }}
        />

        <span style={{ color: "#888", fontSize: 10, flexShrink: 0 }}>▼</span>
      </div>

      {/* ✅ Portal — floats over everything including buttons */}
      {open && ReactDOM.createPortal(dropdown, document.body)}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function Surgery({ index, onRefresh, onClose }) {
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
      id: item?.id || "",
    }));
  }

  useEffect(() => {
    if (!surgery?.length) {
      setItems([emptyRow]);
      return;
    }

    let dataToUse = [];
    if (index !== undefined && index !== null) {
      const selected = surgery[index];
      if (selected) dataToUse = [selected];
    } else {
      dataToUse = surgery;
    }

    const normalized = normalizeItems(dataToUse);
    setItems(normalized);
  }, [surgery, index]);

  const handleChange = (idx, field, value) => {
    const updated = [...items];
    updated[idx][field] = value;
    setItems(updated);
  };

  const isRowComplete = (row) =>
    Boolean(
      row?.SurgeryName?.trim() &&
      ["left", "right", "both"].includes(row?.eye) &&
      row?.message?.trim()
    );

  const handleKeyDown = (e, idx) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (idx === items.length - 1 && isRowComplete(items[idx])) {
        setItems([...items, { ...emptyRow }]);
      }
    }
  };

  const handleSave = async () => {
    const filteredItems = items.filter(row => isRowComplete(row));
    if (filteredItems.length === 0) {
      alert("Please enter at least one item");
      return;
    }
    try {
      const response = await postData(`patient/v1/Surgery/${Aid}`, { filteredItems });
      const result = response.data;
      if (result.success) {
        alert("Surgery Saved Successfully ✅");
        setItems([emptyRow]);
      } else {
        alert("Failed to save surgery ❌");
      }
    } catch (error) {
      console.error(error);
      alert("Server Error ❌");
    }
    onRefresh()
    onClose()
  };

  const handleEditData = async () => {
    try {
      const surgeries = items.filter(row => isRowComplete(row));
      if (surgeries.length === 0) {
        alert("Please enter at least one item");
        return;
      }
      const result = await putData(
        `patient/v1/update/surgery/${surgeries[0].id}`,
        surgeries[0]
      );
      if (result.status) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Surgery Updated Successfully",
          showConfirmButton: false,
          timer: 2000,
        });
      } else {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Surgery Update Failed",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({ icon: "error", title: "Server Error", timer: 2000 });
    }
    onRefresh()
    onClose()
  };

  function resetData() {
    setItems([emptyRow]);
  }

  return (
    <div>
      <div style={{
        background: "lightgrey",
        width: "100%",
        fontWeight: "bold",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: 20,
      }}>
        Add Surgery
      </div>

      <div style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <div style={{ width: "100%", margin: 10, padding: 10, borderRadius: 10 }}>

          {/* ✅ overflow visible so portal isn't clipped */}
          <div style={{ overflowX: "auto", overflowY: "visible" }}>
            <table className="table table-bordered table-sm purchase-table">
              <thead className="table-light">
                <tr>
                  <th style={{ width: "45%" }}>Surgery Name</th>
                  <th style={{ width: "15%" }}>Eye</th>
                  <th>Personal Comment</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx}>

                    {/* ✅ overflow visible on td so nothing clips the portal */}
                    <td style={{ overflow: "visible" }}>
                      <SurgerySearchSelect
                        value={item.SurgeryName}
                        onChange={(val) => handleChange(idx, "SurgeryName", val)}
                        onKeyDown={(e) => handleKeyDown(e, idx)}
                      />
                    </td>

                    <td>
                      <select
                        className="form-select"
                        value={item.eye}
                        onChange={(e) => handleChange(idx, "eye", e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, idx)}
                      >
                        <option value="">Select Eye</option>
                        <option value="left">Left Eye</option>
                        <option value="right">Right Eye</option>
                        <option value="both">Both Eye</option>
                      </select>
                    </td>

                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={item.message}
                        onChange={(e) => handleChange(idx, "message", e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, idx)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="row" style={{ marginTop: 10 }}>
            <div className="col-lg-3" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <button onClick={handleSave} type="button" className="btn btn-primary">Save</button>
            </div>
            <div className="col-lg-3" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <button onClick={resetData} type="button" className="btn btn-primary">Cancel</button>
            </div>
            <div className="col-lg-3" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <button onClick={handleEditData} type="button" className="btn btn-primary">Edit</button>
            </div>
            <div className="col-lg-3" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <button type="submit" className="btn btn-primary">Create Template</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}