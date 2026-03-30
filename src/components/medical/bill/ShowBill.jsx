import { useContext, useState } from "react";
import Header from "../../admin/homepage/Header";
import MainContext from "../../../context/MainContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getData } from "../../../services/FetchNodeAdminServices";



export default function ShowBill()
{
  
    const navigate=useNavigate();
    const { supplier, product, getAllCompany, getAllProduct } = useContext(MainContext);

    const [bill,setBill]=useState([]);

    const fetchbill=async()=>{
        var result=await getData('medical/api/list/purchaseBills');
        // console.log("nnnn",result.data)
        setBill(result.data)

    }

    useEffect(() => {
        getAllCompany();
        getAllProduct();
        fetchbill();
      }, []);

      const handleNavigateData=(item)=>{
        navigate('/bill', { state: { product: [item], show:'edit' } });
      }

      


    
    return(<div>

        <div>
            <Header/>
        </div>

        <div style={{ background: "lightgrey", textAlign: 'center', width: "100%", height: '30px', fontWeight: "bold", fontSize: 20 }}>

               <div>Show Bill</div>
         </div>

         <div className="table-responsive">
           <table className="table table-bordered table-sm">
            <thead className="table-secondary">
              <tr>
                <th className="text-center">Seq</th>
                <th className="text-center">Company Name</th>
                <th className="text-center">Bill No.</th>
                <th className="text-center">Product Name & Pack</th>
                <th className="text-center">Expire Date</th>
                <th className="text-center">Qty</th>
                <th className="text-center">M.R.P</th>
                <th className="text-center">G.S.T.</th>
                <th className="text-center">Amount</th>
                <th className="text-center">S.G.S.T.</th>
                <th className="text-center">C.G.S.T.</th>
                <th className="text-center">Discount </th>
                <th className="text-center">Total Amount </th>
                <th className="text-center">View</th>

              </tr>
            </thead>
        <tbody>
          {
            bill.length > 0 ? (

              bill.map((item, i) => {

                const Company_Name=supplier?.find(s => s.id == item.supplierId)?.name || item.supplierId  //company ka name nikal liya h
                const firstItem = item.items?.[0] || {};  // array k anger array h
                const Product_Name = product?.find(p => p.id == firstItem.productId)?.name|| firstItem.productId;

                return (<tr key={i}>
                  

                  <td className="text-center">{i + 1}</td>
                  <td className="text-center"> {Company_Name}</td>
                  <td className="text-center">{item.invoiceNo}</td>
                  <td className="text-center">{Product_Name} {firstItem.product.packing}</td>
                  <td className="text-center">{item.invoiceDate ? item.invoiceDate.slice(0, 10) : ""}</td>
                  <td className="text-center">{firstItem.quantity}</td>
                  <td className="text-center">{firstItem.mrp}</td>
                  <td className="text-center">{item.totalGST}</td>
                  <td className="text-center">{item.taxableAmount}</td>
                  <td className="text-center">{item.sgstPayable}</td>
                  <td className="text-center">{item.cgstPayable}</td>
                  <td className="text-center">{item.discount}</td>
                  <td className="text-center">{item.totalAmount}</td>

                  <td className="text-center">
                    <button onClick={()=>handleNavigateData(item)} className="bg-warning px-3 text-uppercase text-white rounded border border-0">Update</button>
                  </td> 
                </tr>
                )
              }
              )
            )
              : (
                <tr>
                  <td colSpan="14" className="text-center">
                    No Data Available
                  </td>
                </tr>
              )
          }
        </tbody>
      </table>
    </div>

 <div className="d-flex justify-content-center">
      <button onClick={()=>navigate('/bill')} className="bg-primary rounded px-3 py-1 border-0">Add Bill</button>
    </div>

    </div>)
}