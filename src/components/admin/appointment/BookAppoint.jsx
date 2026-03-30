import { useState, useEffect, useRef, useContext } from "react";
import ReactDOM from "react-dom";
import { postData } from "../../../services/FetchNodeAdminServices";
import Swal from "sweetalert2";
import MainContext from "../../../context/MainContext";

// ─── Searchable Patient Dropdown ─────────────────────────────────────────────
function PatientSearchSelect({ patients, value, onChange }) {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [highlighted, setHighlighted] = useState(0);
    const [dropdownStyle, setDropdownStyle] = useState({});

    const wrapperRef = useRef(null);
    const inputRef = useRef(null);

    // Find selected patient label for display
    const selectedPatient = patients.find(p => String(p.id) === String(value));

    const filtered = query.trim()
        ? patients.filter(p =>
            p.FullName.toLowerCase().includes(query.toLowerCase()) ||
            String(p.id).includes(query)
        )
        : patients;

    // ✅ Calculate portal position
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

    const handleSelect = (patient) => {
        onChange(String(patient.id));
        setQuery("");
        setOpen(false);
    };

    const handleKeyDown = (e) => {
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
            marginTop: 30,
            padding: 0,
            listStyle: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}>
            {filtered.length === 0 ? (
                <li style={{ padding: "8px 12px", color: "#999", fontSize: 13 }}>
                    No patient found
                </li>
            ) : (
                filtered.map((patient, i) => (
                    <li
                        key={patient.id}
                        onMouseDown={() => handleSelect(patient)}
                        onMouseEnter={() => setHighlighted(i)}
                        style={{
                            padding: "7px 12px",
                            fontSize: 13,
                            cursor: "pointer",
                            background: i === highlighted ? "#e8f0fe" : "transparent",
                            borderBottom: "1px solid #f0f0f0",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <span>
                            <strong>{patient.FullName.slice(0, query.length)}</strong>
                            {patient.FullName.slice(query.length)}
                        </span>
                        <span style={{ fontSize: 15, color: "#000", marginLeft: 8 }}>
                            #{patient.id}
                        </span>
                    </li>
                ))
            )}
        </ul>
    );

    return (
        <div ref={wrapperRef} style={{ position: "relative" }}>
            <div
                className="form-control"
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "0 8px",
                    height: 38,
                    cursor: "text",
                    boxSizing: "border-box",
                    overflow: "hidden",
                    position: "relative",
                    background: "#fff",
                }}
                onClick={() => {
                    setOpen(true);
                    inputRef.current?.focus();
                }}
            >
                {/* ✅ Selected patient shown as overlay when not typing */}
                {!open && selectedPatient && query === "" && (
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
                        {selectedPatient.FullName}
                        <span style={{ color: "#999", marginLeft: 6, fontSize: 11 }}>
                            #{selectedPatient.id}
                        </span>
                    </span>
                )}

                {/* ✅ Input always mounted — no resize */}
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    placeholder={!selectedPatient ? "Search patient by name or ID..." : ""}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setHighlighted(0);
                        setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                    onKeyDown={handleKeyDown}
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

            {/* ✅ Portal — floats over everything */}
            {open && ReactDOM.createPortal(dropdown, document.body)}
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function BookAppoint({ onRefresh, close }) {
    const { getAllPatients, allPatients, getAllDoctors, allDoctors } = useContext(MainContext);
    const [patient, setPatient] = useState('');
    const [doctor, setDoctor] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState(
        new Date().toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit' })
    );

    useEffect(() => {
        getAllPatients();
        getAllDoctors();

        setTimeout(() => {
            window.$('.selectpicker').selectpicker('refresh');
        }, 500);
    }, []);

    function resetData() {
        setPatient('');
        setDoctor('');
        setDate('');
        setTime('');
    }

    function formatTo12Hour(time) {
        if (!time) return "";
        let [hour, minute] = time.split(":");
        hour = parseInt(hour);
        const ampm = hour >= 12 ? "PM" : "AM";
        hour = hour % 12 || 12;
        return `${hour}:${minute} ${ampm}`;
    }

    const handleSubmit = async () => {
        if (!patient) { alert("Please select a patient"); return; }
        if (!doctor) { alert("Please select a doctor"); return; }
        if (!date) { alert("Please select a date"); return; }
        if (!time) { alert("Please select a time"); return; }

        const formDataObj = {
            P_id: patient,
            D_id: doctor,
            date: new Date(date).toISOString(),
            time: formatTo12Hour(time),
        };

        const result = await postData('patient/v1/appointment/createAppointment', formDataObj);

        if (result.status) {
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Appointment Booked Successfully",
                showConfirmButton: false,
                timer: 2000,
            });
        } else {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Appointment Booking Failed",
                showConfirmButton: false,
                timer: 2000,
            });
        }

        onRefresh();
        close();
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
            <div style={{ width: 600, height: 'auto', background: '#f7f1e3', margin: 10, padding: 10, borderRadius: 10 }}>

                {/* ✅ Patient — custom searchable dropdown */}
                <div className="row" style={{ marginBottom: 5 }}>
                    <div className="col-xs-12">
                        <label style={{ fontSize: 15, color: '#000', margin: 5 }}>
                            Appointment For Registered Patients (पंजीकृत मरीज चुने)
                        </label>
                        <PatientSearchSelect
                            patients={allPatients}
                            value={patient}
                            onChange={setPatient}
                        />
                    </div>
                </div>

                {/* Doctor — keep original selectpicker */}
                <div className="row" style={{ marginBottom: 5 }}>
                    <div className="col-xs-12">
                        <label style={{ fontSize: 15, color: '#000', margin: 5 }}>
                            Appointment with Doctor (डॉक्टर चुने)
                        </label>
                        <select
                            className="form-select selectpicker"
                            data-live-search="true"
                            value={doctor}
                            onChange={(e) => setDoctor(e.target.value)}
                            required
                        >
                            <option value=''>Select Doctor</option>
                            {allDoctors.map((item, i) => (
                                <option key={i} value={item.id}>{item.FullName}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Date */}
                <div className="row mb-10">
                    <div className="col-xs-12">
                        <label style={{ fontSize: 15, color: '#000', margin: 5 }}>
                            Appointment Date (परीक्षण भेंट दिनांक)
                        </label>
                        <input
                            type="date"
                            required
                            className="form-control"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                </div>

                {/* Time */}
                <div className="row mb-10">
                    <div className="col-xs-12">
                        <label style={{ fontSize: 15, color: '#000', margin: 5 }}>Time</label>
                        <input
                            type="time"
                            required
                            className="form-control"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                        />
                    </div>
                </div>

                {/* Buttons */}
                <div className="row" style={{ marginBottom: 5, marginTop: 20 }}>
                    <div className="col-6" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <button type="button" onClick={handleSubmit} className="btn btn-primary">Book Now</button>
                    </div>
                    <div className="col-6" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <button type="button" onClick={resetData} className="btn btn-primary">Cancel</button>
                    </div>
                </div>

            </div>
        </div>
    );
}