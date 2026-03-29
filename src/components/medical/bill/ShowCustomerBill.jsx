import { useContext, useState } from "react";
import Header from "../../admin/homepage/Header";
import MainContext from "../../../context/MainContext";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getData } from "../../../services/FetchNodeAdminServices";

export default function ShowCustomerBill() {
  const navigate = useNavigate();

  const { getAllCompany } = useContext(MainContext);

  const [customerBill, setCustomerBill] = useState([]);

  const fetchbill = async () => {
    var result = await getData('medical/api/list/saleBills');
    //  console.log("nnnn",result.data)
    setCustomerBill(result.data)

  }

  useEffect(() => {
    fetchbill();
    getAllCompany();
  }, []);

  const handleNavigateDetails = (item) => {
    navigate('/customerbill', { state: { product: [item], show: 'edit' } });
  }


  return (<div>

    <div>
      <Header />
    </div>

    <div style={{ background: "lightgrey", textAlign: 'center', width: "100%", height: '30px', fontWeight: "bold", fontSize: 20 }}>
      Show Customer Bill
    </div>

    <div className="table-responsive">
      <table className="table table-bordered table-sm">
        <thead className="table-secondary">
          <tr>
            <th className="text-center">Seq</th>
            <th className="text-center">Date</th>
            <th className="text-center">Patient Name</th>
            <th className="text-center">Phone No.</th>
            <th className="text-center">Amount</th>
            <th className="text-center">Discount </th>
            <th className="text-center">Total Amount</th>
            <th className="text-center">Views</th>
          </tr>
        </thead>
        <tbody>
          {
            customerBill.length > 0 ? (

              customerBill.map((item, i) => {
                return (<tr key={i}>

                  <td className="text-center">{i + 1}</td>
                  <td className="text-center">{new Date(item?.createdAt).toDateString().split(' ').slice(0, 4).join('-')}</td>
                  <td className="text-center">{item.Customer_Name}</td>
                  <td className="text-center">{item.phone}</td>
                  <td className="text-center">{item.amount}</td>
                  <td className="text-center">{item.discount}</td>
                  <td className="text-center">{item.TotalAmount}</td>

                  <td className="text-center">
                    <button onClick={() => handleNavigateDetails(item)} className="bg-warning px-3 text-uppercase text-white rounded border border-0">Update</button>
                  </td>
                </tr>
                )
              }
              )
            )
              : (
                <tr>
                  <td colSpan="10" className="text-center">
                    No Data Available
                  </td>
                </tr>
              )
          }
        </tbody>
      </table>
    </div>

    <div className="d-flex justify-content-center">
      <button onClick={() => navigate('/customerbill')} className="bg-primary rounded px-3 py-1 border-0">Add Bill</button>
    </div>


  </div>)
}