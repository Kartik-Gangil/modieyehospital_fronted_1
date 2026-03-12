import { useContext, useEffect, useState } from "react";
import Header from "../../admin/homepage/Header";
import { postData } from "../../../services/FetchNodeAdminServices";
import Swal from "sweetalert2";
import MainContext from "../../../context/MainContext";
import { useNavigate } from "react-router-dom";

export default function AddProduct() 
{

    const { getAllCompany, supplier } = useContext(MainContext);

    useEffect(() => {
        getAllCompany()
    }, [])
    const navigate = useNavigate();

    const [supplierId, setSupplierId] = useState('');
    const [product, setProduct] = useState('');
    const [packing, setPacking] = useState('');
    const [company, setCompany] = useState('');

    // const [status, setStataus] = useState('');
   //  const [type, setType] = useState('');
   // const [ask, setAsk] = useState('');
   // const [unit1, setUnit1] = useState('');
   // const [unit2, setUnit2] = useState('');
   // const [decimal, setDecimal] = useState('');
   // const [color, setColor] = useState('');
   // const [item, setItem] = useState('');
  //  const [salt, setSalt] = useState('');
  //  const [category, setCategory] = useState('');
  //  const [hsn, setHsn] = useState('');


 //   const [local, setLocal] = useState('');
 //   const [cental, setCentral] = useState('');
   // const [rateA, setRateA] = useState('');
   // const [igst, setIgst] = useState('');
   // const [rateB, setRateB] = useState('');
   // const [case2, setCase2] = useState('');
   // const [csr, setCSR] = useState('');
   // const [cost, setCost] = useState('');
  //  const [rateC, setRateC] = useState('');
  //  const [neg, setNeg] = useState('');

   const [mrp, setMRP] = useState('');
   const [cgst, setCGST] = useState('');
   const [prate, setPRate] = useState('');
   const [case1, setCase1] = useState('');
   const [sgst, setSgst] = useState('');


    const handleSubmitData = async () => {
        alert(1)
        var formData = new FormData()

       // formData.append('status', status);
       // formData.append('type', type);
        formData.append('supplierId', supplierId);
        formData.append('name', product);
        formData.append('packing', packing);
       // formData.append('askDose', ask);
       // formData.append('unitPrimary', unit1);
       // formData.append('unitSecondary', unit2);
       // formData.append('decimal', decimal);
       // formData.append('colorType', color);
       // formData.append('itemType', item);
        formData.append('company', company);
       // formData.append('salt', salt);
      //  formData.append('category', category);
      //  formData.append('hsnSac', hsn);
      //  formData.append('localName', local);
      //  formData.append('centralName', cental);
        formData.append('mrp', parseFloat(mrp));
       // formData.append('rateA', rateA);
        formData.append('ConvCASE', case1);

        formData.append('sgst', sgst);
       // formData.append('rateA', rateA);
      //  formData.append('igst', igst);
        formData.append('Prate', prate);
      //  formData.append('rateB', rateB);
       // formData.append('ConvCAS', case2);
        formData.append('cgst', cgst);
       // formData.append('csr', csr);
       // formData.append('cost', cost);
       // formData.append('rateC', rateC);
      //  formData.append('neg', neg);
        const formDataObj = {};

        formData.forEach((value, key) => {
            formDataObj[key] = value;
        });

        console.log(formDataObj)

        var result = await postData('medical/api/addMedicine', formDataObj);

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



    }


    function resetData() {
      //  setStataus('');
      //  setType('');
      // setHide('');
        setProduct('');
        setPacking('');
     //  setAsk('');
     //  setUnit1('')
     //   setUnit2('');
     //   setDecimal('');
     //   setColor('');
     //   setItem('');
        setCompany('');
     //   setSalt('');
     //   setCategory('');
     //   setHsn('');
     //   setLocal('');
     //   setCentral('');
        setMRP('');
     //   setRateA('');
        setCase1('');
        setSgst('');
     //   setIgst('');
        setPRate('');
    //    setRateB('');
     //   setCase2('');
        setCGST('');
     //   setCSR('');
     //   setCost('');
      //  setRateC('');
      //  setNeg('');

    }



    return (<div>
        <div>
            <Header />
        </div>

        <div style={{ background: "lightgrey", width: "100%", fontWeight: "bold", display: 'flex', alignItems: 'center', justifyContent: 'center', height: '20' }} >
            Add Product
        </div>


        <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: 900, height: 'auto', background: '#f7f1e3', margin: 10, padding: 10, borderRadius: 10 }}>

                <div className="row">
                    <div className="col-lg-6 col-xs-12 mb-3">
                        <label className="form-label fw-bold ms-3">Product Name:</label>
                        <input type="text" value={product} onChange={(event) => setProduct(event.target.value)} className="form-control" placeholder="Enter Product Name." />
                    </div>


                    <div className="col-lg-6 col-xs-12 mb-3">
                        <label className="form-label fw-bold ms-3">Packing:</label>
                        <input type="text" value={packing} onChange={(event) => setPacking(event.target.value)} className="form-control" placeholder="Enter Packing." />
                    </div>


                  {/*  <div className="col-lg-4 col-xs-12 mb-3">
                        <label className="form-label fw-bold ms-3">Status:</label>
                        <select className="form-select"
                            value={status}
                            onChange={(event) => setStataus(event.target.value)}
                        >
                            <option value="Select-status">Select-status</option>
                            <option value="CONTINUE">Continue</option>
                            <option value="DISCONTINUE">Discontinue</option>
                        </select>
                    </div>

                    <div className="col-lg-4 col-xs-12 mb-3">
                        <label className="form-label fw-bold ms-3">Type:</label>
                        <select className="form-select"
                            value={type}
                            onChange={(event) => setType(event.target.value)}

                        >
                            <option value="Select-Type">Select-Type</option>
                            <option value="NORMAL">Normal</option>
                            <option value="SERVICE">Service</option>
                            <option value="DISCONTINUE">Discontinue</option>
                        </select>
                    </div>    */}

                    {/*  <div className="col-lg-4 col-xs-12 mb-3">
                        <label className="form-label fw-bold ms-3">Hide:</label>
                        <select className="form-select"
                             value={hide}
                             onChange={(event)=>setHide(event.target.value)}
                        >
                            <option value="Select-Hide">Select-Hide</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option> 
                        </select>
                    </div>  */}


                </div>

                <div className="row">
                    <div className="col-lg-6 col-xs-12 mb-3">
                        <label className="form-label fw-bold ms-3">Supplier:</label>
                        {/* <input type="text" value={supplierId} onChange={(event) => setSupplierId(event.target.value)} className="form-control" placeholder="Enter supplier." /> */}
                        <select className="form-select"
                            value={supplierId}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === "other") {
                                    navigate("/addcompany");
                                } else {
                                    setSupplierId(value);
                                }

                            }}
                        >
                            <option value="">Select Company Name</option>

                            {supplier?.map((item) => (
                                <option key={item.id} value={item.id}>{item.name}</option>
                            ))}

                            <option value="other">Other</option>
                        </select>
                    </div>


                     <div className="col-lg-6 col-xs-12 mb-3">
                        <label className="form-label fw-bold ms-3">Company:</label>
                        <input type="text" value={company} onChange={(event) => setCompany(event.target.value)} className="form-control" placeholder="Enter companay." />
                    </div>

                </div>


            {/*    <div className="row">
                    <div className="col-lg-4 col-xs-12 mb-3">
                        <label className="form-label fw-bold ms-3">UNIT 1st:</label>
                        <input type="text" value={unit1} onChange={(event) => setUnit1(event.target.value)} className="form-control" placeholder="Enter unit." />
                    </div>

                    <div className="col-lg-4 col-xs-12 mb-3">
                        <label className="form-label fw-bold ms-3">UNIT 2nd:</label>
                        <input type="text" value={unit2} onChange={(event) => setUnit2(event.target.value)} className="form-control" placeholder="Enter unit." />
                    </div>

                    <div className="col-lg-4 col-xs-12 mb-3">
                        <label className="form-label fw-bold ms-3">Decimal:</label>
                        <input type="text" value={decimal} onChange={(event) => setDecimal(event.target.value)} className="form-control" placeholder="Enter...." />
                    </div>
                </div>      */}


             {/*   <div className="row">
                    <div className="col-lg-4 col-xs-12 mb-3">
                        <label className="form-label fw-bold ms-3">Color Type:</label>
                        <input type="text" value={color} onChange={(event) => setColor(event.target.value)} className="form-control" placeholder="Enter...." />
                    </div>

                    <div className="col-lg-4 col-xs-12 mb-3">
                        <label className="form-label fw-bold ms-3">Item Type:</label>
                        {/* <input type="text" value={item} onChange={(event) => setItem(event.target.value)} className="form-control" placeholder="Enter......" /> 
                        <select className="form-select"
                            value={item}
                            onChange={(event) => setItem(event.target.value)}
                        >
                            <option value="Select-Item-Type">Select-Item-Type</option>
                            <option value="NORMAL">Normal</option>
                            <option value="CONTROLLED">Controlled</option>
                            <option value="SCHEDULED">Scheduled</option>
                        </select>
                    </div>

                    <div className="col-lg-4 col-xs-12 mb-3">
                        <label className="form-label fw-bold ms-3">Company:</label>
                        <input type="text" value={company} onChange={(event) => setCompany(event.target.value)} className="form-control" placeholder="Enter companay." />
                    </div>
                </div>   */}

             {/*   <div className="row">
                    <div className="col-lg-4 col-xs-12 mb-3">
                        <label className="form-label fw-bold ms-3">Salt:</label>
                        <input type="text" value={salt} onChange={(event) => setSalt(event.target.value)} className="form-control" placeholder="Enter salt." />
                    </div>

                    <div className="col-lg-4 col-xs-12 mb-3">
                        <label className="form-label fw-bold ms-3">Category:</label>
                        <input type="text" value={category} onChange={(event) => setCategory(event.target.value)} className="form-control" placeholder="Enter Category." />
                    </div>

                    <div className="col-lg-4 col-xs-12 mb-3">
                        <label className="form-label fw-bold ms-3">HSN/SAC:</label>
                        <input type="text" value={hsn} onChange={(event) => setHsn(event.target.value)} className="form-control" placeholder="Enter...." />
                    </div>
                </div>   */}

                <hr />



                <div className="row">
                   {/* <div className="col-lg-4 col-xs-12 mb-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <label className="form-label fw-bold me-2 mb-0">Local: </label>
                        <input type="text" value={local} onChange={(event) => setLocal(event.target.value)} className="form-control" placeholder="Enter here..." />
                    </div>  */}

                     <div className="col-lg-6 col-xs-12 mb-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <label className="form-label fw-bold me-2 mb-0">M.R.P.: </label>
                        <input type="text" value={mrp} onChange={(event) => setMRP(event.target.value)} className="form-control" placeholder="Enter M.R.P...." />
                    </div>

                    <div className="col-lg-6 col-xs-12 mb-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <label className="form-label fw-bold me-2 mb-0" style={{ whiteSpace: 'nowrap' }}>P Rate: </label>
                        <input type="text" value={prate} onChange={(event) => setPRate(event.target.value)} className="form-control" placeholder="Enter rate..." />
                    </div>
                </div>


              {/*  <div className="row">
                    <div className="col-lg-4 col-xs-12 mb-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <label className="form-label fw-bold me-2 mb-0">Central: </label>
                        <input type="text" value={cental} onChange={(event) => setCentral(event.target.value)} className="form-control" placeholder="Enter Here..." />
                    </div>

                    <div className="col-lg-4 col-xs-12 mb-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <label className="form-label fw-bold me-2 mb-0" style={{ whiteSpace: 'nowrap' }}>IGST % : </label>
                        <input type="text" value={igst} onChange={(event) => setIgst(event.target.value)} className="form-control" placeholder="Enter IGST." />
                    </div>

                    <div className="col-lg-4 col-xs-12 mb-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <label className="form-label fw-bold me-2 mb-0">C.S.R.: </label>
                        <input type="text" value={csr} onChange={(event) => setCSR(event.target.value)} className="form-control" placeholder="Enter C.S.R...." />
                    </div>
                </div>    */}


                <div className="row">
                    <div className="col-lg-4 col-xs-12 mb-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <label className="form-label fw-bold me-2 mb-0" style={{ whiteSpace: 'nowrap' }}>SGST % : </label>
                        <input type="text" value={sgst} onChange={(event) => setSgst(event.target.value)} className="form-control" placeholder="Enter SGST." />
                    </div>  

                    <div className="col-lg-4 col-xs-12 mb-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <label className="form-label fw-bold me-2 mb-0" style={{ whiteSpace: 'nowrap' }}>CGST % : </label>
                        <input type="text" value={cgst} onChange={(event) => setCGST(event.target.value)} className="form-control" placeholder="Enter CGST." />
                    </div>

                    <div className="col-lg-4 col-xs-12 mb-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <label className="form-label fw-bold me-2 mb-0">Conv.CASE: </label>
                        <input type="text" value={case1} onChange={(event) => setCase1(event.target.value)} className="form-control" placeholder="Enter Here...." />
                    </div>

                 {/*   <div className="col-lg-4 col-xs-12 mb-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <label className="form-label fw-bold me-2 mb-0">Cost/: </label>
                        <input type="text" value={cost} onChange={(event) => setCost(event.target.value)} className="form-control" placeholder="Enter Product." />
                    </div>    */}

                </div>


             {/*   <div className="row">
                    <div className="col-lg-4 col-xs-12 mb-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <label className="form-label fw-bold me-2 mb-0" style={{ whiteSpace: 'nowrap' }}>Rate-A: </label>
                        <input type="text" value={rateA} onChange={(event) => setRateA(event.target.value)} className="form-control" placeholder="Enter Here..." />
                    </div>

                    <div className="col-lg-4 col-xs-12 mb-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <label className="form-label fw-bold me-2 mb-0" style={{ whiteSpace: 'nowrap' }}>Rate-B: </label>
                        <input type="text" value={rateB} onChange={(event) => setRateB(event.target.value)} className="form-control" placeholder="Enter Her..." />
                    </div>

                    <div className="col-lg-4 col-xs-12 mb-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <label className="form-label fw-bold me-2 mb-0" style={{ whiteSpace: 'nowrap' }}>Rate-C </label>
                        <input type="text" value={rateC} onChange={(event) => setRateC(event.target.value)} className="form-control" placeholder="Enter Here..." />
                    </div>
                </div>     */}


               {/* <div className="row">
                    <div className="col-lg-4 col-xs-12 mb-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <label className="form-label fw-bold me-2 mb-0">Conv.CASE: </label>
                        <input type="text" value={case1} onChange={(event) => setCase1(event.target.value)} className="form-control" placeholder="Enter Here...." />
                    </div>

                   <div className="col-lg-4 col-xs-12 mb-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <label className="form-label fw-bold me-2 mb-0">Conv.CAS: </label>
                        <input type="text" value={case2} onChange={(event) => setCase2(event.target.value)} className="form-control" placeholder="Enter Here..." />
                    </div>

                    <div className="col-lg-4 col-xs-12 mb-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <label className="form-label fw-bold me-2 mb-0">Negative: </label>
                        <input type="text" value={neg} onChange={(event) => setNeg(event.target.value)} className="form-control" placeholder="Enter Here...." />
                    </div>  
                </div>  */}

                <div className="row">
                    <div className="col-lg-6" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <button onClick={handleSubmitData} type="button" className="btn btn-primary">Save</button>
                    </div>

                    <div className="col-lg-6" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <button onClick={resetData} type="button" className="btn btn-primary">Cancel</button>
                    </div>

                </div>


            </div>
        </div>

    </div>)
}